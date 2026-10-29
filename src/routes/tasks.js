const express = require('express');
const router = express.Router();

const validateTask = require('../middleware/validateTask');

let tasks = [
    { id: 1, title: 'Learn Express', done: false },
    { id: 2, title: 'Build REST API', done: true },
    { id: 3, title: 'Write Tests', done: false }
];

// GET tasks with filtering and pagination
router.get('/', (req, res) => {
    let result = [...tasks];

    if (req.query.done !== undefined) {
        result = result.filter(
            task => String(task.done) === req.query.done
        );
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);

    const start = (page - 1) * limit;
    const data = result.slice(start, start + limit);

    res.json({
        data,
        page,
        totalPages: Math.ceil(result.length / limit)
    });
});

// GET task by ID
router.get('/:id', (req, res) => {
    const task = tasks.find(
        task => task.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }

    res.json(task);
});

// POST new task
router.post('/', validateTask, (req, res) => {
    const newTask = {
        id: tasks.length
            ? Math.max(...tasks.map(task => task.id)) + 1
            : 1,
        title: req.body.title.trim(),
        done: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// PUT update task
router.put('/:id', validateTask, (req, res) => {
    const task = tasks.find(
        task => task.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }

    task.title = req.body.title.trim();

    if (typeof req.body.done === 'boolean') {
        task.done = req.body.done;
    }

    res.json(task);
});

// DELETE task
router.delete('/:id', (req, res) => {
    const index = tasks.findIndex(
        task => task.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }

    const removed = tasks.splice(index, 1)[0];

    res.json(removed);
});

module.exports = router;
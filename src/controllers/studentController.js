const Student = require('../models/Student');

// CREATE STUDENT
exports.createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// GET ALL STUDENTS WITH SORTING
exports.getStudents = async (req, res) => {
    try {
        const { sortBy } = req.query;

        let sort = {};

        if (sortBy) {
            const [field, direction] = sortBy.split(':');

            if (['name', 'rollNo', 'age'].includes(field)) {
                sort[field] = direction === 'desc' ? -1 : 1;
            }
        }

        const students = await Student.find().sort(sort);

        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE STUDENT
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        res.status(200).json(student);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid student id'
            });
        }

        res.status(400).json({ error: err.message });
    }
};

// DELETE STUDENT
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        res.status(200).json({
            message: 'Student deleted',
            deleted: student
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid student id'
            });
        }

        res.status(500).json({ error: err.message });
    }
};

// SEARCH STUDENTS
exports.searchStudents = async (req, res) => {
    const { query = '', sortBy } = req.query;

    try {
        const filter = query
            ? { name: { $regex: query, $options: 'i' } }
            : {};

        let sort = {};

        if (sortBy) {
            const [field, direction] = sortBy.split(':');

            if (['name', 'rollNo', 'age'].includes(field)) {
                sort[field] = direction === 'desc' ? -1 : 1;
            }
        }

        const students = await Student.find(filter).sort(sort);

        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
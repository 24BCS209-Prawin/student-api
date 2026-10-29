const router = require('express').Router();
const ctrl = require('../controllers/studentController');

router.get('/search', ctrl.searchStudents);
router.post('/', ctrl.createStudent);
router.get('/', ctrl.getStudents);
router.put('/:id', ctrl.updateStudent);
router.delete('/:id', ctrl.deleteStudent);

module.exports = router;
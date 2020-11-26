const express = require('express');
const Course = require('../models/Course');
const advanceResults = require('../middleware/advanceResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({
    mergeParams: true
});

const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')





router.route('/').get(advanceResults(Course, {
    // path merujuk pada objek yang dicari dalam model
    path: 'bootcamp',
    select: 'name description'
}), getCourses).post(protect, authorize('publisher', 'admin'), addCourse);
router.route('/:id').get(getCourse).put(protect, authorize('publisher', 'admin'), updateCourse).delete(protect, authorize('publisher', 'admin'), deleteCourse);


module.exports = router;
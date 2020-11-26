const express = require('express');
const Course = require('../models/Course');
const advanceResults = require('../middleware/advanceResults');
const { protect } = require('../middleware/auth');

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
}), getCourses).post(addCourse);
router.route('/:id').get(getCourse).put(protect, updateCourse).delete(protect, deleteCourse);


module.exports = router;
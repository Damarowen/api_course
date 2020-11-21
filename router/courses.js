const express = require('express');
const {
    getCourses
    // createCourse,
    // updateCourse,
    // getCourse,
    // deleteCourse
} = require('../controllers/courses')

const router = express.Router({ mergeParams: true});
router.route('/').get(getCourses);
// router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
// router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)


module.exports = router;
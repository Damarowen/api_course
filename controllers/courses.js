const Courses = require('../models/Course')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');


// @desc  GET courses
// @access  Public

exports.getCourses = asyncHandler(async (req, res, next) => {

    let query;

    if (req.params.bootcampId) {
        // @route  GET /api/v1/bootcamps/:bootcampId/courses
        // mencari id bootcamp di dalam data course
        query = Course.find({
            bootcamp: req.params.bootcampId
        });
    } else {
        // @route  GET /api/v1/courses
        query = Course.find();
    }

    const courses = await query;

    // res.status(200).send(courses)
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })

})
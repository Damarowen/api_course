const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


// @desc  GET ALL courses
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
        query = Course.find().populate({
            // path merujuk pada objek yang dicari dalam model
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    // res.status(200).send(courses)
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })

})


// @desc  GET single courses
// @route  /api/v1/courses/:id
// @access  Public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404)
    }

    // res.status(200).send(courses)
    res.status(200).json({
        success: true,
        data: course
    })

})

// @desc POST single courses
// @route  /api/v1/bootcamps/:bootcampId/courses
// @access  Public

exports.addCourse = asyncHandler(async (req, res, next) => {

    //passing bootcamp id to req body so user shouldnt add id bootcamp
    req.body.bootcamp = req.params.bootcampId;
    console.log(`this is req body bootcamp ${req.body.bootcamp}`)
    console.log("-------======")
    console.log(req.body)
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404))
    };

    const course = await Course.create(req.body);

    // res.status(200).send(courses)
    res.status(200).json({
        success: true,
        data: course
    })

})

// @desc PUT single courses
// @route  /api/v1/courses/:id
// @access  Public

exports.updateCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true,
        data: course
    })

})


// @desc DELETE single courses
// @route  /api/v1/courses/:courseId
// @access  Public

exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404)
    };

    //trigger middleware cascade remove
    await course.remove();

    // res.status(200).send(courses)
    res.status(200).json({
        success: true,
        data: {}
    })

    console.log(`${req.params.id} deleted`)


})
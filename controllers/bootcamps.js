const path = require('path')
const geoCoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')


// @desc  GET all bootcamps
// @route  GET /api/v1/bootcamps
// @access  Public
exports.getAllBootcamp = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advanceResults);

});



// @desc  POST bootcamps
// @route  POST /api/v1/bootcamps
// @access  Public
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body);
    res.status(200).json({
        success: true,
        data: bootcamp,
        msg: "created bootcamp"
    });


})


// @desc  GET single bootcamps
// @route  GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    //FOR MORE VALIDATION
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    };
    res.status(200).json({
        success: true,
        data: bootcamp
    });


})


// @desc  PUT single bootcamps
// @route  PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    //FOR MORE VALIDATION
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    };
    res.status(200).json({
        success: true,
        data: bootcamp
    });


})



// @desc  DELETE single bootcamps
// @route  DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {


    const bootcamp = await Bootcamp.findById(req.params.id);
    //FOR MORE VALIDATION
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    };

    //trigger middleware cascade remove
    bootcamp.remove();

    res.status(200).json({
        success: true,
        data: {},
        msg: "deleted bootcamp"
    });
    console.log(`${req.params.id} deleted`)



})



// @desc  upload photo for bootcamp
// @route  PUT /api/v1/bootcamps/:id.photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    //FOR MORE VALIDATION
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    };

    if (!req.files) {
        return next(new ErrorResponse('please upload a file', 400))
    };

    console.log("=============");

    const file = req.files.file

    
    // make sure the image is a photo

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('please upload a IMAGE file', 400))
    };

    // check filesize

    const size = 10000000;
    if (file.size > size) {
        return next(new ErrorResponse(`please upload a IMAGE less than ${size}`, 400));
    }


    // create custom file name
    // path disini untuk ambil ekstensi
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
    console.log(file.name)

file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if(err){
        console.log(err);
        return next(new ErrorResponse('problem with file upload', 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {
        photo: file.name
    });

    res.status(200).json({
        success: true,
        data: file.name
    });
})

})


// @desc  get bootcamps within a radius
// @route  GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {

    // pull out from url
    const {
        zipcode,
        distance
    } = req.params;

    //get lat/lng from geocoder

    const loc = await geoCoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // calc radius using radians
    // divide dist by radius of Earth
    // earth radius - 3,963 mi / 6,378 klometers

    const radius = distance / 3963
    const bootcamp = await Bootcamp.find({

        //center sphere from mongo manual
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius
                ]
            }
        }

    });

    res.status(200).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp
    });


})
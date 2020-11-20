const geoCoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

// @desc  GET all bootcamps
// @route  GET /api/v1/bootcamps
// @access  Public
exports.getAllBootcamp = asyncHandler(async (req, res, next) => {

    let query;


    // create copy of req query
    const reqQuery = {
        ...req.query
    };

    //field to exclude
    const removeField = ['select', 'sort'];

    //loop over removeFiled and delete them from req query
    removeField.forEach(param => delete reqQuery[param]);


    // send to server
    let queryStr = JSON.stringify(reqQuery);

    // create query with operator filter
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|in)\b/g, match => `$${match}`);


    //finding resource
    query = Bootcamp.find(JSON.parse(queryStr));

    //jika permintaan ada select
    if (req.query.select) {
        //split use for i.e name,address join use for i.e name addreess
        const field = req.query.select.split(',').join(' ');
        query = query.select(field);
    };

    //if req sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy);
    } else {
        //default 
        query = query.sort('-createdAt');
    }

    const bootcamp = await query

    res.status(200).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp
    });
    
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


<<<<<<< HEAD
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        //FOR MORE VALIDATION
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        };
        res.status(200).json({
            success: true,
            data: bootcamp,
            msg: "deleted bootcamp"
        });
        console.log(`${req.params.id} deleted`)

       
=======
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    //FOR MORE VALIDATION
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    };
    res.status(200).json({
        success: true,
        data: bootcamp,
        msg: "deleted bootcamp"
    });
    console.log(`${req.params.id} deleted`)

    // res.status(400).json({
    // success: false
    // })
    // next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    // next(err)

>>>>>>> dcac5663172f1e61a2991c17a144deeecfa50d85
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
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

// @desc  GET all bootcamps
// @route  GET /api/v1/bootcamps
// @access  Public
exports.getAllBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.find();
    res.status(200).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp
    });
    //catch (err)
    // res.status(400).json({
    // success: false
    // });
    // next(err)
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

    // res.status(400).json({
    // success: false
    // });
    // next(err)
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
    // catch (err) {
    // res.status(400).json({
    // success: false
    // })
    // next(err);
    // next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

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
    // catch (err) 
    // res.status(400).json({
    // success: false
    // })
    // next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    // next(err);


})



// @desc  DELETE single bootcamps
// @route  DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {


        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        //FOR MORE VALIDATION
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        };
        res.status(200).json({
            success: true,
            data: bootcamp,
            msg: "created bootcamp"
        });
        console.log(`${req.params.id} deleted`)

        // res.status(400).json({
        // success: false
        // })
        // next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        // next(err)

})
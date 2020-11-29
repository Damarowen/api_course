const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');



// @desc get review
// @route  GET /api/v1/reviews
// @route  GET /api/v1/nootcamps/:bootcampid/review
// @access  public
exports.getReviews = asyncHandler ( async ( req,res,next) => {

    if (req.params.bootcampId) {
        // @route  GET /api/v1/bootcamps/:bootcampId/courses
        // mencari id bootcamp di dalam data course
        const reviews = await Course.find({
            bootcamp: req.params.bootcampId
        });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advanceResults);
    }

});


// @desc get single review
// @route  GET /api/v1/reviews/:id
// @access  public
exports.getReview = asyncHandler ( async ( req,res,next) => {

    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!review) {
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`), 404)
    }

    // res.status(200).send(courses)
    res.status(200).json({
        success: true,
        data: review
    })

});



// @desc add single review
// @route POST /api/v1/bootcamps/:bootcampsid/reviews
// @access  PRIVATE ADMIN
exports.addReview = asyncHandler ( async ( req,res,next) => {

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404))
    };


    const review = await Review.create(req.body);

    // res.status(200).send(courses)
    res.status(200).json({
        success: true,
        data: review
    })
    
});

// @desc update single review
// @route PUT /api/v1/review/:id
// @access  PRIVATE ADMIN
exports.updateReview = asyncHandler ( async ( req,res,next) => {

    
    let review = await Review.findById(req.params.id);
    if (!review) {
      return next(
        new ErrorResponse(`No review with the id of ${req.params.id}`),
        404
      );
    }
    // Make sure user is course owner
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update review ${review._id}`,
          401
        )
      );
    }
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      success: true,
      data: review
    });
    
});


// @desc delete single review
// @route PUT /api/v1/review/;id
// @access  PRIVATE ADMIN
exports.deleteReview = asyncHandler ( async ( req,res,next) => {
    

    const review = await Review.findById(req.params.id)

    if (!review) {
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`), 404)
    };


    // Make sure user is bootcamp owner
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete review to this bootcamp`, 401))
    }

    //trigger middleware cascade remove
    await review.remove();

    // res.status(200).send(courses)
    res.status(200).json({
        success: true,
        data: {}
    })

    console.log(`${req.params.id} deleted`)

});
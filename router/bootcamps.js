const express = require('express');
// for advanceResults middleware
const Bootcamp = require('../models/Bootcamp');
const advanceResults = require('../middleware/advanceResults');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    getAllBootcamp,
    createBootcamp,
    updateBootcamp,
    getBootcamp,
    deleteBootcamp,
    bootcampPhotoUpload,
    getBootcampsInRadius
} = require('../controllers/bootcamps')



router.route('/').get(advanceResults(Bootcamp, 'fromCourses'), getAllBootcamp).post(protect,  authorize('publisher', 'admin'),createBootcamp);
router.route('/:id').get(getBootcamp).put(protect,  authorize('publisher', 'admin'), updateBootcamp).delete(protect, authorize('publisher', 'admin'), deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

// re-route into other resource routers
//GET /api/v1/bootcamps/:bootcampId/courses
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');


///:bootcampId/courses is same to /api/v1/courses
router.use('/:bootcampId/courses', courseRouter)


router.use('/:bootcampId/reviews', reviewRouter)



module.exports = router;
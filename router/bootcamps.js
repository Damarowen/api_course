const express = require('express');
const {
    getAllBootcamp,
    createBootcamp,
    updateBootcamp,
    getBootcamp,
    deleteBootcamp,
    bootcampPhotoUpload,
    getBootcampsInRadius
} = require('../controllers/bootcamps')


const router = express.Router();

router.route('/').get(getAllBootcamp).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/:id/photo').put(bootcampPhotoUpload)

// re-route into other resource routers
//GET /api/v1/bootcamps/:bootcampId/courses
const courseRouter = require('./courses');

///:bootcampId/courses is same to /api/v1/courses
router.use('/:bootcampId/courses', courseRouter)


module.exports = router;
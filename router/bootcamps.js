const express = require('express');
const {
    getAllBootcamp,
    createBootcamp,
    updateBootcamp,
    getBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
} = require('../controllers/bootcamps')


const router = express.Router();

// re-route into other resource routers
//GET /api/v1/bootcamps/:bootcampId/courses
const courseRouter = require('./courses');

///:bootcampId/courses is samme to /api/v1/courses
router.use('/:bootcampId/courses', courseRouter)

router.route('/').get(getAllBootcamp).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)


module.exports = router;
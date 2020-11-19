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
router.route('/').get(getAllBootcamp).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)


module.exports = router;
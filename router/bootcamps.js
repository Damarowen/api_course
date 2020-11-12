const express = require('express');
const {
    getAllBootcamp,
    createBootcamp,
    updateBootcamp,
    getBootcamp,
    deleteBootcamp
} = require('../controllers/bootcamps')

const router = express.Router();
router.route('/').get(getAllBootcamp).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);


module.exports = router;
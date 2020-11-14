const Bootcamp = require('../models/Bootcamp')

// @desc  GET all bootcamps
// @route  GET /api/v1/bootcamps
// @access  Public
exports.getAllBootcamp = async (req, res, next) => {

    try {
        const bootcamps = await Bootcamp.find()
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }

}

// @desc  POST bootcamps
// @route  POST /api/v1/bootcamps
// @access  Public
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(200).json({
            success: true,
            data: bootcamp,
            msg: "created bootcamp"
        })

    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}


// @desc  GET single bootcamps
// @route  GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        //FOR MORE VALIDATION
        if(!bootcamp){
            res.status(404).json({
                success: false,
                msg: 'not found'
            })
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }


}


// @desc  PUT single bootcamps
// @route  PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        //FOR MORE VALIDATION
        if(!bootcamp){
            res.status(404).json({
                success: false,
                msg: 'not found'
            })
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}



// @desc  DELETE single bootcamps
// @route  DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
   
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        //FOR MORE VALIDATION
        if(!bootcamp){
            res.status(404).json({
                success: false,
                msg: 'not found'
            })
        }
        res.status(200).json({
            success: true,
            msg: 'deleted'
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
   
}
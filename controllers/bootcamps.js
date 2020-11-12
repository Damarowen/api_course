// @desc  GET all bootcamps
// @route  GET /api/v1/bootcamps
// @access  Public
 exports.getAllBootcamp =  (req,res,next) => {
    res.status(200).json({ success: true, msg: "show all bootcamps"})
}

// @desc  POST bootcamps
// @route  POST /api/v1/bootcamps
// @access  Public
exports.createBootcamp =  (req,res,next) => {
        res.status(200).json({ success: true, msg: "created bootcamp"})
}


// @desc  GET single bootcamps
// @route  GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp =  (req,res,next) => {
    res.status(200).json({ success: true, msg: `get bootcamp ${req.params.id}`})
}


// @desc  PUT single bootcamps
// @route  PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp =  (req,res,next) => {
    res.status(200).json({ success: true, msg: `edit bootcamp ${req.params.id}`})
}



// @desc  DELETE single bootcamps
// @route  DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp =  (req,res,next) => {
    res.status(200).json({ success: true, msg: `delete bootcamp ${req.params.id}`})
}



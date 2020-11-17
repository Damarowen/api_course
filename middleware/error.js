const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {

    let error = {
        ...err
    };
    error.message = err.message
    // log to console
    console.log(err.stack.red);

    // mongoose bad objectId
    if (err.name === 'CastError') {
        const message = `not found with id of ${err.value}`
        error = new ErrorResponse(message, 404)
    }

    // mongoose duplicate filed customice error handling
    if (err.code === 11000) {
        const message = `duplicate field value ${err.value}`
        error = new ErrorResponse(message, 404)
    }

    // mongoose validation customize error handling

    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message
    })
}

module.exports = errorHandler
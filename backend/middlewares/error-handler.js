const { StatusCodes } = require('http-status-codes');


const errorHandlerMiddleware = (err, req, res, next) => {
    if(!err.statusCode) {
        console.log(err);
    }

    let customError = {
        msg: err.message || 'Something went wrong, please try again later.',
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }


    if(err.name === 'ValidationError'){
        customError.msg = {};
        Object.keys(err.errors).forEach(key => {
            customError.msg[key] = err.errors[key].message;
        })
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if(err.code && err.code === 11000){
        customError.msg = `${Object.keys(err.keyValue)} is already in use . Please try with another value .`
        customError.statusCode =StatusCodes.BAD_REQUEST;
    }

    if(err.name === 'CastError') {
        customError.msg = `No item found with id : ${err.value}`;
        customError.statusCode = StatusCodes.NOT_FOUND;
    }

    res.status(customError.statusCode).json({ msg: customError.msg });
}


module.exports = errorHandlerMiddleware;
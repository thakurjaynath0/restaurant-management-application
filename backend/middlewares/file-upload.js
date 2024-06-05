const path = require('path');
const multer = require('multer');
const { generateToken } = require('../utils');
const SETTINGS = require('../settings');
const CustomError = require('../errors');

const imageStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(SETTINGS.MEDIA_ROOT, 'images'))
    },

    filename: (req, file, cb) => {
        let fileType = file.mimetype.split('/').splice(-1)[0];
        cb(null, generateToken(16) + '.' + fileType)
    }
})


const uploadImage = multer({
    storage:imageStorageEngine, 
    limits:{
        fileSize: 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith('image/')){
            return cb(new CustomError.BadRequestError('Please upload image file .'));
        }

        const fileSize = req.headers['content-length'];
        if(fileSize > 1024 * 1024){
            return cb(new CustomError.BadRequestError('Upload image below 1MB size .'));
        }

        cb(null, true);
    }
})

module.exports = { uploadImage };
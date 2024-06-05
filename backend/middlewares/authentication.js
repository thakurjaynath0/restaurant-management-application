const CustomError = require('../errors');
const { isTokenValid } = require('../utils');
const User = require('../user/User');


const authenticateUser = async (req, res, next) => {
    const accessToken  = req.signedCookies?.accessToken;
    if(!accessToken) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid .');
    }

    try{
        const {name, userId, role} = isTokenValid(accessToken);
        // req.user = { name, userId, role };
        req.user = await User.findOne({ _id:userId });

        const allowedRoles = {
            superuser:['superuser','admin', 'staff'],
            admin:['admin','staff'],
            staff:['none']
        }
        req.allowedRoles = allowedRoles[req.user.role];

        next();
    } catch (err) {
        console.log(err);
        throw new CustomError.UnauthenticatedError('Authentication Invalid .');
    }
}


const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            throw new CustomError.UnauthorizedError('Permission Denied .');
        }
        next();
    }
}


const authorizeStaff = (...positions) => {
    return (req, res, next) => {
        if(['admin', 'superuser'].includes(req.user.role)) return next();
        if(!positions.includes(req.user.position)){
            throw new CustomError.UnauthorizedError('Permission Denied .');
        }
        next();
    }
}


module.exports = { authenticateUser, authorizePermissions, authorizeStaff }
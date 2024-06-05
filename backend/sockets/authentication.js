const CustomError = require('../errors');
const { isTokenValid } = require('../utils');
const User = require('../user/User');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');

const authenticateUser = async (socket, req, res, next) => {
    const parsedCookie = cookie.parse(req.headers.cookie || "");
    const signedCookies = cookieParser.signedCookies(parsedCookie, process.env.JWT_SECRET);
    const accessToken  = signedCookies?.accessToken;

    if(!accessToken) {
        next(new CustomError.UnauthenticatedError('Authentication Invalid .'));
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
        next(new CustomError.UnauthenticatedError('Authentication Invalid .'));
    }
}


module.exports = { authenticateUser }
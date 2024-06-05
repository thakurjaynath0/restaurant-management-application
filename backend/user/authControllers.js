const User = require('./User');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { attachAccessCookieToResponse, objectExcept, objectWith } = require('../utils');


const login = async (req, res) => {
    const query = objectWith(req.body, ['username', 'password']);

    if(!query?.username || !query?.password){
        throw new CustomError.BadRequestError('Please provide username and password .');
    }

    const user = await User.findOne({ username:query?.username });
    if(!user){
        throw new CustomError.UnauthenticatedError('Invalid credentials .');
    }

    if(!user.isAllowedToLogin){
        throw new CustomError.UnauthorizedError('Permission Denied .');
    }

    const isPasswordCorrect = await user.comparePassword(query?.password);
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('Invalid credentials .');
    }

    const userPayload = await user.createJWTPayload();
    attachAccessCookieToResponse({ res, user:userPayload })

    res.status(StatusCodes.OK).json();
};


const logout = async (req, res) => {
    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        maxAge:0
    })
    res.status(StatusCodes.OK).json({ msg:'Logged out successfully !! '});
};


module.exports = {
    login,
    logout
}
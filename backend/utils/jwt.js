const JWT = require('jsonwebtoken');

const createJWT = ({ payload }) => {
    const token = JWT.sign(payload, process.env.JWT_SECRET, {});
    return token;
}

const isTokenValid = (token) => JWT.verify(token, process.env.JWT_SECRET);

const attachAccessCookieToResponse = ({ res, user }) => {
    const accessTokenJWT = createJWT({ payload : user });
    const fiveHours = 1000 * 60 * 60 * 5;

    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        maxAge: fiveHours,
    })
}


module.exports = {
    createJWT,
    isTokenValid,
    attachAccessCookieToResponse
}
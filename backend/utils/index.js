const {
    createJWT,
    isTokenValid,
    attachAccessCookieToResponse
} = require('./jwt');

const { checkPermission } = require('./checkPermissions');

const {objectWith, objectExcept} = require('./objectMinifier');

const generateQR = require('./qrcode/qrcode');

const generateInvoicePdf = require('./pdf/invoicePdf'); 

const generateToken = require('./hexToken');

module.exports = {
    createJWT,
    isTokenValid,
    attachAccessCookieToResponse,
    objectWith,
    objectExcept,
    checkPermission,
    generateQR,
    generateInvoicePdf,
    generateToken,
}
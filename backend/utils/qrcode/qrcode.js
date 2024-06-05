const QRcode = require('qrcode');
const SETTINGS = require('../../settings')
const path = require('path');

const generateQR = async (text, filename) => {
    const qrPath = path.join(SETTINGS.MEDIA_ROOT, `/qr/${filename}`)
    try {
        await QRcode.toFile(qrPath, text);
        return SETTINGS.DOMAIN + SETTINGS.MEDIA_URL + `/qr/${filename}`;
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = generateQR;

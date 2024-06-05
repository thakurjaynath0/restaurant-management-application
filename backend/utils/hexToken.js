const crypto = require('crypto');

const generateToken = (bytes) => {
    return crypto.randomBytes(bytes).toString('hex');
}

module.exports = generateToken;
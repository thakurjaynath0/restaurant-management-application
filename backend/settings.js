const path = require('path');

module.exports = {
    DOMAIN:`http://${process.env.SERVER_IP}:5000`,
    MEDIA_URL:'/media',
    MEDIA_ROOT : path.join(__dirname, './media'),
    STATIC_URL: '/static',
    STATIC_ROOT : path.join(__dirname, './build/static')
}
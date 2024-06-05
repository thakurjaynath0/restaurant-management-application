const User = require('../user/User');
const CustomError = require('../errors/');

const checkPermission = async ({ user, resourceUserId }) => {
    const precedence = {
        'superuser':0,
        'admin':1,
        'staff':2,
    }
    const resourceUser = await User.findOne({ _id:resourceUserId })
    // console.log(resourceUser);
    if(precedence[user.role] < precedence[resourceUser?.role]){
        return;
    }

    if(String(user._id) === String(resourceUserId) ){
        return;
    }

    throw new CustomError.UnauthorizedError('Permission Denied .');
};


module.exports = {
    checkPermission
}
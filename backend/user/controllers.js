const User = require('./User');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { objectWith, objectExcept, checkPermission } = require('../utils');


// create user --admin,superuser
// update user --admin,superuser  | admin -> staff, superuser -> admin, staff
// reset user password --admin,superuser | admin -> staff, superuser -> admin, staff
// get current user -- staff, admin, superuser | self
// get single user -- admin, superuser | admin -> staff, superuser -> admin, staff
// delete user -- admin, superuser | admin -> staff, superuser -> admin, staff


const createUser = async (req, res) => {
    const query = objectExcept(req.body, ['_id','role', 'isAllowedToLogin']);

    const role = 'staff';
    const isUsernameTaken = await User.findOne({ username:query?.username });

    if (isUsernameTaken) {
        throw new CustomError.BadRequestError('Username already taken .');
    }
    const user = await User.create({ ...query, role });

    res.status(StatusCodes.CREATED).json({
        user: {
            id: user._id,
            name: user.name,
            username: user.username,
            isAllowedToLogin: user.isAllowedToLogin,
        }
    })
}


const updateUser = async (req, res) => {
    const { id:userId } = req.params;
    const query  = objectExcept(req.body, ['_id','password', 'role']);
    
    await checkPermission({ user: req.user, resourceUserId: userId });

    const updatedUser = await User.findOneAndUpdate({ _id:userId }, query, {
        runValidators:true,
        new:true
    });

    if(!updatedUser) {
        throw new CustomError.NotFoundError(`User with id:${userId} does not exist`);
    }

    res.status(StatusCodes.OK).json(objectExcept(updatedUser?._doc, ['password']));
};


const resetPassword = async (req, res) => {
    const query = objectWith(req.body, ['password']);
    const { id:userId } = req.params;

    const user = await User.findOne({ _id:userId });
    if (!user) {
        throw new CustomError.NotFoundError(`No user found with id :${query?.id} .`);
    }
    
    if(req.user.id === query?.id){
        throw new CustomError.UnauthorizedError('Permission Denied .');
    }
    await checkPermission({ user:req.user, resourceUserId:user._id });
    
    user.password = query?.password;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: 'Password changed successfully .' });
}


const getAllUsers = async (req, res) => {
    const users = await User.find({ role: req.allowedRoles }).select('-password');
    res.status(StatusCodes.OK).json({ users });
};


const getSingleUser = async (req, res) => {
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: userId }).select('-password');

    if (!user) {
        throw new CustomError.NotFoundError(`No user found with id :${userId} .`);
    }

    await checkPermission({ user:req.user, resourceUserId:user._id });
    res.status(StatusCodes.OK).json({ user })
}


const getCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({
        id:req.user._id,
        name:req.user.name,
        username:req.user.username,
        role:req.user.role,
        position:req.user.position,
        profile_pic:req.user.profile_pic
    })
}


const deleteUser = async (req, res) => {
    const { id:userId } = req.params;

    const user = await User.findOne({ _id:userId });
    if(!user){
        throw new CustomError.NotFoundError(`No user found with id :${userId} .`);
    }
    
    if(req.user.id === userId){
        throw new CustomError.UnauthorizedError('Permission Denied .');
    }
    
    await checkPermission({ user:req.user, resourceUserId:user._id });
    await user.remove();
    
    res.status(StatusCodes.OK).json({ msg: 'User deleted successfully .' });
};


const uploadProfilePic = async (req, res) => {
    if(!req.file){
        throw new CustomError.BadRequestError('Please provide image to upload .');
    }
    console.log(req.file)
    const filePath = req.file.path.replace(process.env.PWD, '');

    res.status(StatusCodes.OK).json({ filePath });
}


module.exports = {
    createUser,
    updateUser,
    getAllUsers,
    resetPassword,
    getSingleUser,
    getCurrentUser,
    deleteUser,
    uploadProfilePic
}
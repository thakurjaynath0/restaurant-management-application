const express = require('express');
const router = express.Router();

const { authenticateUser, authorizePermissions } = require('../middlewares/authentication');

const { createUser, updateUser, getAllUsers, resetPassword, getSingleUser, getCurrentUser, deleteUser, uploadProfilePic } = require('./controllers');
const { login, logout } = require('./authControllers');
const { uploadImage } = require('../middlewares/file-upload');

router.route('/')
.post([authenticateUser, authorizePermissions('admin', 'superuser')],createUser)
.get([authenticateUser, authorizePermissions('admin','superuser')], getAllUsers)

router.post('/auth/login',login)
router.get('/auth/logout',[authenticateUser] , logout)
router.get('/me',[authenticateUser], getCurrentUser)

router.post('/profilePic', [authenticateUser, authorizePermissions('admin', 'superuser'), uploadImage.single('image')], uploadProfilePic)

router.route('/:id')
.patch([authenticateUser, authorizePermissions('admin', 'superuser')], updateUser)
.get([authenticateUser, authorizePermissions('admin', 'superuser')], getSingleUser)
.delete([authenticateUser, authorizePermissions('admin', 'superuser')], deleteUser)

router.post('/:id/resetPassword',[authenticateUser, authorizePermissions('admin', 'superuser')], resetPassword)

module.exports = router;
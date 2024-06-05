const express = require('express');
const router = express.Router();

const { authenticateUser, authorizePermissions, authorizeStaff} = require('../middlewares/authentication');

const {getAllItems,getItem,searchItem,createItem, updateItem, deleteItem, uploadItemImage,} = require('./menuController');
const { getAllCategory,getCategory,createCategory,updateCategory,deleteCategory,getCategoryItems,} = require('./menuCategoryController');
const { uploadImage } = require('../middlewares/file-upload');

router.use(authenticateUser);

router.route('/')
.get(getAllItems)
.post([authorizePermissions('admin', 'superuser')],createItem);

router.route('/itemImage').post([authenticateUser, authorizeStaff(['waiter'])], uploadImage.single('image'), uploadItemImage)

router.route('/search')
.post(searchItem);

router.route('/category')
.get(getAllCategory)
.post([authorizePermissions('admin', 'superuser')], createCategory);

router.route('/category/:id')
.get(getCategory)
.patch([authorizePermissions('admin', 'superuser')], updateCategory)
.delete([authorizePermissions('admin', 'superuser')], deleteCategory);

router.route('/categoryitems/:id')
.get(getCategoryItems);

router.route('/:id')
.get(getItem)
.patch([authorizePermissions('admin', 'superuser')], updateItem)
.delete([authorizePermissions('admin', 'superuser')], deleteItem);
 

module.exports = router;
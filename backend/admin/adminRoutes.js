const path = require('path');
const express = require('express')
const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')
const { authenticateUser, authorizePermissions } = require('../middlewares/authentication');

AdminBro.registerAdapter(AdminBroMongoose)
const mongoose = require('mongoose');

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  loginPath: '/admin/login',
})

let router = express.Router();

router.route('/login').get(async(req, res) => {
    res.sendFile(path.join(__dirname, "./templates/login.html"))
})

router.use('/static',express.static(path.join(__dirname, './static')));

router.use(async (req, res, next) => {
    try{
        await authenticateUser(req, res, next);
    } catch(err){
        res.redirect(adminBro.options.loginPath);
    }
})

router.use((req, res, next) => {
    try{
        authorizePermissions('superuser')(req,res, next);
    } catch(err){
        res.redirect(adminBro.options.loginPath);
    }
})


router = AdminBroExpress.buildRouter(adminBro, router)

module.exports = router;
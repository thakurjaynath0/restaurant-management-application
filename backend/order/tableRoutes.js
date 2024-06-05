const express = require('express');
const router = express.Router();

const {
    getAllTableNo,
    getTableNo,
    createTableNo,
    updateTableNo,
    deleteTableNo,
    } = require('./tableController');

const { authenticateUser, authorizePermissions } = require('../middlewares/authentication');

router.use(authenticateUser);
// router.use(authorizePermissions('superuser', 'admin'));

router.route('/')
.get(getAllTableNo)
.post([authorizePermissions('superuser', 'admin')],createTableNo);

router.route('/:id')
.get(getTableNo)
.patch([authorizePermissions('superuser', 'admin')],updateTableNo)
.delete([authorizePermissions('superuser', 'admin')],deleteTableNo);

module.exports = router;

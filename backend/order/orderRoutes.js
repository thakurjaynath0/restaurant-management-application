const express = require('express');
const router = express.Router();

const { authenticateUser, authorizePermissions, authorizeStaff } = require('../middlewares/authentication')

const {getAllOrder, getOrder, createOrder, updateOrder, completeOrder, cancelOrder, queryOrders} = require('./orderController');

router.route('/')
.get([authenticateUser, authorizeStaff('waiter', 'cook')], queryOrders)
.post([authenticateUser, authorizeStaff('waiter')], createOrder);

router.route('/:id')
.get([authenticateUser, authorizeStaff('waiter', 'cook')],getOrder)
.patch([authenticateUser, authorizeStaff('waiter', 'cook')],updateOrder)
// .delete(deleteOrder);

router.route('/:id/complete')
.post([authenticateUser, authorizeStaff('waiter')], completeOrder)

router.route('/:id/cancel')
.post([authenticateUser, authorizeStaff('waiter')], cancelOrder)

module.exports = router;
const express = require('express');
const router = express.Router();

const {getAllBill,getBill, settleBill, queryBills} = require('./billController');
const { authenticateUser, authorizeStaff } = require('../middlewares/authentication');

router.use([authenticateUser, authorizeStaff('accountant')])

router.route('/').get(queryBills);
router.route('/:id').get(getBill);
router.route('/:id/settle').post(settleBill);


module.exports = router;
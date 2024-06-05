const Bill = require('./Bill');
const MenuItem = require('../menu/MenuItem');
const CustomerOrder = require('../order/CustomerOrder');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const queryModel = require('../utils/queryModel');

const getAllBill = async (req, res) => {
    const bills = await Bill.find({});

    if (!bills) {
        throw new NotFoundError('No bills found');
    }

    res.status(StatusCodes.OK).json({ bills });
};

const getBill = async (req, res) => {
    const { id } = req.params;
    const bill = await Bill.findOne({ _id: id });

    if (!bill) {
        throw new NotFoundError(`Bill not found with the id:${id}`);
    }

    res.status(StatusCodes.OK).json({ bill });
};


const settleBill = async (req, res) => {
    const { id } = req.params;
    const { payment='cash', discount=0, note='' } = req.body;
    const bill = await Bill.findOne({ _id: id });

    if (!bill) {
        throw new NotFoundError(`Bill not found with the id:${id}`);
    }

    if(bill.settled){
        throw new BadRequestError('Bill already settled .');
    }

    // bill.settled = true;
    // bill.payment = payment;
    // bill.discount = discount;
    // bill.note = note;
    const settledBy = {
        user:req.user._id,
        name:req.user.name,
        position:req.user.role + "--" + req.user.position
    }
    Object.assign(bill, { settled:true, payment, discount, note, settledBy });
    await bill.save();

    res.status(StatusCodes.OK).json({
        msg:'Bill settled successfully .'
    });
}


const queryBills = async (req, res) => {
    const querySettings = {
        booleanFields:['settled'],
        otherFields:['payment'],
        numericFields:['discount', 'details.orderNumber', 'details.total'],
        dateFields:['createdAt', 'updatedAt', 'details.orderDate'],
    }
    const { result, others } = await queryModel(req, Bill, querySettings);
    const bills = await result;

    res.status(StatusCodes.OK).json({
        bills,
        total:bills.length,
        ...others
    })
}

module.exports = { getAllBill, getBill, settleBill, queryBills };
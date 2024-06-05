// const fs = require('fs');
const path = require('path');
const Bill = require('./Bill');
const MenuItem = require('../menu/MenuItem');
// const PDF = require('pdf-creator-node');
const SETTINGS =  require('../settings');
const { generateInvoicePdf } = require('../utils');

const createBill = async (order) => {
    const items = order.items;
    const tax = 0;
    const serviceCharge = 0;
    // const orderDate = new Date(order.createdAt);

    let result = {
        orderNumber:order.number,
        orderDate:order.createdAt,
        orderId:order._id,
        orderItems: [],
        orderTables:[],
        taxAmount:0,
        subTotal: 0,
        total:0,
        gratuity:0,
    };

    for (let item of items) {
        const currItem = await MenuItem.findOne({ _id: item.item });
        const itemTotal = (item.quantity * currItem.price);
        result.subTotal += itemTotal;

        result.orderItems.push({
            itemName: currItem.name,
            itemPrice: currItem.price,
            itemQuantity: item.quantity,
            itemTotal
        });
    };

    for(let table of order?.tables){
        result.orderTables.push(table?.number)
    }

    result.taxAmount = ((tax / 100) * result.subTotal);
    result.gratuity = ((serviceCharge/ 100)* result.subTotal);
    result.total = (result.subTotal + result.taxAmount + result.gratuity);

    result.taxAmount = result.taxAmount.toFixed(2)
    result.gratuity = result.gratuity.toFixed(2)
    result.total = result.total.toFixed(2)
    // const pdfPath = `/pdf/${order._id}.pdf`;

    // await generateInvoicePdf({
    //     filePath:pdfPath,
    // }, result);
    // pdfLocation: SETTINGS.MEDIA_URL+pdfPath
    return await Bill.create({ order: order._id, details: result });
}

module.exports = createBill;
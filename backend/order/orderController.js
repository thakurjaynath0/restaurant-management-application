const CustomerOrder = require('./CustomerOrder');
const MenuItem = require('../menu/MenuItem');
const Table = require('./Table');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, BadRequestError, UnauthorizedError} = require('../errors');
const UpdateOrder = require('./updateOrder');
const queryModel = require('../utils/queryModel');

const queryOrders = async (req, res) => {
    const { tables } = req.query
    let queryObj = {}
    const querySettings = {
        otherFields:['status'],
        numericFields:['number','people'],
        dateFields:['createdAt','updatedAt'],
    }

    if(['superuser', 'admin'].includes(req.user.role) && tables){
        let tableNumbers = tables.split(',');
        queryObj['tables.number'] = {
            $all:tableNumbers
        }
    }
    const { result, others } = await queryModel(req, CustomerOrder, querySettings, queryObj)
    const orders = await result;
    res.status(StatusCodes.OK).json({
        orders,
        total:orders.length,
        ...others
    })
}

const getAllOrder = async(req,res)=>{
    const orders = await CustomerOrder.find({});
    
    if(!orders){
        throw new NotFoundError('No orders found.');
    }

    res.status(StatusCodes.OK).json({orders, count: orders.length});

};

const getOrder = async(req,res)=>{
    const {id} = req.params;
    const order = await CustomerOrder.findOne({_id:id});

    if(!order){
        throw new NotFoundError(`No order found with id:${id}`);
    }

    res.status(StatusCodes.OK).json({order});

};


const createOrder = async(req,res) => {
    const { tables, items, people=0 } = req.body;
    let fetchedItems = [], fetchedTables = [];

    if(!tables || !items || !items.length>0 || !tables.length>0){
        throw new BadRequestError("Please provide all values .");
    }

    for(let table of tables){
        let currTable = await Table.findOne({ _id:table?.table, occupied:false });
        if(!currTable){
            throw new NotFoundError(`Table with id:${table?.table} not found .`);
        }
        table.number = currTable.number;
        fetchedTables.push(currTable);
    }
    
    for(let item of items){
        let currItem = await MenuItem.findOne({ _id: item.item });
        if(!currItem){
            throw new NotFoundError(`Item with id:${item.item} not found.`);
        }
        item.name = currItem.name;
        item.price = currItem.price;
        fetchedItems.push(currItem);
    }

    
    const order = await CustomerOrder.create({tables, items, people, takenBy:req.user._id});
    
    for(let table of fetchedTables){
        // table._id because fetchedTables contains the record directly from db 
        await Table.findOneAndUpdate({ _id:table?._id },{ occupied: true }, {
            runValidators: true,
            new:true
        })
    }

    res.status(StatusCodes.OK).json({order});
};

const updateOrder = async (req, res) => {
    const { action } = req.query;
    const { id:orderId } = req.params;

    const order = await CustomerOrder.findOne({ _id:orderId });
    if(!order){
        throw new NotFoundError(`No order found with id:${orderId} .`);
    }
    if(order.completed){
        throw new BadRequestError('Order already completed .')
    }
    const addDelPermitted = (['admin', 'superuser'].includes(req.user.role) || ['waiter'].includes(req.user.position)) ? true : false ;
    const orderUpdater = new UpdateOrder({order, req, res});

    if((action === 'add_table') && addDelPermitted)
        return await orderUpdater.addTable(req.body?.table);
    
    if((action === 'remove_table') && addDelPermitted)
        return await orderUpdater.removeTable(req.body?.table);

    if((action === 'add_item') && addDelPermitted)
        return await orderUpdater.addItem({item:req.body?.item, quantity:req.body?.quantity, type: req.body?.type});
    
    if((action === 'remove_item') && addDelPermitted) 
        return await orderUpdater.removeItem(req.body?.item);
    
    if(action === 'update_item'){
        const { id, item, quantity, status, type } = req.body;
        if(['admin', 'superuser'].includes(req.user.role)){
            return await orderUpdater.updateItem({ id, item, quantity, status, type });
        }

        if((req.user.role === "staff") && req.user.position === "cook"){
            if(['cooking', 'completed'].includes(status)){
                return await orderUpdater.updateItem({ id, status })
            }
        }

        if((req.user.role === "staff") && req.user.position === "waiter"){
            if(['served'].includes(status)){
                return await orderUpdater.updateItem({ id, status, item, quantity, type })
            }
        }
    }

    if((action === 'update_other') && addDelPermitted) {
        const { people=null, note=null } = req.body
        return await orderUpdater.updateOther({ people, note })
    } 

    throw new BadRequestError('Invalid Action .')
};

const completeOrder = async (req, res) => {
    const { id:orderId } = req.params;
    let order = await CustomerOrder.findOne({ _id:orderId }) 
    if(!order){
        throw new NotFoundError(`No order found with id:${orderId}`);
    }
    if(order.status === 'completed'){
        throw new BadRequestError('Order already completed .')
    }
    if(order.status === 'canceled'){
        throw new BadRequestError('Order already canceled .')
    }
    order.status = 'completed';
    await order.save();
    res.status(StatusCodes.OK).json({ msg:'Order completed successfully .'});
}

const cancelOrder = async (req, res) => {
    const { id:orderId } = req.params;
    let order = await CustomerOrder.findOne({ _id:orderId }) 
    if(!order){
        throw new NotFoundError(`No order found with id:${orderId}`);
    }
    if(order.status === 'completed'){
        throw new BadRequestError('Order already completed .')
    }
    if(order.status === 'canceled'){
        throw new BadRequestError('Order already canceled .')
    }
    order.items.forEach(item => {
        if(['served'].includes(item.status)){
            throw new BadRequestError('Some items are already served .');
        }
    })

    order.status = 'canceled';
    await order.save();
    res.status(StatusCodes.OK).json({ msg:'Order canceled successfully .' });
};



module.exports = {
    queryOrders,
    getAllOrder,
    getOrder,
    createOrder,
    updateOrder,
    completeOrder,
    cancelOrder
}

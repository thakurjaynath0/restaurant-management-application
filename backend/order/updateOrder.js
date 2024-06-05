const mongoose = require('mongoose');
const Order = require('./CustomerOrder');
const Table = require('./Table');
const MenuItem = require('../menu/MenuItem');

const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

class UpdateOrder {
    constructor({ order, req, res }){
        this.order = order;
        this.req = req;
        this.res = res;
    }

    async addTable(tableId){
        if(!tableId){
            throw new CustomError.BadRequestError('Please provide table id .');
        }
        let table = await Table.findOne({ _id:tableId, occupied: false });
        if(!table){
            throw new CustomError.NotFoundError(`Table with id:${tableId} not found`);
        }
        const _id = new mongoose.Types.ObjectId();

        this.order.tables = [...this.order.tables, { table:table._id, _id, number:table.number}];
        await this.order.save();
        table.occupied = true;
        await table.save();
        this.res.status(StatusCodes.OK).json({_id,table:table._id, number:table.number});
    }

    async removeTable(tableId){
        let tableIndex = this.order.tables.findIndex(t => {
            return t.id === tableId
        });
        if(tableIndex < 0){
            throw new CustomError.NotFoundError(`Table with id:${tableId} is not used in this order .`);
        }
        let currTableId = this.order.tables[tableIndex].table;
        this.order.tables.splice(tableIndex, 1);
        await this.order.save();
        await Table.findOneAndUpdate({ _id:currTableId }, { occupied:false }, { runValidators: true });
        
        this.res.status(StatusCodes.OK).json({msg: 'Table removed successfully.'});
    }

    async addItem({ item:itemId, quantity, type }){
        if(!itemId || !quantity){
            throw new CustomError.BadRequestError('Please provide item and quantity.');
        }
        let item = await MenuItem.findOne({ _id:itemId }); 
        if(!item){
            throw new CustomError.NotFoundError(`Item with id:${itemId} not found .`);
        }
        const _id = new mongoose.Types.ObjectId();
        console.log(type)
        console.log("hello")
        this.order.items = [...this.order.items, {_id, item:itemId, quantity, name:item.name, type, price: item.price}];
        await this.order.save();

        this.res.status(StatusCodes.OK).json({ _id, itemId, quantity, name:item.name});
    }

    async removeItem(itemId){
        if(!itemId ){
            throw new CustomError.BadRequestError('Please provide item id.');
        }
        let itemIndex = this.order.items.findIndex( i => i.id === itemId);
        if(itemIndex < 0){
            throw new CustomError.NotFoundError(`Item with id:${itemId} not found in this order .`);
        }
        if(this.order.items[itemIndex].status === 'served'){
            throw new CustomError.BadRequestError('Can\'t remove served items .');
        }
        this.order.items.splice(itemIndex, 1);
        await this.order.save();

        this.res.status(StatusCodes.OK).json({msg:'Item removed successfully .'});
    }

    async updateItem({ id:itemId, item, quantity, status, type }) {
        if(!itemId ){
            throw new CustomError.BadRequestError('Please provide id .')
        }
        let itemIndex = this.order.items.findIndex( i => i.id === itemId);
        if(itemIndex < 0){
            throw new CustomError.NotFoundError(`Item with id:${itemId} not found in this order .`);
        }

        if(this.order.items[itemIndex].status === 'served'){
            throw new CustomError.BadRequestError('Can\'t update served items .');
        }

        if(item && !(this.order.items[itemIndex].item === item)){
            let currItem = await MenuItem.findOne({ _id:item }); 
            if(!currItem){
                throw new CustomError.NotFoundError(`Item with id:${item} not found .`);
            }
        }

        item && (this.order.items[itemIndex].item = item);
        quantity && (this.order.items[itemIndex].quantity = quantity);
        status && (this.order.items[itemIndex].status = status);
        type && (this.order.items[itemIndex].type = type);
        await this.order.save();
        
        this.res.status(StatusCodes.OK).json({ msg:'Item updated successfully .'});

    }

    async updateOther({ people, note }) {
        people && (this.order.people = people);
        note && (this.order.note = note);

        await this.order.save();
        this.res.status(StatusCodes.OK).json({ msg:'Successful.' });
    }
}

module.exports = UpdateOrder;
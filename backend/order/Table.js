const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    number:{
        type: String,
        unique: [true, 'Table number already exists .'],
        required: true,
    },
    occupied:{
        type:Boolean,
        default:false
    }
},{toJson: {virtuals:true}, toObject: {virtuals:true}});

TableSchema.virtual('tableNumber',{
    ref:'CustomerOrder',
    localField:'_id',
    foreignField:'tableNumber',
    justOne: false,
});

module.exports = mongoose.model('Table', TableSchema);
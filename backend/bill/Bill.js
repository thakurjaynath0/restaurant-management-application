const mongoose = require('mongoose');

const DetailSchema = new mongoose.Schema({
    orderNumber:Number,
    orderDate:String,
    orderId:mongoose.Types.ObjectId,
    orderItems:[{
        itemName:String,
        itemPrice:Number,
        itemQuantity:Number,
        itemTotal:Number,
    }],
    orderTables:[String],
    taxAmount:Number,
    subTotal:Number,
    total:Number,
    gratuity:Number,
})

const SettledBySchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    position:{
        type:String,
        required:true,
    }
})

const BillSchema = new mongoose.Schema({
    order: {
        type: mongoose.Types.ObjectId,
        ref:'CustomerOrder',
        required: true,
    },
    settled: {
        type: Boolean,
        required: true,
        default: false,
    },
    payment:{
        type:String,
        enum:['cash', 'card', 'online'],
        default:'cash'
    },
    details:{
        type:DetailSchema,
        required:true,
    },
    discount:{
        type:Number,
        default:0
    },
    note:String,
    settledBy:{
        type:SettledBySchema,
        required:false
    }
    // pdfLocation: {
    //     type: String,
    //     required: true,
    // }
},{timestamps: true});

BillSchema.index({ order:1 }, { unique: true })

module.exports = mongoose.model('Bill',BillSchema);
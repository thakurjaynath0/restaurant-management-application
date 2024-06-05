const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const createBill = require('../bill/createBill');

const emptyArray = function(arr) {
    return (arr.length > 0);
}

const SingleOrderItem = new mongoose.Schema({
    item:{
        type:mongoose.Types.ObjectId,
        ref:'MenuItem',
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:['table', 'packing'],
        required:[true, 'Please provide method of serving (table/packing)']
    },
    status:{
        type: String,
        enum: ['cooking', 'completed', 'served', 'pending'],
        default: 'pending'
    }
});

const SingleTable = new mongoose.Schema({
    table:{
        type:mongoose.Types.ObjectId,
        ref:'Table',
        required:[true, 'Please provide table number .']
    },
    number:{
        type:String,
        required:true,
    }
})

const CustomerOrderSchema = new mongoose.Schema({
    number:{
        type:Number,
    },
    tables:{
        type:[SingleTable],
        required:[true, 'Tables is required .'],
        validate:{
            validator:emptyArray,
            message: 'Tables can\'t be empty'
        }
    },
    people: {
        type: Number,
        required: [true, 'Please provide number or people .'],
    },
    items:{
        type:[SingleOrderItem],
        required:[true, 'Items is required .'],
        validate:{
            validator:emptyArray,
            message: 'Items can\'t be empty'
        }
    },
    status: {
        type: String,
        enum:['pending', 'completed', 'canceled'],
        default: 'pending',
    },
    note: {
        type: String,
        default:''
    },
    takenBy:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    }
}, { timestamps:true, toJSON: { virtuals: true }, toObject: { virtuals: true } })


CustomerOrderSchema.plugin(AutoIncrement, { inc_field:'number' })

CustomerOrderSchema.virtual('bill', {
    ref: 'Bill',
    localField: '_id',
    foreignField: 'order',
    justOne: true,
})

CustomerOrderSchema.methods.freeTables = async function(){
    for(let table of this.tables){
        await this.model('Table').findOneAndUpdate({_id:table.table}, { occupied: false }, {
            runValidators: true
        })
    }
}

CustomerOrderSchema.pre('save', async function(){
    if(this.isModified('status')){
        if(this.status === 'completed')
            await createBill(this);

        if(['completed', 'canceled'].includes(this.status))
            await this.freeTables();
    }
})

// CustomerOrderSchema.pre('save', async function(){
//     if(this.isModified('status') && this.status === 'completed'){
//         await createBill(this);
//     }
// })

module.exports = mongoose.model('CustomerOrder', CustomerOrderSchema)
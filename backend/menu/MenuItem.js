const mongoose = require('mongoose');


const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name of the item'],
        minlength: [3, 'Item name should contain atleast 3 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide the price of the item'],
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref:'MenuCategory',
        required: true,
    },
    image: {
        type: String,
        default:''
    }
},{timestamps: true}, {toJson: {virtuals:true}, toObject: {virtuals:true}});

MenuItemSchema.virtual('singleOrderedItems', {
    ref: 'CustomerOrder',
    localField: '_id',
    foreignField: 'items',
    justOne: false,
})

module.exports = mongoose.model('MenuItem', MenuItemSchema);

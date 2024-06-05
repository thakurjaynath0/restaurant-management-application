const mongoose = require('mongoose');

const MenuCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide category of the item'],
        minlength: [3, 'Category should contain atleast 3 characters']
    }

},{ toJSON:{ virtuals: true }, toObject:{ virtuals: true }});


MenuCategorySchema.virtual('items',{
    ref:'MenuItem',
    localField:'_id',
    foreignField:'category', 
    justOne: false,
});

// delete all items when category is deleted 
MenuCategorySchema.pre('remove', function(){
    this.model('MenuItem').deleteMany({ category:this._id });
})

module.exports = mongoose.model('MenuCategory', MenuCategorySchema);
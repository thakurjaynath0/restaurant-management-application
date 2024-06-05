const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique:true,
        required: [true, 'Please provide username .'],
        minlength : [5, 'Username can\'t be less than 5 characters .'],
        maxlength : [20, 'Username can\'t be less than 5 characters .'],
    },
    password: {
        type: String,
        required: [true, 'Please provide password.'],
        minlength: [6, 'Password must be at least 6 characters .']
    },
    name : {
        type: String,
        required: [true, 'Please provide name .'],
        minlength: [3, 'Name can\'t be less than 3 characters .'],
        maxlength: [50, 'Name can\'t be more than 50 characters .'],
    },
    profile_pic:{
        type:String,
        default:'/static/images/placeholder_pp.jpg',
    },
    role: {
        type: String,
        enum: ['superuser','admin','staff'],
        default: 'staff'
    },
    position:{
        type:String,
        enum: ['none','waiter', 'cook', 'accountant'],
        required:[true, 'Please provide position .'],
    },
    isAllowedToLogin:{
        type: Boolean,
        default: true
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } } );


UserSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})


UserSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}


UserSchema.methods.createJWTPayload = async function(){
    return { name:this.name, userId:this._id, role:this.role}
}


module.exports = mongoose.model('User', UserSchema);
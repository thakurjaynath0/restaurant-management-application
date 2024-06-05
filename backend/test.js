require('dotenv').config();
const connectDB = require('./db/connect');
const User = require('./user/User');
// const TableNumber = require('./order/TableNumber');


const createUser = async () => {
    let data = {
        name:"Nikhil Thakur",
        username:"Admin1",
        password:"random1234",
        position:"none",
        role:"admin",
        isAllowedToLogin:"true"
    }

    const createdUser = await User.create(data);

    console.log(createdUser);
};

const updateUser = async (username) => {
    let update = {
        isAllowedToLogin:"true"
    }

    // const updatedUser =  await User.findOneAndUpdate(username, update, { new:true });
    const user = await User.findOne({ username });
    await User.updateOne({ _id:user._id}, update);
    console.log(await User.findOne({ _id: user._id }));
};


const deleteAllTable = async () => {
    await TableNumber.find({}).deleteMany();
};

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URL);
        // await deleteAllTable();
        await createUser();
        // await updateUser("Nikhil");
    } catch(e){
        console.log(e);
    }
    process.exit();
};

start();
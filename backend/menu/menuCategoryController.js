const MenuCategory = require('./MenuCategory');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, BadRequestError} = require('../errors');

const getAllCategory = async(req,res)=>{
    const category = await MenuCategory.find({}); // removed populate 
    // .populate('items')

    if(!category){
        throw new NotFoundError('No categories found');
    }
    
    res.status(StatusCodes.OK).json({ category });
};

const getCategory = async(req,res) =>{
    const {id} = req.params;
    const category = await MenuCategory.find({_id:id});

    if(!category){
        throw new NotFoundError(`No category found with id: ${id}`);
    }

    res.status(StatusCodes.OK).json({ category });
};

const createCategory = async(req,res)=>{
    const {body:{name}} = req;
    const category = await MenuCategory.create({name});
    res.status(StatusCodes.OK).json({category});
};

const updateCategory = async(req,res)=>{
    const {body:{name}, params:{id}} = req;
    
    if(!name){
        throw new BadRequestError('Name cannot be empty');
    }

    const category = await MenuCategory.findOneAndUpdate({_id:id},{ name },{
        new:true, runValidators:true,
    });

    if(!category){
        throw new NotFoundError('Category not found');
    }

    res.status(StatusCodes.OK).json({category});

};

const deleteCategory = async(req,res)=>{
    const {id} = req.params;
    const category = await MenuCategory.findOne({_id:id});

    if(!category){
        throw new NotFoundError('Category not found');
    }

    // const {items} = await category.populate('items');
    // console.log(items);
    // if(items.length > 0){
    //     throw new BadRequestError('Category is not empty');
    // }
    
    await MenuCategory.findByIdAndRemove({_id:id});
    res.status(StatusCodes.OK).send('Successfully Deleted');

};

const getCategoryItems = async(req,res)=>{
    const {id} = req.params;
    const category = await MenuCategory.findOne({_id: id}).populate('items');
    // console.log(category);

    if(!category){
        throw new NotFoundError('Category not found');
    }

    res.status(StatusCodes.OK).json({category});
};

module.exports = {
    getAllCategory,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryItems,
}

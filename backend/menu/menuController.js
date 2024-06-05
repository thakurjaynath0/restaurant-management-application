const MenuItem = require('./MenuItem');
const MenuCategory = require('./MenuCategory');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const { objectWith } = require('../utils');


const getAllItems = async (req, res) => {
    const items = await MenuItem.find({});

    if (!items) {
        throw new NotFoundError('No items found');
    }

    res.status(StatusCodes.OK).json({ items, count: items.length });
};

const getItem = async (req, res) => {
    const { params: { id: itemId } } = req;
    const item = await MenuItem.findOne({
        _id: itemId,
    });

    if (!item) {
        throw new NotFoundError(`No item with id ${itemId}`);
    }

    res.status(StatusCodes.OK).json({ item });
};

const searchItem = async (req, res) => {
    const { query: { name = "" } } = req;
    
    const searchQuery = {
        name: { $regex: name, $options: 'i' }
    };

    const items = await MenuItem.find(searchQuery);

    res.status(StatusCodes.OK).json({ items });
}


const createItem = async (req, res) => {
    const { body: { name, price, category, image } } = req;
    const Category = await MenuCategory.findOne({ _id: category });

    if (!Category) {
        throw new NotFoundError('Category not found');
    }

    const item = await MenuItem.create({ name, price, image,category: Category._id });
    res.status(StatusCodes.OK).json({ item });
};


const updateItem = async (req, res) => {
    const { id:itemId } = req.params;
    const query = objectWith(req.body, ['name', 'price', 'category', 'image']);

    const item = await MenuItem.findOneAndUpdate(
        { _id: itemId, },
        query,
        { new: true, runValidators: true },
    );

    if (!item) {
        throw new NotFoundError(`No item found with id ${itemId}`);
    }

    res.status(StatusCodes.OK).json({ item });
};

const deleteItem = async (req, res) => {
    const { params: { id: itemId } } = req;
    const item = await MenuItem.findByIdAndRemove({ _id: itemId, });

    if (!item) {
        throw new NotFoundError(`No item found with id:${itemId}`);
    }

    res.status(StatusCodes.OK).json({msg:'Sucessfully deleted'});
};

const deleteAllCategoryItems = async (req, res) => {
    res.send('delete all items');
}

const uploadItemImage = async (req, res) => {
    if(!req.file){
        throw new BadRequestError('Please provide image to upload .');
    }
    console.log(req.file)
    const filePath = req.file.path.replace(process.env.PWD, '');

    res.status(StatusCodes.OK).json({ filePath });
}

module.exports = {
    getAllItems,
    getItem,
    searchItem,
    createItem,
    updateItem,
    deleteItem,
    uploadItemImage
}
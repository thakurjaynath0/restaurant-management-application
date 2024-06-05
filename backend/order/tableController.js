const Table = require('./Table');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

const getAllTableNo = async (req, res) => {
    const tables = await Table.find({});

    res.status(StatusCodes.OK).json({ tables });
};

const createTableNo = async (req, res) => {
    const { body: { number } } = req;
    if (!number) {
        throw new BadRequestError('Please provide table number .');
    }
    const tableExists = await Table.findOne({ number });
    if (tableExists) {
        throw new BadRequestError(`Table ${number} already exists .`);
    }
    const table = await Table.create({ number });
    res.status(StatusCodes.OK).json({ table });
};

const getTableNo = async (req, res) => {
    const { id } = req.params;
    const table = await Table.findOne({ _id: id });

    if (!table) {
        throw new NotFoundError('Table not found.');
    }

    res.status(StatusCodes.OK).json({ table });

};

const updateTableNo = async (req, res) => {
    const { body: { number }, params: { id } } = req;

    if (!number) {
        throw new BadRequestError('Table number can not be empty');
    }

    const table = await Table.findOne({ _id: id });
    if (!table) {
        throw new NotFoundError('Table not found .');
    }

    table.number = number;
    await table.save();

    res.status(StatusCodes.OK).json({ table });

};

const deleteTableNo = async (req, res) => {
    const { id } = req.params;
    const table = await Table.findOneAndDelete({ _id: id, occupied:false });

    if (!table) {
        throw new NotFoundError('Table not found .');
    }

    res.status(StatusCodes.OK).send({ msg: 'Successfully deleted' });
};

module.exports = {
    getAllTableNo,
    getTableNo,
    createTableNo,
    updateTableNo,
    deleteTableNo,
}
const { Op } = require('sequelize');
const Transaction = require('../models/Transaction');

exports.getReport = async (req, res) => {
  try {
    const { cpf, product, status, startDate, endDate, minAmount, maxAmount } = req.query;

    const where = {};

    if (cpf) where.cpf = cpf;
    if (product) where.description = { [Op.like]: `%${product}%` };
    if (status) where.status = status;
    if (startDate && endDate) {
      where.transactionDate = { [Op.between]: [startDate, endDate] };
    }
    if (minAmount && maxAmount) {
      where.amount = { [Op.between]: [minAmount, maxAmount] };
    }

    const results = await Transaction.findAll({ where });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao gerar relatório' });
  }
};
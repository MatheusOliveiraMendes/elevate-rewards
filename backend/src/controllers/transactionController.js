const Transaction = require('../models/Transaction');

exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, startDate, endDate } = req.query;

    const where = { UserId: userId };
    if (status) where.status = status;
    if (startDate && endDate) {
      where.transactionDate = {
        [require('sequelize').Op.between]: [startDate, endDate],
      };
    }

    const transactions = await Transaction.findAll({ where });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar transações' });
  }
};

exports.getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const total = await Transaction.sum('points', {
      where: { UserId: userId, status: 'Aprovado' },
    });
    res.json({ approvedPoints: total || 0 });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao calcular carteira' });
  }
};

const { Transaction } = require("../models/transaction");
const { Op } = require("sequelize");

async function getUserTransactions(req, res) {
  try {
    const { cpf } = req.user;
    const { status, startDate, endDate } = req.query;

    const filters = { cpf };

    if (status) filters.status = status;

    if (startDate && endDate) {
      filters.transactionDate = {
        [Op.between]: [startDate, endDate]
      };
    }

    const transactions = await Transaction.findAll({
      where: filters,
      order: [["transactionDate", "DESC"]]
    });

    res.json(transactions);
  } catch (error) {
    console.error("Erro ao buscar extrato do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar extrato do usuário" });
  }
}

async function getUserWallet(req, res) {
    try {
      const { cpf } = req.user;
  
      const transactions = await Transaction.findAll({
        where: {
          cpf,
          status: "Aprovado"
        }
      });
  
      const totalPoints = transactions.reduce((acc, t) => acc + t.points, 0);
  
      return res.json({ totalPoints });
    } catch (error) {
      console.error("Erro ao buscar carteira do usuário:", error);
      res.status(500).json({ error: "Erro ao buscar saldo da carteira" });
    }
  }

  module.exports = { getUserTransactions, getUserWallet };
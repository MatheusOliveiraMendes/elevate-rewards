const xlsx = require("xlsx");
const { cpf: cpfValidator } = require("cpf-cnpj-validator");
const { Transaction } = require("../models/transaction");
const { User } = require("../models/user");
const { Op } = require("sequelize");


async function uploadTransactions(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Arquivo não enviado." });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const inserted = [];

    for (const row of data) {
      const cpf = row["CPF"]?.toString().replace(/\D/g, "");

      if (!cpfValidator.isValid(cpf)) continue;

      const user = await User.findOne({ where: { cpf } });
      if (!user) continue;

      const transaction = await Transaction.create({
        cpf,
        description: row["Descrição da transação"],
        transactionDate: formatDate(row["Data da transação"]),
        points: parseInt(row["Valor em pontos"].toString().replace(/\D/g, "")),
        value: parseFloat(row["Valor"].toString().replace(",", ".")),
        status: row["Status"],
      });

      inserted.push(transaction);
    }

    return res.json({ message: "Transações importadas com sucesso!", count: inserted.length });
  } catch (error) {
    console.error("Erro ao importar planilha:", error);
    return res.status(500).json({ error: "Erro ao importar planilha." });
  }
}


async function getTransactions(req, res) {
  try {
    const { cpf, description, status, startDate, endDate, minValue, maxValue } = req.query;

    const filters = {};

    if (cpf) filters.cpf = cpf;
    if (description) filters.description = { [Op.like]: `%${description}%` };
    if (status) filters.status = status;
    if (startDate && endDate) {
      filters.transactionDate = {
        [Op.between]: [startDate, endDate]
      };
    }
    if (minValue && maxValue) {
      filters.value = {
        [Op.between]: [parseFloat(minValue), parseFloat(maxValue)]
      };
    }

    const transactions = await Transaction.findAll({
      where: filters,
      order: [['transactionDate', 'DESC']]
    });

    return res.json(transactions);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return res.status(500).json({ error: "Erro ao buscar transações" });
  }
}

// Função para converter data em formato dd-mm-yyyy
function formatDate(dateStr) {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
}


module.exports = { uploadTransactions, getTransactions };
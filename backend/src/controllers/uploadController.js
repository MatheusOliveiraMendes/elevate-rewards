const xlsx = require('xlsx');
const fs = require('fs');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.uploadSheet = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado.' });

    const filePath = req.file.path;
    console.log('🧾 Arquivo recebido:', req.file);
    console.log('📍 Caminho salvo:', filePath);

    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const entries = [];

    for (const row of data) {
      console.log('📄 Linha da planilha:', row);

      // Usando email como CPF, pois coluna "cpf" não existe no banco
      const user = await User.findOne({ where: { email: row.CPF } });
      if (!user) {
        console.log(`⚠️ Usuário não encontrado para CPF/email: ${row.CPF}`);
        continue;
      }

      entries.push({
        cpf: row.CPF,
        description: row['Descrição da transação'],
        transactionDate: new Date(row['Data da transação']),
        points: parseInt(row['Valor em pontos'].replace('.', '').replace(',', ''), 10),
        amount: parseFloat(row['Valor'].replace('.', '').replace(',', '.')),
        status: row.Status,
        UserId: user.id,
      });
    }

    console.log('✅ Transações para inserir:', entries.length);
    await Transaction.bulkCreate(entries);
    res.json({ message: 'Transações importadas com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao processar planilha.' });
  }
};

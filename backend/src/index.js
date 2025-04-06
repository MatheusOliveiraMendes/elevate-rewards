require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");

const app = express(); // Inicialize o app antes de usá-lo

app.use(cors());
app.use(express.json());

app.use(transactionRoutes); // Use as rotas após inicializar o app
app.use(authRoutes); // rotas de login e registro

const PORT = process.env.PORT || 3333;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao banco de dados");

    // Aqui vamos adicionar os models e relacionamentos
    const { User } = require("./models/user");
    const { Transaction } = require("./models/transaction");

    // Relacionamento pelo CPF
    User.hasMany(Transaction, { foreignKey: "cpf", sourceKey: "cpf" });
    Transaction.belongsTo(User, { foreignKey: "cpf", targetKey: "cpf" });

    await sequelize.sync(); // Cria as tabelas se não existirem

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar no banco:", error);
  }
}

startServer();
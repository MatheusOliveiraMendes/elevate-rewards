const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define("Transaction", {
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Aprovado", "Reprovado", "Em avaliação"),
    allowNull: false,
  },
});

module.exports = { Transaction };
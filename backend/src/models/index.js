const sequelize = require('../config/database');
const User = require('./user');

const db = { sequelize, User };

// Relações entre modelos serão definidas aqui depois

module.exports = db;
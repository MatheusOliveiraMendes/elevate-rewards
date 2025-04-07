// src/app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin/report', reportRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'API está funcionando!' });
});

module.exports = app;
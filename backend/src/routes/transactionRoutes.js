const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middlewares/authMiddleware');

router.get('/user', auth, transactionController.getUserTransactions);
router.get('/wallet', auth, transactionController.getWalletBalance);

module.exports = router;
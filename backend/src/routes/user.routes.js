const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const { getUserTransactions } = require("../controllers/user.controller");
const { getUserWallet } = require("../controllers/user.controller");

router.get("/user/wallet", authenticateToken, getUserWallet);
router.get("/user/transactions", authenticateToken, getUserTransactions);

module.exports = router;
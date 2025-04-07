const express = require("express");
const multer = require("multer");
const { uploadTransactions, getTransactions } = require("../controllers/transaction.controller");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

// Configuração do multer (armazenamento em memória)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/transactions", authenticateToken, getTransactions);
router.post("/transactions/upload", authenticateToken, upload.single("file"), uploadTransactions);

module.exports = router;
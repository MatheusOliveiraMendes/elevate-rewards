const express = require("express");
const multer = require("multer");
const { uploadTransactions, getTransactions } = require("../controllers/transaction.controller");

const router = express.Router();

// Configuração do multer (armazenamento em memória)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/transactions/upload", upload.single("file"), uploadTransactions);
router.get("/transactions", getTransactions);

module.exports = router;
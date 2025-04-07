const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const onlyAdmin = require('../middlewares/roleMiddleware');
const reportController = require('../controllers/reportController');

router.get('/', auth, onlyAdmin('admin'), reportController.getReport);

module.exports = router;
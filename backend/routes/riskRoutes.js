const express = require('express');
const router = express.Router();
const { getRiskLogs, addRiskLog, deleteRiskLog } = require('../controllers/riskController');

router.get('/', getRiskLogs);
router.post('/', addRiskLog);
router.delete('/:id', deleteRiskLog);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getCases, getCaseById, createCase, analyzeExistingCase, deleteCase, getAllCases, analyzeStandaloneText
} = require('../controllers/caseController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { caseRules, validate } = require('../middleware/validate');

// All routes require auth
router.use(authMiddleware);

// GET /api/cases
router.get('/', getCases);

// POST /api/cases - with validation
router.post('/', caseRules, validate, createCase);

// GET /api/cases/:id
router.get('/:id', getCaseById);

// POST /api/cases/:id/analyze
router.post('/:id/analyze', analyzeExistingCase);

// POST /api/cases/analyze-text
router.post('/analyze-text', analyzeStandaloneText);

// DELETE /api/cases/:id
router.delete('/:id', deleteCase);

// GET /api/cases/admin/all - admin only
router.get('/admin/all', adminMiddleware, getAllCases);

module.exports = router;

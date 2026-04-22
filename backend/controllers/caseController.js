const Case = require('../models/Case');
const { analyzeCase } = require('../services/aiService');

// Get all cases for the logged-in user
const getCases = async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single case by ID
const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findOne({ _id: req.params.id, user: req.user.id });
    if (!caseData) return res.status(404).json({ message: 'Case not found' });
    res.json(caseData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new case
const createCase = async (req, res) => {
  try {
    const { title, description, caseType } = req.body;
    const newCase = new Case({ title, description, caseType, user: req.user.id, status: 'pending' });
    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Run AI analysis on a case
const analyzeExistingCase = async (req, res) => {
  try {
    const caseData = await Case.findOne({ _id: req.params.id, user: req.user.id });
    if (!caseData) return res.status(404).json({ message: 'Case not found' });

    caseData.status = 'analyzing';
    await caseData.save();

    const aiResult = await analyzeCase(caseData.title, caseData.description, caseData.caseType);

    caseData.analysis = {
      summary: aiResult.summary,
      legalPoints: aiResult.legalPoints,
      recommendations: aiResult.recommendations,
      riskLevel: aiResult.riskLevel,
      updatedAt: new Date()
    };
    caseData.status = 'completed';
    await caseData.save();

    res.json(caseData);
  } catch (error) {
    console.error(error);
    const caseData = await Case.findById(req.params.id);
    if (caseData) { caseData.status = 'failed'; await caseData.save(); }
    res.status(500).json({ message: 'AI analysis failed' });
  }
};

// Delete a case
const deleteCase = async (req, res) => {
  try {
    const caseData = await Case.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!caseData) return res.status(404).json({ message: 'Case not found' });
    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: get all cases
const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Analyze text without saving to DB
const analyzeStandaloneText = async (req, res) => {
  try {
    const { text, type } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });
    
    const aiResult = await analyzeCase('Quick Analysis', text, type || 'other');
    res.json(aiResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI analysis failed' });
  }
};

module.exports = { getCases, getCaseById, createCase, analyzeExistingCase, deleteCase, getAllCases, analyzeStandaloneText };

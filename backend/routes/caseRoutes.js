import express from "express";
import multer from "multer";
import pdf from "pdf-parse";
import { analyzeCase } from "../services/aiService.js";

import { protect } from "../middleware/authMiddleware.js";
import Case from "../models/Case.js";

/* SAVE CASE */
router.post("/save", protect, async (req, res) => {
  try {
    const { content, analysis } = req.body;

    const newCase = await Case.create({
      userId: req.user.id,
      content,
      analysis,
    });

    res.json(newCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET USER CASES */
router.get("/my-cases", protect, async (req, res) => {
  const cases = await Case.find({ userId: req.user.id });
  res.json(cases);
});


const router = express.Router();

// store file in memory
const upload = multer();

/* 🔹 TEXT ANALYSIS ROUTE (VERY IMPORTANT) */
router.post("/analyze", async (req, res) => {
  try {
    const { caseText } = req.body;

    if (!caseText) {
      return res.status(400).json({ error: "No case text provided" });
    }

    const result = await analyzeCase(caseText);
    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Text analysis failed" });
  }
});


/* 🔹 PDF UPLOAD ROUTE */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;

    // extract text from PDF
    const data = await pdf(fileBuffer);

    // ⚠️ limit text size (VERY IMPORTANT)
    const text = data.text.slice(0, 10000);

    // send to AI
    const result = await analyzeCase(text);

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "File processing failed" });
  }
});

export default router;
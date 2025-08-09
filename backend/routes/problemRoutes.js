// routes/problemRoutes.js
const express = require('express');
const router = express.Router();
const Problem = require('../models/problem');

router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

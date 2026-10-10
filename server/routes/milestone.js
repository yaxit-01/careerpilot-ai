const express = require("express");
const router = express.Router();

const {
  generateMilestoneAdvice,
} = require("../services/aiService");

router.post("/", async (req, res) => {
  try {
    const {
      targetRole,
      milestone,
      education,
      existingSkills,
    } = req.body;

    if (!targetRole || !milestone?.title) {
      return res.status(400).json({
        error: "Target role and milestone title are required.",
      });
    }

    const advice = await generateMilestoneAdvice({
      targetRole,
      milestone,
      education,
      existingSkills,
    });

    return res.json({ advice });
  } catch (error) {
    console.error("Milestone advice error:", error);

    return res.status(500).json({
      error: error.message || "Unable to generate action plan.",
    });
  }
});

module.exports = router;
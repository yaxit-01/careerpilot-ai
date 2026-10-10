const express = require("express");
const { z } = require("zod");

const { generateCareerRoadmap } = require("../services/aiService");

const router = express.Router();

const roadmapSchema = z.object({
  education: z.string().min(1),
  targetRole: z.string().min(1),
  companyType: z.string().min(1),
  existingSkills: z.array(z.string()),
  weeklyHours: z.number().min(1).max(80),
  targetMonths: z.number().int().min(1).max(60),
});

router.post("/", async (req, res) => {
  const parsed = roadmapSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Please check your career details and try again.",
    });
  }

  try {
    const roadmap = await generateCareerRoadmap(parsed.data);

    return res.json(roadmap);
  } catch (error) {
    console.error("Roadmap generation failed:", error.message);

    return res.status(502).json({
      error: "Roadmap generation failed. Please try again.",
    });
  }
});

module.exports = router;
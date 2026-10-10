const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

// Shared Gemini JSON generation function.
async function generateJSON(prompt) {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is missing from server/.env");
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }
}

// Generate a complete personalized career roadmap.
async function generateCareerRoadmap(userInput) {
  const prompt = `
You are CareerPilot AI, an expert career planning assistant.

Generate a practical, personalized career roadmap.

STUDENT INFORMATION:
${JSON.stringify(userInput, null, 2)}

Return ONLY valid JSON using this structure:

{
  "title": "Career roadmap title",
  "summary": "Personalized roadmap summary",
  "milestones": [
    {
      "id": "unique-lowercase-id",
      "title": "Milestone title",
      "phase": "Learning phase",
      "durationWeeks": 3,
      "description": "What the student will learn",
      "skills": ["Skill 1", "Skill 2"],
      "prerequisites": [],
      "project": "A practical project",
      "certifications": [],
      "resources": [],
      "status": "not-started"
    }
  ]
}

REQUIREMENTS:
1. Create 5 to 8 meaningful milestones.
2. Personalize the plan using existing skills.
3. Match the target role and company type.
4. Respect weekly study hours and the requested timeline.
5. Put prerequisite milestones before dependent milestones.
6. Use unique IDs containing lowercase letters, numbers, and hyphens.
7. Every prerequisite must refer to another milestone ID.
8. Recommend realistic projects.
9. Do not invent certification names or resource URLs.
10. Return JSON only, without Markdown code fences.
`;

  const roadmap = await generateJSON(prompt);

  validateRoadmap(roadmap);

  return roadmap;
}

// Validate the generated roadmap.
function validateRoadmap(roadmap) {
  if (
    !roadmap ||
    typeof roadmap.title !== "string" ||
    typeof roadmap.summary !== "string" ||
    !Array.isArray(roadmap.milestones) ||
    roadmap.milestones.length === 0
  ) {
    throw new Error("Invalid roadmap structure returned by Gemini");
  }

  const ids = new Set();

  for (const milestone of roadmap.milestones) {
    if (
      !milestone ||
      typeof milestone.id !== "string" ||
      !/^[a-z0-9-]+$/.test(milestone.id) ||
      typeof milestone.title !== "string" ||
      typeof milestone.description !== "string" ||
      !Number.isFinite(milestone.durationWeeks) ||
      milestone.durationWeeks < 1 ||
      !Array.isArray(milestone.skills) ||
      !Array.isArray(milestone.prerequisites)
    ) {
      throw new Error("A roadmap milestone has invalid fields");
    }

    if (ids.has(milestone.id)) {
      throw new Error("Duplicate milestone ID returned by Gemini");
    }

    ids.add(milestone.id);
  }

  for (const milestone of roadmap.milestones) {
    for (const prerequisite of milestone.prerequisites) {
      if (!ids.has(prerequisite) || prerequisite === milestone.id) {
        throw new Error(
          `Invalid prerequisite "${prerequisite}" in ${milestone.id}`
        );
      }
    }
  }
}

// Generate an AI-powered action plan for a selected milestone.
async function generateMilestoneAdvice({
  targetRole,
  milestone,
  education,
  existingSkills = [],
}) {
  if (!milestone || !milestone.title) {
    throw new Error("A valid milestone is required");
  }

  const skills = Array.isArray(existingSkills)
    ? existingSkills
    : [String(existingSkills)];

  const prompt = `
You are CareerPilot AI, an expert technical career mentor.

Create a practical, personalized action plan for the selected career milestone.

STUDENT EDUCATION:
${education || "Not specified"}

TARGET CAREER:
${targetRole || "Not specified"}

EXISTING SKILLS:
${skills.join(", ") || "Beginner"}

SELECTED MILESTONE:
${JSON.stringify(milestone, null, 2)}

Return ONLY valid JSON using this exact structure:

{
  "milestoneTitle": "Milestone title",
  "estimatedHours": 10,
  "actionPlan": [
    {
      "step": 1,
      "title": "Learning step title",
      "description": "Detailed actionable instructions",
      "estimatedHours": 2
    }
  ],
  "project": {
    "title": "Project title",
    "description": "Project explanation",
    "tasks": ["Task 1", "Task 2", "Task 3"]
  },
  "interviewQuestions": [
    {
      "question": "Interview question",
      "answer": "Clear, technically accurate answer"
    }
  ],
  "successCriteria": [
    "Measurable completion criterion"
  ]
}

REQUIREMENTS:
1. Create 3 to 5 ordered, actionable learning steps.
2. Include realistic estimated hours.
3. Consider the student's education and existing skills.
4. Include one practical project relevant to the milestone.
5. Include 3 relevant interview questions with answers.
6. Include 3 to 5 measurable success criteria.
7. Keep the workload realistic for a student.
8. Explain technical concepts accurately.
9. Do not invent certification names or resource URLs.
10. Return JSON only, without Markdown code fences.
`;

  const advice = await generateJSON(prompt);

  // Validate the minimum structure required by the frontend.
  if (
    !advice ||
    typeof advice.milestoneTitle !== "string" ||
    !Array.isArray(advice.actionPlan) ||
    !advice.project ||
    typeof advice.project.title !== "string" ||
    !Array.isArray(advice.project.tasks) ||
    !Array.isArray(advice.interviewQuestions) ||
    !Array.isArray(advice.successCriteria)
  ) {
    throw new Error("Gemini returned an invalid milestone action plan");
  }

  return advice;
}

module.exports = {
  generateCareerRoadmap,
  generateMilestoneAdvice,
};
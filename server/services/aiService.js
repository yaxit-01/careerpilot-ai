const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

// Configuration for Gemini retry mechanism
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 15000;

const RETRYABLE_HTTP_STATUSES = new Set([408, 429, 500, 502, 503, 504]);
const PERMANENT_HTTP_STATUSES = new Set([400, 401, 403, 404, 405, 409, 413, 422]);

// Sanitize strings to prevent logging API keys or sensitive tokens
function sanitizeSecrets(text) {
  if (!text) return "";
  let str = typeof text === "string" ? text : String(text);
  if (apiKey) {
    str = str.split(apiKey).join("[REDACTED_API_KEY]");
  }
  str = str.replace(/([?&](?:api[_-]?key|key|token|auth)=)[^&\s"']+/gi, "$1[REDACTED]");
  str = str.replace(/\b(AIza[0-9A-Za-z-_]{35})\b/g, "[REDACTED_API_KEY]");
  return str;
}

// Extract HTTP status code from SDK errors or serialized error responses
function extractStatusCode(error) {
  if (!error) return null;

  if (typeof error.status === "number") return error.status;
  if (typeof error.statusCode === "number") return error.statusCode;

  if (typeof error.status === "string" && /^\d{3}$/.test(error.status.trim())) {
    return parseInt(error.status.trim(), 10);
  }

  if (typeof error.code === "number" && error.code >= 100 && error.code <= 599) {
    return error.code;
  }

  if (typeof error.message === "string") {
    try {
      const parsed = JSON.parse(error.message);
      const code = parsed?.error?.code || parsed?.code;
      if (typeof code === "number" && code >= 100 && code <= 599) {
        return code;
      }
    } catch {
      // not JSON
    }

    const match = error.message.match(/\b(429|500|502|503|504|400|401|403|404|408)\b/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return null;
}

// Extract a clean, user-friendly error message without raw JSON or leaked secrets
function extractCleanErrorMessage(error) {
  if (!error) return "Unknown error occurred";
  if (typeof error.message === "string") {
    try {
      const parsed = JSON.parse(error.message);
      if (parsed?.error?.message) {
        return sanitizeSecrets(parsed.error.message);
      }
      if (parsed?.message) {
        return sanitizeSecrets(parsed.message);
      }
    } catch {
      // not JSON
    }
    return sanitizeSecrets(error.message);
  }
  return sanitizeSecrets(String(error));
}

// Determine if an error is temporary/transient and eligible for retry
function isTransientError(error) {
  if (!error) return false;

  const status = extractStatusCode(error);

  // Permanent HTTP status codes must not be retried
  if (status && PERMANENT_HTTP_STATUSES.has(status)) {
    return false;
  }

  // Explicit retryable HTTP status codes (429, 500, 502, 503, 504)
  if (status && RETRYABLE_HTTP_STATUSES.has(status)) {
    return true;
  }

  const message = String(error.message || "").toLowerCase();

  // Permanent error indicators
  if (
    message.includes("api_key_invalid") ||
    message.includes("api key not valid") ||
    message.includes("invalid api key") ||
    message.includes("permission_denied") ||
    message.includes("permission denied") ||
    message.includes("invalid_argument") ||
    message.includes("invalid argument") ||
    message.includes("not_found")
  ) {
    return false;
  }

  // Transient error indicators
  if (
    message.includes("resource_exhausted") ||
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("unavailable") ||
    message.includes("high demand") ||
    message.includes("spikes in demand") ||
    message.includes("deadline_exceeded") ||
    message.includes("timeout") ||
    message.includes("try again later") ||
    message.includes("service unavailable") ||
    message.includes("bad gateway") ||
    message.includes("gateway timeout") ||
    message.includes("overloaded")
  ) {
    return true;
  }

  // Network and socket level dropouts
  const code = error.code || error.cause?.code;
  const transientNetworkCodes = [
    "ECONNRESET",
    "ETIMEDOUT",
    "ECONNREFUSED",
    "EPIPE",
    "ENOTFOUND",
    "EAI_AGAIN",
    "EHOSTUNREACH",
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_SOCKET",
    "UND_ERR_HEADERS_TIMEOUT",
  ];

  if (code && transientNetworkCodes.includes(code)) {
    return true;
  }

  if (
    message.includes("fetch failed") ||
    message.includes("socket hang up") ||
    message.includes("econnreset") ||
    message.includes("network error")
  ) {
    return true;
  }

  return false;
}

// Extract any retry delay suggested by the API (e.g. google.rpc.RetryInfo or Retry-After header)
function extractSuggestedDelayMs(error) {
  if (!error) return null;

  // 1. Check for google.rpc.RetryInfo in parsed error message
  if (typeof error.message === "string") {
    try {
      const parsed = JSON.parse(error.message);
      const details = parsed?.error?.details || parsed?.details;
      if (Array.isArray(details)) {
        for (const detail of details) {
          if (detail && detail.retryDelay) {
            if (typeof detail.retryDelay === "string") {
              const sec = parseFloat(detail.retryDelay.replace(/s$/i, ""));
              if (!isNaN(sec) && sec > 0) return Math.round(sec * 1000);
            } else if (typeof detail.retryDelay === "object") {
              const seconds = Number(detail.retryDelay.seconds || 0);
              const nanos = Number(detail.retryDelay.nanos || 0);
              const ms = seconds * 1000 + Math.round(nanos / 1e6);
              if (ms > 0) return ms;
            }
          }
        }
      }
    } catch {
      // not JSON
    }

    // 2. Check for textual retry suggestions
    const match = error.message.match(/retry (?:after|in) (\d+(?:\.\d+)?)\s*(s|sec|seconds|ms)?/i);
    if (match) {
      const val = parseFloat(match[1]);
      const unit = (match[2] || "s").toLowerCase();
      if (!isNaN(val) && val > 0) {
        return unit.startsWith("ms") ? Math.round(val) : Math.round(val * 1000);
      }
    }
  }

  // 3. Check response headers
  const headers = error.response?.headers || error.headers;
  if (headers) {
    const retryAfter = typeof headers.get === "function"
      ? headers.get("retry-after")
      : headers["retry-after"] || headers["Retry-After"];
    if (retryAfter) {
      const sec = parseFloat(retryAfter);
      if (!isNaN(sec) && sec > 0) {
        return Math.round(sec * 1000);
      }
      const date = Date.parse(retryAfter);
      if (!isNaN(date) && date > Date.now()) {
        return Math.min(date - Date.now(), 60000);
      }
    }
  }

  return null;
}

// Calculate delay using exponential backoff with jitter and suggested delay
function calculateBackoffDelay(attempt, error, baseDelayMs = INITIAL_DELAY_MS, maxDelayMs = MAX_DELAY_MS) {
  const suggested = extractSuggestedDelayMs(error);
  const jitter = Math.floor(Math.random() * 500);

  // If the API suggested a retry delay and it is practical, respect it
  if (suggested && suggested > 0 && suggested <= maxDelayMs) {
    return Math.min(suggested + jitter, maxDelayMs);
  }

  // Exponential backoff: base * 2^(attempt - 1) + jitter
  const expDelay = baseDelayMs * Math.pow(2, attempt - 1);
  return Math.min(expDelay + jitter, maxDelayMs);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Reusable retry wrapper for Gemini generation requests
async function callGeminiWithRetry(generatorFn, options = {}) {
  const maxRetries = options.maxRetries ?? MAX_RETRIES;
  const operationName = options.operationName || "Gemini generation";
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await generatorFn();
    } catch (error) {
      lastError = error;
      const status = extractStatusCode(error);
      const cleanMessage = extractCleanErrorMessage(error);

      // Do not retry invalid API keys, malformed requests, or other permanent errors
      if (!isTransientError(error)) {
        console.error(
          `[CareerPilot AI] Non-retryable error during ${operationName} (HTTP ${status || "permanent"}): ${cleanMessage}`
        );
        throw error;
      }

      if (attempt < maxRetries) {
        const delayMs = calculateBackoffDelay(attempt + 1, error);
        console.warn(
          `[CareerPilot AI] ${operationName} failed with transient error (${status ? `HTTP ${status}` : "Network/Unavailable"}: ${cleanMessage}). Retrying attempt ${attempt + 1}/${maxRetries} in ${delayMs}ms...`
        );
        await sleep(delayMs);
      }
    }
  }

  const status = extractStatusCode(lastError);
  const cleanMessage = extractCleanErrorMessage(lastError);
  console.error(
    `[CareerPilot AI] ${operationName} failed after ${maxRetries} retries: ${cleanMessage}`
  );

  const finalError = new Error(
    `Gemini request failed after ${maxRetries} retries (${status ? `HTTP ${status}` : "Transient Error"}): ${cleanMessage}`
  );
  finalError.originalError = lastError;
  finalError.status = status;
  throw finalError;
}

// Shared Gemini JSON generation function with retry mechanism.
async function generateJSON(prompt) {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is missing from server/.env");
  }

  const response = await callGeminiWithRetry(async () => {
    return await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });
  }, { operationName: "generateJSON" });

  const text = response?.text;

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

// URL validation and sanitization for learning resources.
function isValidResourceUrl(urlString) {
  if (!urlString || typeof urlString !== "string") return false;
  const trimmed = urlString.trim();

  // Reject unsafe schemes and injection attempts
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:") ||
    trimmed.startsWith("file:") ||
    trimmed.includes("<") ||
    trimmed.includes(">")
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const host = parsed.hostname.toLowerCase();

    // Reject localhost, local IPs, and placeholder domains
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      host === "example.com" ||
      host === "example.org" ||
      host === "example.net" ||
      host.endsWith(".example") ||
      host === "your-domain.com" ||
      host === "placeholder.com" ||
      host.includes("placeholder")
    ) {
      return false;
    }

    // Do not expose secrets or API keys in query parameters
    if (/api[_-]?key|secret|token|password|auth/i.test(parsed.search)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// Sanitize and deduplicate a list of resources.
function sanitizeResources(resourcesList, maxCount = 3) {
  if (!Array.isArray(resourcesList)) return [];
  const valid = [];
  const seenUrls = new Set();

  for (const item of resourcesList) {
    if (!item || typeof item !== "object") continue;
    const title = typeof item.title === "string" ? item.title.trim() : "";
    const url = typeof item.url === "string" ? item.url.trim() : "";
    const type = typeof item.type === "string" ? item.type.trim() : "Official Documentation";
    const description = typeof item.description === "string" ? item.description.trim() : "";

    if (!title || !url || !isValidResourceUrl(url)) continue;
    if (seenUrls.has(url)) continue;

    seenUrls.add(url);
    valid.push({
      title,
      url,
      type,
      description,
    });

    if (valid.length >= maxCount) break;
  }

  return valid;
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

Create a practical, personalized action plan for the selected career milestone, including high-quality, verified learning resources with real clickable URLs.

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
      "estimatedHours": 2,
      "resources": [
        {
          "title": "Bash Reference Manual",
          "url": "https://www.gnu.org/software/bash/manual/bash.html",
          "type": "Official Documentation",
          "description": "Learn Bash scripting fundamentals and syntax."
        }
      ]
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
  ],
  "resources": [
    {
      "title": "Overall Milestone Resource",
      "url": "https://www.gnu.org/software/bash/manual/",
      "type": "Official Documentation",
      "description": "Comprehensive reference guide for the milestone."
    }
  ]
}

REQUIREMENTS & RESOURCE GUIDELINES:
1. Create 3 to 5 ordered, actionable learning steps.
2. For EACH step, provide 1 to 3 high-quality learning resources matching the specific topic of that step.
3. Provide 1 to 3 top-level resources in the milestone "resources" array for overall reference.
4. RESOURCE QUALITY & AUTHORITATIVE SOURCES:
   - For Linux: GNU Bash Manual (https://www.gnu.org/software/bash/manual/bash.html), Linux Journey (https://linuxjourney.com/), Linux man-pages (https://man7.org/linux/man-pages/), GNU sed (https://www.gnu.org/software/sed/manual/sed.html), GNU awk (https://www.gnu.org/software/gawk/manual/gawk.html), systemd documentation (https://systemd.io/).
   - For AWS: AWS Documentation (https://docs.aws.amazon.com/), AWS Getting Started (https://aws.amazon.com/getting-started/), AWS Skill Builder (https://explore.skillbuilder.aws/).
   - For Docker: Docker Documentation (https://docs.docker.com/).
   - For Kubernetes: Kubernetes Documentation (https://kubernetes.io/docs/home/).
   - For Terraform: HashiCorp Developer Docs (https://developer.hashicorp.com/terraform/docs).
   - For Git: Git SCM Docs & Pro Git (https://git-scm.com/doc).
   - For Networking: Cloudflare Learning Center (https://www.cloudflare.com/learning/), Cisco DevNet (https://developer.cisco.com/).
   - For Python: Official Python Docs (https://docs.python.org/3/).
   - For Web Development / JS / Node.js: MDN Web Docs (https://developer.mozilla.org/), Node.js Docs (https://nodejs.org/en/docs).
   - For Go: Go Documentation (https://go.dev/doc/).
   - For Databases / SQL: PostgreSQL Docs (https://www.postgresql.org/docs/), MySQL Docs (https://dev.mysql.com/doc/).
   - For General / Roadmaps / Practice: freeCodeCamp (https://www.freecodecamp.org/), roadmap.sh (https://roadmap.sh/).
5. NEVER INVENT RESOURCE URLS:
   - Only return genuine, live URLs you can identify with high confidence as real learning resources.
   - Match resources strictly to the milestone topic (never attach Linux links to unrelated topics).
   - If a specific deep URL is uncertain, provide the verified root documentation URL (e.g., https://docs.docker.com/ instead of an invented path).
   - If no verified URL is known for a step, return an empty array [] for its resources. NEVER return placeholder URLs like example.com or todo.
6. Consider the student's education, existing skills, and target role.
7. Include one practical project relevant to the milestone with actionable tasks.
8. Include 3 relevant interview questions with clear answers.
9. Include 3 to 5 measurable success criteria.
10. Keep the workload and estimated hours realistic.
11. Return JSON only, without Markdown code fences.
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

  // Sanitize action plan steps and their resources
  advice.actionPlan = advice.actionPlan.map((step, index) => ({
    step: typeof step.step === "number" ? step.step : index + 1,
    title: typeof step.title === "string" ? step.title : `Step ${index + 1}`,
    description: typeof step.description === "string" ? step.description : "",
    estimatedHours: Number.isFinite(step.estimatedHours) ? step.estimatedHours : 2,
    resources: sanitizeResources(step.resources, 3),
  }));

  // Sanitize top-level milestone resources
  advice.resources = sanitizeResources(advice.resources, 5);

  return advice;
}

module.exports = {
  generateCareerRoadmap,
  generateMilestoneAdvice,
};

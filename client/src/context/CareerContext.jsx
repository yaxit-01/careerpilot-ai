import { useState, useEffect } from "react";
import { CareerContext } from "./CareerContextObject";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PROGRESS_STORAGE_KEY = "careerpilot-progress";
const ROADMAP_STORAGE_KEY = "careerpilot-roadmap";
const FORM_STORAGE_KEY = "careerpilot-form";
const ADVICE_STORAGE_KEY = "careerpilot-advice";

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved);
  } catch (err) {
    console.warn(`Unable to parse ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Unable to save ${key} to localStorage:`, err);
  }
}

const DEFAULT_FORM = {
  education: "B.Tech CSE, second year",
  targetRole: "Cloud Engineer",
  companyType: "Product-based company",
  existingSkills: "Python, Linux basics",
  weeklyHours: 10,
  targetMonths: 12,
};

export function CareerProvider({ children }) {
  // Form inputs state
  const [form, setForm] = useState(() =>
    loadFromStorage(FORM_STORAGE_KEY, DEFAULT_FORM)
  );

  // Roadmap state
  const [roadmap, setRoadmap] = useState(() =>
    loadFromStorage(ROADMAP_STORAGE_KEY, null)
  );
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState("");

  // Milestone completion progress state: { [milestoneId]: "not-started" | "in-progress" | "completed" }
  const [milestoneProgress, setMilestoneProgress] = useState(() =>
    loadFromStorage(PROGRESS_STORAGE_KEY, {})
  );

  // AI action plan advice state: { [milestoneId]: adviceObject }
  const [adviceMap, setAdviceMap] = useState(() =>
    loadFromStorage(ADVICE_STORAGE_KEY, {})
  );
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceError, setAdviceError] = useState("");

  // Persist form changes
  useEffect(() => {
    saveToStorage(FORM_STORAGE_KEY, form);
  }, [form]);

  // Persist roadmap changes
  useEffect(() => {
    if (roadmap) {
      saveToStorage(ROADMAP_STORAGE_KEY, roadmap);
    }
  }, [roadmap]);

  // Persist milestone status progress
  useEffect(() => {
    saveToStorage(PROGRESS_STORAGE_KEY, milestoneProgress);
  }, [milestoneProgress]);

  // Persist advice map
  useEffect(() => {
    saveToStorage(ADVICE_STORAGE_KEY, adviceMap);
  }, [adviceMap]);

  function updateField(eventOrName, maybeValue) {
    if (typeof eventOrName === "object" && eventOrName?.target) {
      const { name, value } = eventOrName.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [eventOrName]: maybeValue }));
    }
  }

  function updateMilestoneStatus(id, status) {
    setMilestoneProgress((prev) => {
      const updated = {
        ...prev,
        [id]: status,
      };
      saveToStorage(PROGRESS_STORAGE_KEY, updated);
      return updated;
    });
  }

  function getMilestoneStatus(milestoneOrId) {
    if (!milestoneOrId) return "not-started";
    const id = typeof milestoneOrId === "object" ? milestoneOrId.id : milestoneOrId;
    const defaultStatus =
      typeof milestoneOrId === "object" ? milestoneOrId.status : undefined;
    return milestoneProgress[id] || defaultStatus || "not-started";
  }

  function getMilestoneById(id) {
    if (!roadmap || !Array.isArray(roadmap.milestones)) return null;
    return roadmap.milestones.find((m) => String(m.id) === String(id)) || null;
  }

  // Returns roadmap milestones with live status merged in
  function getMilestones() {
    if (!roadmap || !Array.isArray(roadmap.milestones)) return [];
    return roadmap.milestones.map((m) => ({
      ...m,
      status: getMilestoneStatus(m),
    }));
  }

  function getAdviceForMilestone(id) {
    return adviceMap[id] || null;
  }

  // Generate Career Roadmap via backend
  async function generateRoadmap(overrideForm) {
    const formData = overrideForm || form;
    setLoadingRoadmap(true);
    setRoadmapError("");

    try {
      const skillsArray = typeof formData.existingSkills === "string"
        ? formData.existingSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(formData.existingSkills)
        ? formData.existingSkills
        : [];

      const payload = {
        education: formData.education.trim(),
        targetRole: formData.targetRole.trim(),
        companyType: formData.companyType,
        existingSkills: skillsArray,
        weeklyHours: Number(formData.weeklyHours),
        targetMonths: Number(formData.targetMonths),
      };

      const response = await fetch(`${API_URL}/api/roadmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Unable to generate roadmap."
        );
      }

      if (
        !data ||
        !Array.isArray(data.milestones) ||
        data.milestones.length === 0
      ) {
        throw new Error(
          "The generated roadmap does not contain any milestones."
        );
      }

      setRoadmap(data);
      saveToStorage(ROADMAP_STORAGE_KEY, data);

      // Reset progress & advice for newly generated roadmap
      setMilestoneProgress({});
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
      setAdviceMap({});
      localStorage.removeItem(ADVICE_STORAGE_KEY);

      return data;
    } catch (err) {
      const message =
        err.message || "Something went wrong while generating your roadmap.";
      setRoadmapError(message);
      throw err;
    } finally {
      setLoadingRoadmap(false);
    }
  }

  // Generate AI Action Plan for a milestone
  async function generateAdvice(milestone) {
    if (!milestone) return null;

    setAdviceLoading(true);
    setAdviceError("");

    try {
      const skillsArray = typeof form.existingSkills === "string"
        ? form.existingSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(form.existingSkills)
        ? form.existingSkills
        : [];

      const response = await fetch(`${API_URL}/api/milestone-advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetRole: form.targetRole,
          education: form.education,
          existingSkills: skillsArray,
          milestone: {
            id: milestone.id,
            title: milestone.title,
            phase: milestone.phase || "",
            description: milestone.description || "",
            skills: milestone.skills || [],
            project: milestone.project || "",
            durationWeeks: milestone.durationWeeks || 1,
            prerequisites: milestone.prerequisites || [],
            certifications: milestone.certifications || [],
            resources: milestone.resources || [],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to generate the action plan."
        );
      }

      const generatedAdvice = data.advice || data;

      setAdviceMap((prev) => {
        const next = {
          ...prev,
          [milestone.id]: generatedAdvice,
        };
        saveToStorage(ADVICE_STORAGE_KEY, next);
        return next;
      });

      return generatedAdvice;
    } catch (err) {
      const message =
        err.message ||
        "Something went wrong while generating the action plan.";
      setAdviceError(message);
      throw err;
    } finally {
      setAdviceLoading(false);
    }
  }

  const value = {
    form,
    setForm,
    updateField,
    roadmap,
    setRoadmap,
    loadingRoadmap,
    roadmapError,
    setRoadmapError,
    generateRoadmap,
    milestoneProgress,
    updateMilestoneStatus,
    getMilestoneStatus,
    getMilestones,
    getMilestoneById,
    adviceMap,
    adviceLoading,
    adviceError,
    setAdviceError,
    generateAdvice,
    getAdviceForMilestone,
    API_URL,
  };

  return (
    <CareerContext.Provider value={value}>
      {children}
    </CareerContext.Provider>
  );
}



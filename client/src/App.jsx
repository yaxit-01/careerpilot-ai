import { useState, useEffect } from "react";
import {
  Sparkles,
  Target,
  Clock,
  Code2,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Lightbulb,
  LoaderCircle,
  ListChecks,
  MessageSquare,
} from "lucide-react";

import RoadmapGraph from "./components/RoadmapGraph";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const STORAGE_KEY = "careerpilot-progress";

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export default function App() {
  const [form, setForm] = useState({
    education: "B.Tech CSE, second year",
    targetRole: "Cloud Engineer",
    companyType: "Product-based company",
    existingSkills: "Python, Linux basics",
    weeklyHours: 10,
    targetMonths: 12,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const [milestoneProgress, setMilestoneProgress] =
    useState(loadProgress);

  // AI action-plan state
  const [advice, setAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceError, setAdviceError] = useState("");

  // Save progress in localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(milestoneProgress)
      );
    } catch (err) {
      console.error("Unable to save progress:", err);
    }
  }, [milestoneProgress]);

  // Reset selected milestone and advice when a new roadmap is generated.
  useEffect(() => {
    setSelectedMilestone(null);
    setAdvice(null);
    setAdviceError("");
  }, [roadmap]);

  const milestones = roadmap?.milestones || [];

  const completedCount = milestones.filter(
    (milestone) =>
      getMilestoneStatus(milestone) === "completed"
  ).length;

  const inProgressCount = milestones.filter(
    (milestone) =>
      getMilestoneStatus(milestone) === "in-progress"
  ).length;

  const progressPercentage = milestones.length
    ? Math.round((completedCount / milestones.length) * 100)
    : 0;

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

function updateMilestoneStatus(id, status) {
    setMilestoneProgress((previous) => ({
      ...previous,
      [id]: status,
    }));
  }
  function getMilestoneStatus(milestone) {
    return (
      milestoneProgress[milestone.id] ||
      milestone.status ||
      "not-started"
    );
  }

  // Generate the complete career roadmap.
  async function generateRoadmap(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setRoadmap(null);
    setSelectedMilestone(null);
    setAdvice(null);
    setAdviceError("");

    try {
      const response = await fetch(`${API_URL}/api/roadmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          weeklyHours: Number(form.weeklyHours),
          targetMonths: Number(form.targetMonths),
          existingSkills: form.existingSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        }),
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
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while generating your roadmap."
      );
    } finally {
      setLoading(false);
    }
  }

  // Generate an AI action plan for an individual milestone.
  async function generateAdvice(milestone) {
    setSelectedMilestone(milestone);
    setAdvice(null);
    setAdviceError("");
    setAdviceLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/milestone-advice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetRole: form.targetRole,
            education: form.education,
            existingSkills: form.existingSkills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
            milestone: {
              id: milestone.id,
              title: milestone.title,
              description: milestone.description || "",
              skills: milestone.skills || [],
              project: milestone.project || "",
              durationWeeks: milestone.durationWeeks || 1,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to generate the action plan."
        );
      }

      // Support either a direct response or { advice: {...} }.
      setAdvice(data.advice || data);
    } catch (err) {
      setAdviceError(
        err.message ||
          "Something went wrong while generating the action plan."
      );
    } finally {
      setAdviceLoading(false);
    }
  }

  return (
    <main className="app">
      {/* Header */}
      <header className="topbar">
        <a className="brand" href="#">
          <Sparkles size={24} />
          CareerPilot <span>AI</span>
        </a>

        <div className="status">
          <span className="status-dot" />
          Your career journey starts here
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="eyebrow">
          <Sparkles size={16} />
          AI-POWERED CAREER PLANNING
        </div>

        <h1>
          Your dream career.
          <br />
          <span>Your roadmap.</span>
        </h1>

        <p>
          Turn your career goals into a personalized plan with
          skills, projects, milestones, and actionable next steps.
        </p>
      </section>

      {/* Main workspace */}
      <section className="workspace">
        {/* Career form */}
        <form className="form-card" onSubmit={generateRoadmap}>
          <h2>Build your career roadmap</h2>

          <label>
            <GraduationCap size={17} />
            Current education
          </label>

          <input
            name="education"
            value={form.education}
            onChange={updateField}
            placeholder="e.g. B.Tech CSE, second year"
            required
          />

          <label>
            <Target size={17} />
            Dream job
          </label>

          <input
            name="targetRole"
            value={form.targetRole}
            onChange={updateField}
            placeholder="e.g. Cloud Engineer"
            required
          />

          <label>Target company type</label>

          <select
            name="companyType"
            value={form.companyType}
            onChange={updateField}
          >
            <option>Product-based company</option>
            <option>Startup</option>
            <option>Service-based company</option>
            <option>Any company</option>
          </select>

          <label>
            <Code2 size={17} />
            Existing skills
          </label>

          <input
            name="existingSkills"
            value={form.existingSkills}
            onChange={updateField}
            placeholder="Python, Java, Linux"
          />

          <div className="field-row">
            <div>
              <label>
                <Clock size={17} />
                Hours per week
              </label>

              <input
                type="number"
                name="weeklyHours"
                min="1"
                max="80"
                value={form.weeklyHours}
                onChange={updateField}
                required
              />
            </div>

            <div>
              <label>Timeline (months)</label>

              <input
                type="number"
                name="targetMonths"
                min="1"
                max="60"
                value={form.targetMonths}
                onChange={updateField}
                required
              />
            </div>
          </div>

          <button
            className="primary-button"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              <Sparkles size={18} />
            )}

            {loading ? "Generating..." : "Generate My Roadmap"}
          </button>

          <p className="privacy-note">
            Your goals are used to personalize your roadmap.
          </p>
        </form>

        {/* Results */}
        <section className="result-card">
          {/* Empty state */}
          {!roadmap && !loading && !error && (
            <div className="empty-state">
              <div className="empty-icon">
                <Target size={36} />
              </div>

              <h2>Your future starts here</h2>

              <p>
                Enter your career goals to generate your personalized
                learning journey.
              </p>

              <div className="feature-list">
                <div>✓ Personalized learning milestones</div>
                <div>✓ Practical projects and skills</div>
                <div>✓ Career-focused recommendations</div>
                <div>✓ AI-generated action plans</div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="empty-state">
              <div className="empty-icon">
                <LoaderCircle className="spin" size={36} />
              </div>

              <h2>Building your roadmap...</h2>

              <p>Analyzing your goals and existing skills.</p>
            </div>
          )}

          {/* Roadmap error */}
          {error && (
            <div className="error-message" role="alert">
              <strong>Unable to generate roadmap</strong>
              <p>{error}</p>
              <p>Please check your backend connection and try again.</p>
            </div>
          )}

          {/* Generated roadmap */}
          {roadmap && (
            <div className="roadmap-summary">
              <div className="eyebrow">
                YOUR PERSONALIZED PLAN
              </div>

              <h2>{roadmap.title}</h2>

              <p>{roadmap.summary}</p>

              {/* Overall progress */}
              <section className="progress-section">
                <div className="progress-heading">
                  <h3>
                    <TrendingUp size={19} />
                    Your Progress
                  </h3>

                  <span>{progressPercentage}%</span>
                </div>

                <div
                  className="progress-track"
                  role="progressbar"
                  aria-label="Career roadmap completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progressPercentage}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>

                <div className="progress-stats">
                  <span>
                    <CheckCircle2 size={15} />
                    {completedCount} completed
                  </span>

                  <span>
                    {inProgressCount} in progress
                  </span>

                  <span>
                    {milestones.length} total milestones
                  </span>
                </div>
              </section>

              {/* Interactive graph */}
              <h3>Career milestones</h3>

              <p className="graph-hint">
                Select a milestone in the graph to view its details
                and generate a personalized action plan.
              </p>

              <RoadmapGraph
                key={roadmap.title}
                milestones={milestones}
                onSelect={(milestone) => {
                  setSelectedMilestone(milestone);
                  setAdvice(null);
                  setAdviceError("");
                }}
              />

              {/* Selected milestone details */}
              {selectedMilestone && (
                <section className="milestone-details">
                  <div className="milestone-detail-heading">
                    <h3>{selectedMilestone.title}</h3>

                    <span
                      className={`milestone-badge ${getMilestoneStatus(
                        selectedMilestone
                      )}`}
                    >
                      {getMilestoneStatus(
                        selectedMilestone
                      ).replace("-", " ")}
                    </span>
                  </div>

                  <p>
                    {selectedMilestone.description ||
                      "No description available."}
                  </p>

                  <div className="milestone-status">
                    <label htmlFor="milestone-status">
                      Update milestone status
                    </label>

                    <select
                      id="milestone-status"
                      value={getMilestoneStatus(selectedMilestone)}
                      onChange={(event) =>
                        updateMilestoneStatus(
                          selectedMilestone.id,
                          event.target.value
                        )
                      }
                    >
                      <option value="not-started">
                        Not Started
                      </option>

                      <option value="in-progress">
                        In Progress
                      </option>

                      <option value="completed">
                        Completed
                      </option>
                    </select>
                  </div>

                  <h4>Skills to learn</h4>

                  {selectedMilestone.skills?.length > 0 ? (
                    <ul>
                      {selectedMilestone.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No skills listed for this milestone.</p>
                  )}

                  <h4>Recommended project</h4>

                  <p>
                    {selectedMilestone.project ||
                      "No project recommendation available."}
                  </p>

                  <h4>Estimated duration</h4>

                  <p>
                    {selectedMilestone.durationWeeks
                      ? `${selectedMilestone.durationWeeks} weeks`
                      : "Not specified"}
                  </p>

                  {selectedMilestone.certifications?.length > 0 && (
                    <>
                      <h4>Recommended certifications</h4>

                      <ul>
                        {selectedMilestone.certifications.map(
                          (certification) => (
                            <li key={certification}>
                              {certification}
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}

                  {/* AI action-plan button */}
                  <button
                    type="button"
                    className="primary-button advice-button"
                    disabled={adviceLoading}
                    onClick={() =>
                      generateAdvice(selectedMilestone)
                    }
                  >
                    {adviceLoading ? (
                      <LoaderCircle
                        className="spin"
                        size={18}
                      />
                    ) : (
                      <Sparkles size={18} />
                    )}

                    {adviceLoading
                      ? "Generating Action Plan..."
                      : "Generate AI Action Plan"}
                  </button>
                </section>
              )}

              {/* Action-plan loading */}
              {adviceLoading && (
                <section
                  className="advice-panel"
                  aria-live="polite"
                >
                  <LoaderCircle className="spin" size={28} />

                  <h3>Creating your action plan...</h3>

                  <p>
                    AI is preparing learning steps, a practical
                    project, and interview questions.
                  </p>
                </section>
              )}

              {/* Action-plan error */}
              {adviceError && (
                <div
                  className="error-message advice-error"
                  role="alert"
                >
                  <strong>Unable to generate action plan</strong>
                  <p>{adviceError}</p>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      generateAdvice(selectedMilestone)
                    }
                    disabled={adviceLoading || !selectedMilestone}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* AI-generated action plan */}
              {advice && !adviceLoading && (
                <section className="advice-panel">
                  <div className="eyebrow">
                    <Sparkles size={15} />
                    YOUR AI ACTION PLAN
                  </div>

                  <h2>
                    {advice.milestoneTitle ||
                      selectedMilestone?.title ||
                      "Milestone Action Plan"}
                  </h2>

                  {advice.estimatedHours != null && (
                    <div className="advice-meta">
                      <Clock size={17} />
                      Estimated effort: {advice.estimatedHours} hours
                    </div>
                  )}

                  {/* Learning steps */}
                  {advice.actionPlan?.length > 0 && (
                    <div className="advice-section">
                      <h3>
                        <ListChecks size={20} />
                        Step-by-Step Learning Plan
                      </h3>

                      <div className="advice-steps">
                        {advice.actionPlan.map((step, index) => (
                          <article
                            className="advice-step"
                            key={`${step.step || index}-${step.title}`}
                          >
                            <div className="advice-step-number">
                              {step.step || index + 1}
                            </div>

                            <div>
                              <h4>{step.title}</h4>

                              {step.description && (
                                <p>{step.description}</p>
                              )}

                              {step.estimatedHours != null && (
                                <small>
                                  <Clock size={13} />
                                  {" "}
                                  {step.estimatedHours} hours
                                </small>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project */}
                  {advice.project && (
                    <div className="advice-section">
                      <h3>
                        <Code2 size={20} />
                        Practical Project
                      </h3>

                      <h4>{advice.project.title}</h4>

                      {advice.project.description && (
                        <p>{advice.project.description}</p>
                      )}

                      {advice.project.tasks?.length > 0 && (
                        <ul>
                          {advice.project.tasks.map((task, index) => (
                            <li key={`${index}-${task}`}>
                              {task}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Interview questions */}
                  {advice.interviewQuestions?.length > 0 && (
                    <div className="advice-section">
                      <h3>
                        <MessageSquare size={20} />
                        Interview Preparation
                      </h3>

                      {advice.interviewQuestions.map(
                        (item, index) => (
                          <article
                            className="interview-question"
                            key={`${index}-${item.question}`}
                          >
                            <h4>
                              Q{index + 1}. {item.question}
                            </h4>

                            {item.answer && (
                              <p>
                                <strong>Answer:</strong>{" "}
                                {item.answer}
                              </p>
                            )}
                          </article>
                        )
                      )}
                    </div>
                  )}

                  {/* Success criteria */}
                  {advice.successCriteria?.length > 0 && (
                    <div className="advice-section">
                      <h3>
                        <CheckCircle2 size={20} />
                        Success Criteria
                      </h3>

                      <ul>
                        {advice.successCriteria.map(
                          (criterion, index) => (
                            <li key={`${index}-${criterion}`}>
                              {criterion}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Fallback if response format differs */}
                  {!advice.actionPlan &&
                    !advice.project &&
                    !advice.interviewQuestions &&
                    !advice.successCriteria && (
                      <div className="advice-section">
                        <h3>
                          <Lightbulb size={20} />
                          AI Recommendations
                        </h3>

                        <pre className="advice-raw">
                          {JSON.stringify(advice, null, 2)}
                        </pre>
                      </div>
                    )}

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setAdvice(null);
                      setAdviceError("");
                    }}
                  >
                    Close Action Plan
                  </button>
                </section>
              )}

              {/* All milestones */}
              <div className="milestone-list">
                <h3>All Milestones</h3>

                {milestones.map((milestone, index) => {
                  const status = getMilestoneStatus(milestone);

                  return (
                    <article
                      className="milestone"
                      key={milestone.id || index}
                    >
                      <div className="milestone-number">
                        {status === "completed" ? (
                          <CheckCircle2 size={22} />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div className="milestone-content">
                        <h4>{milestone.title}</h4>

                        <p>{milestone.description}</p>

                        <small>
                          {milestone.durationWeeks
                            ? `${milestone.durationWeeks} weeks`
                            : "Duration not specified"}
                        </small>

                        <div className="milestone-card-status">
                          <label
                            htmlFor={`status-${milestone.id}`}
                          >
                            Status
                          </label>

                          <select
                            id={`status-${milestone.id}`}
                            value={status}
                            onChange={(event) =>
                              updateMilestoneStatus(
                                milestone.id,
                                event.target.value
                              )
                            }
                          >
                            <option value="not-started">
                              Not Started
                            </option>

                            <option value="in-progress">
                              In Progress
                            </option>

                            <option value="completed">
                              Completed
                            </option>
                          </select>
                        </div>

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => {
                            setSelectedMilestone(milestone);
                            setAdvice(null);
                            setAdviceError("");

                            document
                              .querySelector(".milestone-details")
                              ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                          }}
                        >
                          <BookOpen size={15} />
                          View Details
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </section>

      <footer>
        CareerPilot AI · Plan your learning. Build your future.
      </footer>
    </main>
  );
}
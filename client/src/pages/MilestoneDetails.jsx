import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  LoaderCircle,
  Clock,
  Layers,
  Code2,
  FolderGit2,
  Award,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { useCareer } from "../context/useCareer";

export default function MilestoneDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getMilestoneById,
    getMilestoneStatus,
    updateMilestoneStatus,
    generateAdvice,
    getAdviceForMilestone,
    adviceLoading,
    adviceError,
  } = useCareer();

  const milestone = getMilestoneById(id);

  if (!milestone) {
    return (
      <div className="milestone-details-page-container">
        <div className="error-message" role="alert" style={{ textAlign: "center", padding: "36px 20px" }}>
          <strong>Milestone Not Found</strong>
          <p>
            The milestone with ID &ldquo;{id}&rdquo; was not found in your current career roadmap.
          </p>
          <div style={{ marginTop: "20px" }}>
            <Link to="/roadmap" className="primary-button">
              <ArrowLeft size={16} /> Return to Roadmap
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = getMilestoneStatus(milestone);
  const existingAdvice = getAdviceForMilestone(milestone.id);

  async function handleGenerateAdvice() {
    try {
      await generateAdvice(milestone);
      navigate(`/action-plan/${milestone.id}`);
    } catch {
      // Error message is stored in context and rendered below
    }
  }

  return (
    <div className="milestone-details-page-container">
      <div className="page-header-nav">
        <Link to="/roadmap" className="secondary-button back-link">
          <ArrowLeft size={16} />
          Back to Roadmap
        </Link>
      </div>

      <section className="milestone-details-card">
        <div className="milestone-detail-heading">
          <h2>{milestone.title}</h2>
          <span className={`milestone-badge ${status}`}>
            {status.replace("-", " ")}
          </span>
        </div>

        <p className="milestone-desc">
          {milestone.description || "No description available for this milestone."}
        </p>

        {/* Milestone status dropdown */}
        <div className="milestone-status">
          <label htmlFor="milestone-status">Update milestone status</label>
          <select
            id="milestone-status"
            value={status}
            onChange={(event) =>
              updateMilestoneStatus(milestone.id, event.target.value)
            }
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Learning Phase */}
        <div className="milestone-info-block">
          <h4>
            <Layers size={17} />
            Learning Phase
          </h4>
          <p>{milestone.phase || "Phase not specified"}</p>
        </div>

        {/* Estimated Duration */}
        <div className="milestone-info-block">
          <h4>
            <Clock size={17} />
            Estimated Duration
          </h4>
          <p>
            {milestone.durationWeeks
              ? `${milestone.durationWeeks} ${milestone.durationWeeks === 1 ? "week" : "weeks"}`
              : "Not specified"}
          </p>
        </div>

        {/* Required Skills */}
        <div className="milestone-info-block">
          <h4>
            <Code2 size={17} />
            Required Skills
          </h4>
          {milestone.skills?.length > 0 ? (
            <ul>
              {milestone.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No skills specified for this milestone.</p>
          )}
        </div>

        {/* Prerequisites */}
        <div className="milestone-info-block">
          <h4>
            <CheckCircle2 size={17} />
            Prerequisites
          </h4>
          {milestone.prerequisites?.length > 0 ? (
            <ul>
              {milestone.prerequisites.map((prereqId) => {
                const prereq = getMilestoneById(prereqId);
                return (
                  <li key={prereqId}>
                    {prereq ? (
                      <Link to={`/milestone/${prereq.id}`} className="prereq-link">
                        {prereq.title}
                      </Link>
                    ) : (
                      prereqId
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>None (Foundation milestone)</p>
          )}
        </div>

        {/* Recommended Project */}
        <div className="milestone-info-block">
          <h4>
            <FolderGit2 size={17} />
            Recommended Project
          </h4>
          <p>
            {milestone.project || "No project recommendation available."}
          </p>
        </div>

        {/* Certifications (if provided) */}
        {milestone.certifications?.length > 0 && (
          <div className="milestone-info-block">
            <h4>
              <Award size={17} />
              Recommended Certifications
            </h4>
            <ul>
              {milestone.certifications.map((cert) => (
                <li key={cert}>{cert}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Learning Resources (if provided) */}
        {milestone.resources?.length > 0 && (
          <div className="milestone-info-block">
            <h4>
              <BookOpen size={17} />
              Learning Resources
            </h4>
            <ul>
              {milestone.resources.map((resource, index) => {
                if (typeof resource === "string") {
                  return <li key={index}>{resource}</li>;
                }
                return (
                  <li key={index}>
                    {resource.url ? (
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        {resource.name || resource.title || resource.url}
                      </a>
                    ) : (
                      resource.name || resource.title || JSON.stringify(resource)
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* AI Action Plan Actions */}
        <div className="action-plan-actions-section">
          {existingAdvice ? (
            <div className="action-plan-ready-box">
              <div className="action-plan-ready-text">
                <Sparkles size={18} />
                <span>AI Action Plan is ready for this milestone.</span>
              </div>
              <div className="button-row">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => navigate(`/action-plan/${milestone.id}`)}
                >
                  <Sparkles size={18} />
                  View AI Action Plan
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  disabled={adviceLoading}
                  onClick={handleGenerateAdvice}
                >
                  {adviceLoading ? (
                    <LoaderCircle className="spin" size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  {adviceLoading ? "Regenerating..." : "Regenerate Plan"}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="primary-button advice-button"
              disabled={adviceLoading}
              onClick={handleGenerateAdvice}
            >
              {adviceLoading ? (
                <LoaderCircle className="spin" size={18} />
              ) : (
                <Sparkles size={18} />
              )}
              {adviceLoading
                ? "Generating Action Plan..."
                : "Generate AI Action Plan"}
            </button>
          )}
        </div>

        {/* Advice Loading state */}
        {adviceLoading && (
          <section className="advice-panel" aria-live="polite">
            <LoaderCircle className="spin" size={28} />
            <h3>Creating your action plan...</h3>
            <p>
              AI is preparing learning steps, a practical project, and interview
              questions.
            </p>
          </section>
        )}

        {/* Advice Error state */}
        {adviceError && (
          <div className="error-message advice-error" role="alert">
            <strong>Unable to generate action plan</strong>
            <p>{adviceError}</p>
            <button
              type="button"
              className="secondary-button"
              onClick={handleGenerateAdvice}
              disabled={adviceLoading}
            >
              Try Again
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Map,
  Sparkles,
  Clock,
  ListChecks,
  Code2,
  MessageSquare,
  CheckCircle2,
  Lightbulb,
  LoaderCircle,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { useCareer } from "../context/useCareer";

export default function ActionPlan() {
  const { id } = useParams();
  const {
    getAdviceForMilestone,
    getMilestoneById,
    generateAdvice,
    adviceLoading,
    adviceError,
  } = useCareer();

  const advice = getAdviceForMilestone(id);
  const milestone = getMilestoneById(id);

  // Recovery handling if advice is missing
  if (!advice) {
    if (milestone) {
      return (
        <div className="action-plan-page-container">
          <div className="page-header-nav">
            <Link to={`/milestone/${id}`} className="secondary-button back-link">
              <ArrowLeft size={16} />
              Back to Milestone
            </Link>
            <Link to="/roadmap" className="secondary-button back-link">
              <Map size={16} />
              Back to Roadmap
            </Link>
          </div>

          <section className="advice-panel">
            <div className="eyebrow">
              <Sparkles size={15} />
              ACTION PLAN NOT GENERATED
            </div>
            <h2>No Action Plan Found</h2>
            <p>
              An action plan has not been generated yet for milestone &ldquo;
              {milestone.title}&rdquo;.
            </p>

            {adviceError && (
              <div className="error-message" role="alert" style={{ marginTop: "16px" }}>
                <strong>Unable to generate action plan</strong>
                <p>{adviceError}</p>
              </div>
            )}

            <div className="button-row" style={{ marginTop: "24px" }}>
              <button
                type="button"
                className="primary-button"
                disabled={adviceLoading}
                onClick={() => generateAdvice(milestone)}
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

              <Link to={`/milestone/${id}`} className="secondary-button">
                Back to Milestone
              </Link>
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="action-plan-page-container">
        <div className="error-message" role="alert" style={{ textAlign: "center", padding: "36px 20px" }}>
          <strong>Milestone Not Found</strong>
          <p>The requested milestone could not be found in your career roadmap.</p>
          <div className="button-row" style={{ justifyContent: "center", marginTop: "20px" }}>
            <Link to="/roadmap" className="primary-button">
              <Map size={16} /> Return to Roadmap
            </Link>
            <Link to="/profile" className="secondary-button">
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="action-plan-page-container">
      {/* Top navigation */}
      <div className="page-header-nav">
        <Link to={`/milestone/${id}`} className="secondary-button back-link">
          <ArrowLeft size={16} />
          Back to Milestone
        </Link>
        <Link to="/roadmap" className="secondary-button back-link">
          <Map size={16} />
          Back to Roadmap
        </Link>
      </div>

      <article className="advice-panel">
        <div className="eyebrow">
          <Sparkles size={15} />
          YOUR AI ACTION PLAN
        </div>

        <h2>
          {advice.milestoneTitle ||
            milestone?.title ||
            "Milestone Action Plan"}
        </h2>

        {advice.estimatedHours != null && (
          <div className="advice-meta">
            <Clock size={17} />
            Estimated effort: {advice.estimatedHours} hours
          </div>
        )}

        {/* Learning Steps */}
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

                  <div className="advice-step-content">
                    <h4>{step.title}</h4>
                    {step.description && <p>{step.description}</p>}
                    {step.estimatedHours != null && (
                      <small>
                        <Clock size={13} /> {step.estimatedHours} hours
                      </small>
                    )}

                    {/* Step Learning Resources */}
                    <div className="step-resources-section">
                      <div className="step-resources-heading">
                        <BookOpen size={14} />
                        <span>Learning Resources</span>
                      </div>

                      {step.resources && step.resources.length > 0 ? (
                        <div className="step-resources-grid">
                          {step.resources.map((res, rIdx) => (
                            <article
                              className="resource-card"
                              key={`${rIdx}-${res.url || res.title}`}
                            >
                              <div className="resource-header">
                                {res.type && (
                                  <span className="resource-type-badge">
                                    {res.type}
                                  </span>
                                )}
                                <h5 className="resource-title">{res.title}</h5>
                              </div>

                              {res.description && (
                                <p className="resource-description">
                                  {res.description}
                                </p>
                              )}

                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="resource-link-button"
                              >
                                <span>Open Resource</span>
                                <ExternalLink size={13} />
                              </a>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="no-resources-note">
                          No learning links available yet.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Practical Project */}
        {advice.project && (
          <div className="advice-section">
            <h3>
              <Code2 size={20} />
              Practical Project
            </h3>

            <h4>{advice.project.title}</h4>
            {advice.project.description && <p>{advice.project.description}</p>}

            {advice.project.tasks?.length > 0 && (
              <div>
                <h5 style={{ margin: "14px 0 8px", fontSize: "13px", color: "var(--accent)" }}>
                  Implementation Tasks
                </h5>
                <ul>
                  {advice.project.tasks.map((task, index) => (
                    <li key={`${index}-${task}`}>{task}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Interview Questions */}
        {advice.interviewQuestions?.length > 0 && (
          <div className="advice-section">
            <h3>
              <MessageSquare size={20} />
              Interview Preparation
            </h3>

            {advice.interviewQuestions.map((item, index) => (
              <article
                className="interview-question"
                key={`${index}-${item.question}`}
              >
                <h4>
                  Q{index + 1}. {item.question}
                </h4>
                {item.answer && (
                  <p>
                    <strong>Answer:</strong> {item.answer}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Success Criteria */}
        {advice.successCriteria?.length > 0 && (
          <div className="advice-section">
            <h3>
              <CheckCircle2 size={20} />
              Success Criteria
            </h3>

            <ul>
              {advice.successCriteria.map((criterion, index) => (
                <li key={`${index}-${criterion}`}>{criterion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Milestone-wide Learning Resources */}
        {advice.resources?.length > 0 && (
          <div className="advice-section">
            <h3>
              <BookOpen size={20} />
              Milestone Learning Resources
            </h3>

            <div className="step-resources-grid">
              {advice.resources.map((res, rIdx) => (
                <article
                  className="resource-card"
                  key={`overall-${rIdx}-${res.url || res.title}`}
                >
                  <div className="resource-header">
                    {res.type && (
                      <span className="resource-type-badge">{res.type}</span>
                    )}
                    <h5 className="resource-title">{res.title}</h5>
                  </div>

                  {res.description && (
                    <p className="resource-description">{res.description}</p>
                  )}

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link-button"
                  >
                    <span>Open Resource</span>
                    <ExternalLink size={13} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Fallback if response format is different */}
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

        {/* Bottom navigation buttons */}
        <div className="button-row" style={{ marginTop: "32px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
          <Link to={`/milestone/${id}`} className="secondary-button">
            <ArrowLeft size={16} />
            Back to Milestone
          </Link>
          <Link to="/roadmap" className="secondary-button">
            <Map size={16} />
            Back to Roadmap
          </Link>
        </div>
      </article>
    </div>
  );
}

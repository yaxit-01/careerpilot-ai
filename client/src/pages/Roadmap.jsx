import { useNavigate, Link } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Target,
  Sparkles,
  User,
} from "lucide-react";
import RoadmapGraph from "../components/RoadmapGraph";
import { useCareer } from "../context/useCareer";

export default function Roadmap() {
  const navigate = useNavigate();
  const {
    roadmap,
    getMilestones,
    getMilestoneStatus,
    updateMilestoneStatus,
  } = useCareer();

  if (!roadmap || !Array.isArray(roadmap.milestones) || roadmap.milestones.length === 0) {
    return (
      <div className="roadmap-page-container">
        <section className="result-card" style={{ maxWidth: "600px", margin: "40px auto" }}>
          <div className="empty-state">
            <div className="empty-icon">
              <Target size={36} />
            </div>

            <h2>No Roadmap Found</h2>

            <p>
              You haven&apos;t generated a career roadmap yet. Fill in your career
              profile to generate your personalized learning journey.
            </p>

            <Link
              to="/profile"
              className="primary-button"
              style={{ marginTop: "20px" }}
            >
              <Sparkles size={18} />
              Create Career Profile
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const milestones = getMilestones();

  const completedCount = milestones.filter(
    (milestone) => getMilestoneStatus(milestone) === "completed"
  ).length;

  const inProgressCount = milestones.filter(
    (milestone) => getMilestoneStatus(milestone) === "in-progress"
  ).length;

  const progressPercentage = milestones.length
    ? Math.round((completedCount / milestones.length) * 100)
    : 0;

  return (
    <div className="roadmap-page-container">
      <section className="result-card">
        <div className="roadmap-summary">
          <div className="roadmap-header-row">
            <div className="eyebrow">YOUR PERSONALIZED PLAN</div>
            <Link to="/profile" className="secondary-button roadmap-edit-btn">
              <User size={15} />
              Edit Profile
            </Link>
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
              <span>{inProgressCount} in progress</span>
              <span>{milestones.length} total milestones</span>
            </div>
          </section>

          {/* Interactive graph */}
          <h3>Career milestones</h3>
          <p className="graph-hint">
            Select a milestone node in the graph below to view its details and
            generate an AI action plan.
          </p>

          <RoadmapGraph
            key={roadmap.title}
            milestones={milestones}
            onSelect={(milestone) => {
              navigate(`/milestone/${milestone.id}`);
            }}
          />

          {/* All milestones list */}
          <div className="milestone-list">
            <h3>All Milestones</h3>

            {milestones.map((milestone, index) => {
              const status = getMilestoneStatus(milestone);

              return (
                <article className="milestone" key={milestone.id || index}>
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
                      <label htmlFor={`status-${milestone.id}`}>Status</label>
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
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => navigate(`/milestone/${milestone.id}`)}
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
      </section>
    </div>
  );
}

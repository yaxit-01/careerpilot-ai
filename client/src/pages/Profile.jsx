import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap,
  Target,
  Code2,
  Clock,
  Sparkles,
  LoaderCircle,
  Map,
} from "lucide-react";
import { useCareer } from "../context/useCareer";

export default function Profile() {
  const navigate = useNavigate();
  const {
    form,
    updateField,
    generateRoadmap,
    loadingRoadmap,
    roadmapError,
    roadmap,
  } = useCareer();

  async function handleSubmit(event) {
    event.preventDefault();

    // Client-side validation
    if (!form.education?.trim()) {
      return;
    }
    if (!form.targetRole?.trim()) {
      return;
    }

    const hours = Number(form.weeklyHours);
    if (isNaN(hours) || hours < 1 || hours > 80) {
      return;
    }

    const months = Number(form.targetMonths);
    if (isNaN(months) || months < 1 || months > 60) {
      return;
    }

    try {
      await generateRoadmap();
      navigate("/roadmap");
    } catch {
      // Error message is handled by context state and rendered below
    }
  }

  return (
    <div className="profile-page-container">
      {roadmap && (
        <div className="profile-existing-banner">
          <span>You already have an active career roadmap generated.</span>
          <Link to="/roadmap" className="secondary-button banner-btn">
            <Map size={15} />
            View Current Roadmap
          </Link>
        </div>
      )}

      <form className="form-card profile-form-card" onSubmit={handleSubmit}>
        <h2>Build your career roadmap</h2>

        <label htmlFor="education">
          <GraduationCap size={17} />
          Current education
        </label>
        <input
          id="education"
          name="education"
          value={form.education}
          onChange={updateField}
          placeholder="e.g. B.Tech CSE, second year"
          required
        />

        <label htmlFor="targetRole">
          <Target size={17} />
          Dream job
        </label>
        <input
          id="targetRole"
          name="targetRole"
          value={form.targetRole}
          onChange={updateField}
          placeholder="e.g. Cloud Engineer"
          required
        />

        <label htmlFor="companyType">Target company type</label>
        <select
          id="companyType"
          name="companyType"
          value={form.companyType}
          onChange={updateField}
        >
          <option>Product-based company</option>
          <option>Startup</option>
          <option>Service-based company</option>
          <option>Any company</option>
        </select>

        <label htmlFor="existingSkills">
          <Code2 size={17} />
          Existing skills
        </label>
        <input
          id="existingSkills"
          name="existingSkills"
          value={form.existingSkills}
          onChange={updateField}
          placeholder="Python, Java, Linux"
        />

        <div className="field-row">
          <div>
            <label htmlFor="weeklyHours">
              <Clock size={17} />
              Hours per week
            </label>
            <input
              type="number"
              id="weeklyHours"
              name="weeklyHours"
              min="1"
              max="80"
              value={form.weeklyHours}
              onChange={updateField}
              required
            />
          </div>

          <div>
            <label htmlFor="targetMonths">Timeline (months)</label>
            <input
              type="number"
              id="targetMonths"
              name="targetMonths"
              min="1"
              max="60"
              value={form.targetMonths}
              onChange={updateField}
              required
            />
          </div>
        </div>

        {roadmapError && (
          <div className="error-message" role="alert" style={{ marginTop: "20px" }}>
            <strong>Unable to generate roadmap</strong>
            <p>{roadmapError}</p>
            <p>Please check your backend connection and try again.</p>
          </div>
        )}

        <button
          className="primary-button"
          disabled={loadingRoadmap}
          type="submit"
        >
          {loadingRoadmap ? (
            <LoaderCircle className="spin" size={18} />
          ) : (
            <Sparkles size={18} />
          )}
          {loadingRoadmap ? "Generating Roadmap..." : "Generate My Roadmap"}
        </button>

        <p className="privacy-note">
          Your goals are used to personalize your roadmap.
        </p>
      </form>
    </div>
  );
}

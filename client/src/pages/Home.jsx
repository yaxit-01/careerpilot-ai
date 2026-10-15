import { Link } from "react-router-dom";
import { Sparkles, Target, TrendingUp, Lightbulb, ArrowRight, Map } from "lucide-react";
import { useCareer } from "../context/useCareer";

export default function Home() {
  const { roadmap } = useCareer();

  return (
    <div className="welcome-page">
      <section className="welcome-hero">
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
          Turn your career goals into a personalized plan with skills,
          projects, milestones, and actionable next steps.
        </p>

        <div className="hero-cta-group">
          <Link to="/profile" className="primary-button welcome-button">
            Get Started
            <ArrowRight size={18} />
          </Link>

          {roadmap && (
            <Link to="/roadmap" className="secondary-button welcome-secondary-button">
              <Map size={18} />
              View Existing Roadmap
            </Link>
          )}
        </div>

        <section className="welcome-features">
          <article>
            <Target size={26} />
            <h3>Personalized Milestones</h3>
            <p>
              Customized learning sequences structured specifically around your
              background, existing skills, and target role.
            </p>
          </article>

          <article>
            <TrendingUp size={26} />
            <h3>Interactive Roadmap Graph</h3>
            <p>
              Visualize learning dependencies, track your progress percentage,
              and see how each step connects toward your goal.
            </p>
          </article>

          <article>
            <Lightbulb size={26} />
            <h3>AI Action Plans</h3>
            <p>
              Receive step-by-step learning guides, portfolio project tasks, and
              interview preparation for each individual milestone.
            </p>
          </article>
        </section>
      </section>
    </div>
  );
}

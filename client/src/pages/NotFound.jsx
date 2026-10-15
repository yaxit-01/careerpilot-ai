import { Link } from "react-router-dom";
import { Sparkles, Home, User, Map } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found-page-container">
      <section className="empty-state">
        <div className="empty-icon">
          <Sparkles size={36} />
        </div>

        <h1 style={{ fontSize: "56px", margin: "0 0 8px", color: "var(--accent)" }}>
          404
        </h1>

        <h2>Page Not Found</h2>

        <p>
          The page you are looking for doesn&apos;t exist, was removed, or has
          moved to a different destination.
        </p>

        <div className="button-row" style={{ marginTop: "24px", justifyContent: "center" }}>
          <Link to="/" className="primary-button">
            <Home size={16} />
            Go to Home
          </Link>
          <Link to="/profile" className="secondary-button">
            <User size={16} />
            Career Profile
          </Link>
          <Link to="/roadmap" className="secondary-button">
            <Map size={16} />
            View Roadmap
          </Link>
        </div>
      </section>
    </div>
  );
}


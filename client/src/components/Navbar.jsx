import { Link, NavLink } from "react-router-dom";
import { Sparkles, Home, User, Map } from "lucide-react";

export default function Navbar() {
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <Sparkles size={24} />
        CareerPilot <span>AI</span>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
          end
        >
          <Home size={16} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <User size={16} />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/roadmap"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <Map size={16} />
          <span>Roadmap</span>
        </NavLink>
      </nav>

      <div className="status">
        <span className="status-dot" />
        <span className="status-text">Your career journey</span>
      </div>
    </header>
  );
}


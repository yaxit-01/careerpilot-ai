import Navbar from "./Navbar";

export default function PageLayout({ children }) {
  return (
    <main className="app">
      <Navbar />
      <div className="page-content">{children}</div>
      <footer>
        CareerPilot AI · Plan your learning. Build your future.
      </footer>
    </main>
  );
}


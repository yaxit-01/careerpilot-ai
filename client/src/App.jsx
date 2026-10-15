import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CareerProvider } from "./context/CareerContext";
import PageLayout from "./components/PageLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Roadmap from "./pages/Roadmap";
import MilestoneDetails from "./pages/MilestoneDetails";
import ActionPlan from "./pages/ActionPlan";
import NotFound from "./pages/NotFound";
import "./App.css";

export default function App() {
  return (
    <CareerProvider>
      <BrowserRouter>
        <PageLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/milestone/:id" element={<MilestoneDetails />} />
            <Route path="/action-plan/:id" element={<ActionPlan />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageLayout>
      </BrowserRouter>
    </CareerProvider>
  );
}
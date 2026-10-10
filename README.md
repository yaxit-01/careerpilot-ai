# 🚀 CareerPilot AI

CareerPilot AI is an intelligent career-planning platform that transforms ambitious career targets into structured, step-by-step visual roadmaps. By analyzing your current background, skill set, and target timeline, CareerPilot AI breaks down complex career transitions into bite-sized milestones complete with actionable guidance.

🌐 **Live Demo:** [careerpilot-ai-woad-rho.vercel.app](https://careerpilot-ai-woad-rho.vercel.app/)

---

## ✨ Features

- **Personalized AI Roadmaps:** Generate custom roadmaps based on your target role, company type, background, weekly study availability, and timeline.
- **Interactive Visual Graph:** Explore career trajectories interactively with visual dependency flow powered by React Flow.
- **Deep-Dive Milestone Guidance:** Drill down into individual milestones to generate actionable step-by-step advice, required topics, and project ideas.
- **Progress Tracking:** Track your progress across milestones (`Not Started`, `In Progress`, `Completed`) with automated percentage completion tracking.
- **Local Persistence:** Retain your generated plans, progress, and inputs across browser sessions using `localStorage`.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React + Vite
- **Graph Visualization:** React Flow (`@xyflow/react`)
- **Icons:** Lucide React
- **Styling:** CSS3

### Backend
- **Runtime:** Node.js & Express
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Utilities:** CORS, dotenv

---

## 📁 Project Structure

```text
careerpilot-ai/
├── client/                  # React + Vite frontend application
│   ├── src/                 # UI components, styles, and state logic
│   ├── .env.example         # Sample environment variables for client
│   └── package.json
├── server/                  # Node.js + Express backend API
│   ├── services/
│   │   └── aiService.js     # Gemini API integration & prompt engineering
│   ├── server.js            # Express server configuration & API routes
│   ├── .env.example         # Sample environment variables for server
│   └── package.json
└── README.md

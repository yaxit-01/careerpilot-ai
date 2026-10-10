CareerPilot AI

CareerPilot AI is an AI-powered career planning application that helps users turn a career goal into a structured roadmap with milestones and actionable next steps.

Features

AI-generated career roadmap — create a roadmap based on your career goal and details.

Milestone-based planning — break a larger goal into manageable steps.

Interactive roadmap graph — explore roadmap milestones visually.

Milestone guidance — get focused advice for individual milestones.

Progress tracking — track milestone progress.

Local persistence — saved form and roadmap/progress data can persist in the browser using LocalStorage.

Tech Stack

Frontend

React

Vite

React Flow (@xyflow/react)

Lucide React

CSS

Backend

Node.js

Express

Google Gemini API (@google/genai)

CORS

dotenv

Project Structure

careerpilot-ai/
├── client/                  # React + Vite frontend
│   ├── src/
│   └── package.json
└── server/                  # Express API
    ├── services/
    │   └── aiService.js
    ├── server.js
    └── package.json

The exact files and folders may change as the project develops.

Requirements

Node.js and npm

A Google Gemini API key for AI-powered features

Run Locally

1. Clone the repository

git clone https://github.com/yaxit-01/careerpilot-ai.git
cd careerpilot-ai

2. Configure the backend

cd server
npm install

Create a .env file inside the server/ directory:

GEMINI_API_KEY=your_gemini_api_key
PORT=5000

Replace your_gemini_api_key with your own key. Do not commit .env or publish your API key.

Start the backend:

npm start

The API should be available at http://localhost:5000 (unless you configure a different port).

3. Configure the frontend

Open a second terminal:

cd client
npm install

Create a .env file inside client/:

VITE_API_URL=http://localhost:5000

The frontend must read import.meta.env.VITE_API_URL when making API requests. If the app currently uses a hard-coded API URL, update the relevant API calls to use this environment variable.

Start the frontend:

npm run dev

Open the local URL printed by Vite in your terminal, commonly http://localhost:5173.

Environment Variables

Backend (server/.env)

Variable

Description

GEMINI_API_KEY

Google Gemini API key used by the AI service

PORT

Port for the Express server; commonly 5000 locally

Frontend (client/.env)

Variable

Description

VITE_API_URL

Base URL of the backend API

Never put secret API keys in frontend environment variables. Variables prefixed with VITE_ are exposed to browser code.

Deployment

Backend — Render

Create a new Web Service in Render.

Connect this repository.

Set Root Directory to server.

Set Build Command to npm install.

Set Start Command to npm start.

Add GEMINI_API_KEY in the service's environment variables.

Deploy the service and verify its root endpoint returns a message confirming that the API is running.

Frontend — Vercel

Import this repository into Vercel.

Set Root Directory to client.

Select Vite as the framework if it is not detected automatically.

Set Build Command to npm run build and Output Directory to dist.

Add VITE_API_URL with the deployed Render backend URL, without a trailing slash.

Deploy the frontend.

After changing environment variables in Vercel, redeploy the frontend. Ensure the frontend uses VITE_API_URL for API requests.

API

The Express backend includes API routes for roadmap generation and milestone advice. The exact request and response schemas are defined in the backend route files.

The root endpoint (GET /) can be used as a basic deployment health check.

Security Notes

Keep API keys in backend environment variables.

Do not commit .env files.

If an API key is accidentally published, revoke it and create a new one.

Validate inputs and handle API errors gracefully.

Contributing

Fork the repository.

Create a feature branch.

Make and test your changes.

Open a pull request describing the changes.

License

No license has been specified yet. Add a LICENSE file if you want to define how others may use, modify, and distribute this project.

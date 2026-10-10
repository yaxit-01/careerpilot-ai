Today 9:49 AM
a52d0afd-549f-4f04-8d56-e3216fc4e99d.docx
Document
understand the problem statement and suggest me best that can i do in 8 hour hacathon
🏆 Best Hackathon Idea for 8 Hours — My Recommendation

I have gone through your complete 7-page hackathon problem statement. It offers four choices: Career Roadmapper, GD Arena, AptiQuiz, and Open Innovation for Student Pain Points.

For an 8-hour hackathon, my recommendation is Problem Statement 1: Reverse-Engineered Career Roadmapper.

I'll explain why, what you should build, which technologies to use, and how to divide the eight hours so you can create a working project that impresses the judges.

1. Understand All Four Problem Statements
Comparison at a glance
Factor	PS1: Career Roadmapper	PS2: GD Arena	PS3: AptiQuiz	PS4: Open Innovation
Main idea	AI-generated career roadmap	Practise group discussions with AI	Multiplayer aptitude quiz	Solve a student problem
AI required	Yes	Yes, including voice AI	No	Optional
Technical difficulty	Medium	Very high	Medium–high	Depends on idea
Main challenge	AI + interactive visualization	Real-time speech and AI turn-taking	Multiplayer synchronization	Proving a real need
Can you build an MVP in 8 hours?	Yes	Difficult	Yes	Yes, with a focused idea
Visual presentation potential	Excellent	Excellent	Excellent	Depends on the solution
My ranking	1st	4th	2nd	3rd

These rankings are my assessment of the development effort and demonstration potential, not official hackathon rankings.

Option 1: Reverse-Engineered Career Roadmapper

Problem: Students know what career they want but often don't know the exact steps to reach it.

For example, a student wants to become a Cloud Engineer at a product-based company.

Your application would generate a personalized roadmap showing:

The skills they need to learn.
The order in which to learn them.
Projects they should build.
Certifications they could pursue.
Intermediate career milestones.
Estimated time to become job-ready.

The important part is that the roadmap must be generated from the user's input, not selected from a collection of predefined roadmaps.

The judges also expect an interactive visual representation, such as a skill tree or graph, rather than a plain checklist. Clicking a milestone should reveal specific advice, and marking a skill as already known should update the roadmap. These are explicit requirements in the problem statement on page 3.

My verdict: This offers the best balance of AI functionality, visual appeal, and achievable scope for eight hours.

Option 2: GD Arena

Students practise group discussions with AI participants who have different personalities.

The application should:

Let users choose a discussion topic.
Support spoken conversations.
Include AI participants with different personalities.
Manage speaking turns and interruptions.
Provide feedback based on the discussion transcript.

The main challenge is coordinating speech recognition, AI responses, voice generation, and natural turn-taking.

My verdict: Interesting, but risky for eight hours unless your team already has working voice-AI components and knows how to integrate them.

Option 3: AptiQuiz

A live multiplayer aptitude competition for up to 50 students.

Features include:

Room creation and joining using a code.
A waiting lobby.
Timed questions.
Speed-based scoring.
A live leaderboard.
Final performance reports.
A college league.

The problem statement also requires server-controlled timing, reconnecting players, protection against duplicate or late answers, and testing with 50 simulated players. See pages 5–6.

My verdict: Choose this if your team is strongest in React, Node.js, Socket.IO, and real-time application development. You can build a convincing smaller version in eight hours, but the full specification is much larger.

Option 4: Open Innovation

You identify a problem students face during placement preparation and build a solution.

Possible ideas include:

An AI interview practice assistant.
A placement preparation planner.
A resume-to-job matching tool.
A system that identifies skill gaps.

However, the requirements go beyond building an application. You must also demonstrate real student demand through a survey or interviews with at least five students, document the evidence, and explain how your solution differs from existing tools. See page 7.

My verdict: This could be a strong choice if you already have a validated problem and can gather evidence quickly. Otherwise, PS1 is more straightforward.

2. My Recommended Project: CareerPilot AI 🚀

I recommend building an AI-powered career planning platform called CareerPilot AI.

The name is a suggestion; you can choose your own.

The central idea

Turn a student's dream job into a personalized, interactive career roadmap with actionable milestones, projects, certifications, and skill-gap analysis.

Imagine a student opens your website and enters:

"I'm a second-year CSE student. I want to become a Cloud Engineer at a product-based company within 12 months. I can study 10 hours per week, and I already know Python and basic Linux."

Your application generates a roadmap tailored to that goal.

What the student sees

The main screen should contain an interactive graph with milestones connected in a logical order.

For example:

Starting point → Linux & Networking → Git and Scripting → Cloud Fundamentals → Docker → CI/CD → Cloud Project → Interview Preparation

Each milestone should display its title, estimated duration, and status.

Clicking a milestone opens a details panel with:

Skills to learn.
A practical project.
Recommended learning resources.
Possible certifications.
Interview questions.
A button to mark the milestone as completed or already known.

If the user marks Linux as already known, the app should update the milestone's status and adjust the remaining roadmap where appropriate.

Important: This is an illustrative roadmap. Your application should generate the actual roadmap dynamically from the user's goals and existing skills.

3. The Features You Should Actually Build in 8 Hours

Do not try to implement every possible feature. Build a small application with a complete, reliable user journey.

I recommend prioritizing these five features.

Feature 1: Personalized Career Input

Create a clean form with the following fields:

Field	Example
Current education	B.Tech CSE, second year
Target role	Cloud Engineer
Target company type	Product-based company
Existing skills	Python, Linux basics
Available study time	10 hours/week
Target timeline	12 months

Add a prominent button:

Generate My Career Roadmap →

The form should accept different career goals rather than offering only a fixed set of choices.

Feature 2: AI-Generated Roadmap

This is the most important feature.

The backend should send the user's details to an AI model and request a structured response containing:

Career phases.
Skills.
Prerequisites.
Estimated durations.
Practical projects.
Recommended certifications.
Interview preparation milestones.

Request JSON from the model so the frontend can convert the response into a graph.

For example, a milestone might have this structure:

{
  "id": "cloud-fundamentals",
  "title": "Cloud Fundamentals",
  "phase": "Core Skills",
  "durationWeeks": 3,
  "skills": ["IAM", "Networking", "Virtual Machines"],
  "project": "Deploy a basic web application",
  "prerequisites": ["linux-basics"],
  "status": "not-started"
}

This is an illustrative data structure, not a fixed roadmap.

Validate the AI response before rendering it. If the model returns invalid JSON or the API fails, show an understandable error and allow the user to retry.

Feature 3: Interactive Career Graph

This feature can make your project stand out visually.

Use React Flow to display the AI-generated milestones as connected nodes.

Users should be able to:

Zoom in and out.
Pan around the graph.
Click a node to view details.
Track completed milestones.
See dependencies between milestones.

Avoid making the graph a decorative image. It should be interactive and driven by the AI-generated data.

Feature 4: Smart Milestone Assistant

When a user clicks a milestone, provide an action button such as:

Generate My Action Plan

The AI should return a focused plan for that particular milestone.

For example:

Milestone: Learn Docker.

Generated action plan:

Understand images and containers.
Learn Dockerfiles and basic commands.
Containerize a small application.
Build and run the container locally.
Document the project on GitHub.

You could also generate five interview questions or a weekend project idea.

This feature helps demonstrate that your application does more than generate a static diagram.

Feature 5: Progress Tracking and Skill Adjustment

Allow the user to mark milestones as:

Not Started.
In Progress.
Completed.
Already Known.

Update the graph visually when a milestone changes status.

For the eight-hour MVP, you can implement progress tracking in browser storage. When a user marks a skill as already known, the application should recalculate or regenerate the remaining roadmap while preserving relevant completed milestones.

You do not need to build a complex database or user authentication system for the initial demo.

4. The Best Technology Stack

For this project, I recommend React, a lightweight backend, and a graph visualization library.

Component	Recommended technology	Why
Frontend	React + Vite	Quick development and reusable components
Styling	Tailwind CSS	Rapid creation of a polished interface
Interactive graph	React Flow	Nodes, connections, zooming and panning
Backend	Node.js + Express	Simple API for AI requests
AI	An available generative AI API	Personalized roadmap generation
Data validation	Zod or an equivalent validator	Validate generated roadmap data
Progress storage	LocalStorage	Avoid unnecessary database work
Deployment	Vercel or another suitable host	Publish the application

Useful official resources:

React: React documentation
Vite: Vite documentation
React Flow: React Flow documentation
Express: Express documentation
Zod: Zod documentation
One important decision about AI

Check which AI API you can actually access before building the integration.

The hackathon organizers explicitly state that they do not provide API keys or credits.

Therefore, do not spend an hour integrating an API before checking that it works.

My recommendation: Build the interface and graph first, test the AI integration early, and keep the AI provider isolated behind one backend function so you can change providers if necessary.

Never put API keys in frontend code or commit them to GitHub. Use environment variables and provide a .env.example file.

5. Your Exact 8-Hour Development Plan

This is the plan I would follow to maximize your chances of having a complete, demonstrable application at the end.

Hour 1: Set Up and Establish the Core

Goal: Have the application running locally.

Tasks:

Create the required GitHub repository at the permitted time.
Set up React and Vite.
Configure Tailwind CSS.
Create the main dashboard layout.
Build the career input form.
Add navigation and basic styling.

Deliverable: A working frontend with a career input form.

Do not spend the entire first hour choosing colors or designing a logo.

Hour 2: Build the Roadmap Visualization

Goal: Display an interactive graph.

Tasks:

Integrate React Flow.
Create reusable milestone nodes.
Connect nodes using edges.
Add zoom and pan controls.
Implement a details panel for selected nodes.
Test with a small temporary dataset.

Deliverable: A functional interactive roadmap, even before AI integration.

This is an important checkpoint: you should already have something to demonstrate if the AI API becomes unreliable.

Hour 3: Implement AI Generation

Goal: Generate a roadmap from user input.

Tasks:

Create a backend endpoint, such as POST /api/roadmap.
Connect an available AI API.
Write the roadmap-generation prompt.
Request structured JSON.
Validate the returned data.
Convert the response into graph nodes and edges.

Deliverable: Entering a career goal produces a corresponding roadmap.

If the API is not working by the middle of this hour, troubleshoot briefly and keep building the remaining functionality. Do not let one external service consume your entire hackathon.

Hour 4: Add Actionable Milestones

Goal: Make each node useful.

Tasks:

Add skill descriptions.
Generate project suggestions.
Generate interview questions.
Show estimated duration and prerequisites.
Add links to learning resources where available.

Deliverable: Clicking a milestone reveals personalized advice.

Keep these features focused on the selected milestone rather than asking the AI to regenerate the entire roadmap each time.

Hour 5: Implement Dynamic Updates

Goal: Make the roadmap responsive to user progress.

Tasks:

Add milestone status controls.
Save progress to LocalStorage.
Highlight completed and known skills.
Update the roadmap when skills are marked as already known.
Preserve completed milestones where appropriate.

Deliverable: A user can change their progress and see the roadmap update.

Hour 6: Make It Look Like a Winning Product

Goal: Polish the user experience.

Tasks:

Improve typography and spacing.
Add a progress indicator.
Add a roadmap summary.
Make the graph fit different screen sizes.
Add loading states and error messages.
Test on a phone-sized viewport.

Deliverable: A professional, usable application rather than a basic coding prototype.

Hour 7: Test and Deploy

Goal: Make the application reliable.

Tasks:

Test multiple career goals.
Test empty form submissions.
Test invalid AI responses.
Test failed API requests.
Verify progress tracking.
Deploy the frontend and backend.
Test the deployed application from a fresh browser session.

Deliverable: A working application accessible through a public URL.

The problem statement requires deployment for the final round, even though deployment is not required for the initial round.

Hour 8: Prepare the Demonstration

Goal: Make the judges understand the value in minutes.

Tasks:

Fix critical bugs.
Verify the complete user journey.
Prepare a three-minute demo.
Prepare the architecture diagram.
Finish the README.
Capture screenshots as a backup.
Commit the finished work to GitHub.

Deliverable: A tested project that you can demonstrate confidently.

If you're working in a team of two

Divide the work like this:

Person	Primary responsibility
Teammate A	React UI, graph, interactions and progress tracking
Teammate B	Backend, AI integration, prompts, validation and testing

Agree on the JSON schema in the first 30 minutes so both sides can work in parallel.

If you're working alone, build the graph first, integrate AI second, and leave advanced features until the main flow works.

6. How to Make Your Project Stand Out

A basic AI career planner may look similar to many existing tools. The quality of the implementation and how closely it satisfies the problem statement will matter.

I would prioritize these differentiators.

A. Reverse-engineer the actual career journey

Instead of giving users generic advice such as "learn programming," generate intermediate milestones with prerequisites and concrete deliverables.

For example:

Learn Linux → Build a deployment project → Learn cloud networking → Deploy an application → Build a CI/CD pipeline → Practise cloud engineering interviews.

The order should reflect the actual dependencies between skills.

B. Add a skill-gap analysis

Let users enter their existing skills.

Show:

Skills they already know.
Skills they need to learn.
Skills currently blocking later milestones.
Projects that demonstrate their readiness.

This makes the roadmap more personal and actionable.

C. Make the graph the centrepiece

Do not replace the graph with a list of cards.

The judges explicitly distinguish between a genuinely interactive graph, skill tree, mind map, or timeline and a plain checklist or accordion.

Use a graph with a clean layout, meaningful connections, readable nodes, and a details panel.

D. Include realistic projects and certifications

Recommend concrete projects and relevant certifications based on the target role.

Avoid inventing certification names, claiming that a certification guarantees a job, or presenting an estimated timeline as a promise.

Where possible, link to official documentation or certification pages.

E. Let the user adjust the roadmap

Suppose the student has only six months instead of twelve.

The application should be able to reconsider the plan based on that constraint, rather than simply changing the displayed date.

For the eight-hour version, a simple regenerated plan based on available weekly hours and the target timeline is sufficient.

7. What You Should NOT Build in Eight Hours

This is where hackathon teams often lose valuable time.

Avoid these features unless everything essential is already working:

Full user authentication and password recovery.
A complex PostgreSQL database.
Social networking between students.
A full marketplace for mentors.
A mobile application separate from the web application.
Multiple AI agents communicating with one another.
An elaborate recommendation engine based on real career histories.
A large analytics dashboard.
A complicated admin panel.

You can add these later if the project continues beyond the hackathon.

Remember: five working features are better than fifteen unfinished ones.

8. The Three-Minute Demo That I Would Present

The hackathon instructions state that the initial demonstration should take approximately three minutes. The final presentation allows six minutes for the presentation and live demo, followed by four minutes of questions.

Here is the demonstration I recommend.

0:00–0:30 — Introduce the problem

Say:

"Students are constantly told to learn new technologies, build projects, and prepare for placements. But they rarely know which skills to learn first, which projects matter, or how to plan their journey toward a specific role. CareerPilot AI turns that uncertainty into an actionable career roadmap."

0:30–1:00 — Enter a real goal

Enter a realistic example:

Target role: Cloud Engineer.
Current skills: Python and basic Linux.
Weekly study time: 10 hours.
Target timeline: 12 months.

Click Generate My Roadmap.

1:00–2:00 — Demonstrate the interactive graph

Show the generated career phases.

Click a milestone and explain its skills, prerequisites, project, and estimated duration.

Then mark one existing skill as already known and demonstrate how the roadmap updates.

This is the most important part of the demonstration.

2:00–2:30 — Show the AI assistant

Click another milestone and generate a project plan or interview questions.

Explain that the advice is generated for the selected skill rather than being the same generic advice for every user.

2:30–3:00 — Show the value

Show the user's completed milestones and remaining skill gaps.

Finish with:

"CareerPilot AI doesn't just tell students what to learn. It connects their current skills to their career goals and gives them a practical path to follow."

Only demonstrate features that actually work in your application.

9. Final Decision: Which Problem Statement Should You Choose?

My ranking for an eight-hour hackathon is:

🥇 First choice: PS1 — Reverse-Engineered Career Roadmapper

Best if your team can build a React application and integrate a generative AI API. It combines a meaningful student problem, AI-generated content, interactive visualization, and a clear demonstration.

🥈 Second choice: PS3 — AptiQuiz

Choose this if your team is more confident with real-time networking and backend logic than with AI integration. Keep the first version small and demonstrate the scoring and leaderboard reliably.

🥉 Third choice: PS4 — Open Innovation

Choose this if you already have a strong, validated student problem and can gather the required survey or interview evidence.

Fourth choice: PS2 — GD Arena

Choose this only if you already have experience with speech recognition, voice generation, and conversational AI.

These rankings reflect feasibility for the eight-hour constraint, not the organizers' judging preferences.

One final recommendation

Build CareerPilot AI with React, React Flow, and a working AI backend. Prioritize a genuinely AI-generated roadmap, interactive milestone nodes, actionable advice, and dynamic skill updates. Do not sacrifice those core requirements for unnecessary features.

Before I give you the exact project architecture and implementation prompts, tell me two things:

1. How many people are in your team?

A. Only me
B. Two people
C. Three or more people

2. Which development approach do you prefer?

A. React + Node.js
B. Python + Streamlit
C. AI coding tools that generate most of the code
D. Whatever gives us the best result in eight hours

With those two answers, I can give you a practical build plan tailored to your team, including the project structure, AI prompt, interface, and task allocation.

Pasted code(4).js
JavaScript
give corect app.jsx

Great! 🚀 Let's start Step 15: Deploy CareerPilot AI so hackathon judges can access it online.

Your GitHub repository is ready: CareerPilot AI

We'll deploy:

Backend on Render.
Frontend on Vercel.

First, deploy the backend. Follow these steps in order.

Step 15A — Deploy the Backend
Step 1: Open Render

Open the official website:

Render Dashboard

Sign up or log in.
Connect your GitHub account if prompted.
Authorize access to your careerpilot-ai repository.

Render supports deploying Node.js applications directly from GitHub.

Step 2: Create a Web Service

In the Render dashboard:

Click New +.
Select Web Service.
Find your repository: yaxit-01/careerpilot-ai.
Click Connect.

If you don't see the repository, check your GitHub repository access permissions.

Step 3: Configure Your Backend

Your project stores the backend inside the server folder, so use these settings:

Setting	Value
Name	careerpilot-ai-backend
Language	Node
Branch	main
Root Directory	server
Build Command	npm install
Start Command	npm start

Important: Set the Root Directory to server. Otherwise, Render may attempt to run the backend commands from the wrong folder.

Choose the Free plan if it is available and suitable for your hackathon.

Step 4: Configure Environment Variables

Before deploying, find the Environment Variables section.

Add the following variable:

Key	Value
GEMINI_API_KEY	Your own Google Gemini API key

Your backend code specifically reads GEMINI_API_KEY to connect to Gemini.

Security: Enter your API key directly into Render's environment-variable settings. Do not put the actual key in your React frontend or share it in this chat.

You can obtain or manage a Gemini API key through Google AI Studio.

You can leave GEMINI_MODEL unset initially because your backend already defines a default model.

Step 5: Deploy

Click Create Web Service.

Render will install your backend dependencies and start the Node.js server. You can monitor the process in the Logs section.

Wait until the deployment finishes successfully.

Step 6: Test Your Backend

Render will give you a public URL similar to:

https://careerpilot-ai-backend.onrender.com

Your actual URL may be different.

Open your actual Render URL in your browser.

You should see a response similar to:

{
  "message": "CareerPilot AI API is running"
}

If you see that message, your backend is running! 🎉

If the deployment fails, open Logs in Render and share the error message or a screenshot.

Your task now

Complete Steps 1–5 and send me a screenshot of your Render dashboard once deployment finishes.

Then we'll configure the frontend on Vercel and connect it to your deployed backend so the complete CareerPilot AI application works online.

Great! ✅ Your CareerPilot AI backend is successfully deployed on Render!

The message {"message":"CareerPilot AI API is running"} confirms that your backend is live.

Step 16: Deploy the Frontend on Vercel

Now we'll deploy your React frontend so anyone can access CareerPilot AI through a public website.

1. Open Vercel

Go to Vercel Dashboard and sign in with your GitHub account.

2. Import your GitHub repository
Click Add New → Project.
Find your repository: yaxit-01/careerpilot-ai.
Click Import.
3. Configure the project

Use these settings:

Setting	Value
Framework Preset	Vite
Root Directory	client
Build Command	npm run build
Output Directory	dist

Important: Set the Root Directory to client, because your frontend is inside that folder.

4. Add the backend URL

Under Environment Variables, add:

Name	Value
VITE_API_URL	https://careerpilot-ai-zf1v.onrender.com

Use the exact Render URL shown in your screenshot, without a trailing slash.

5. Deploy

Click Deploy and wait for the build to finish.

Vercel will give you a public website URL similar to:

https://careerpilot-ai.vercel.app

Your actual URL may be different.

⚠️ Before testing

The frontend must use VITE_API_URL when making API requests. If it still uses http://localhost:5000, it won't work for visitors.

Next: Complete the Vercel deployment and send me a screenshot of the result. If you get a build error, send me that screenshot instead, and we'll fix it.

make readme.md

I've created a complete README.md for your CareerPilot AI project. It includes:

Project overview and features
Tech stack and folder structure
Step-by-step local installation
Backend and frontend environment variables
Render backend deployment instructions
Vercel frontend deployment instructions
API information and security notes
📄 Download README.md

Download README.md

Add it to your GitHub repository
Download the file.
Place it in your project root:
C:\Users\dixit\careerpilot-ai\README.md
Open your terminal in the project folder and run:
git add README.md
git commit -m "Add project README"
git push origin main

Your README will then appear on your repository's main page: CareerPilot AI on GitHub 

README.md
Document

README.md
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
Variable	Description
GEMINI_API_KEY	Google Gemini API key used by the AI service
PORT	Port for the Express server; commonly 5000 locally
Frontend (client/.env)
Variable	Description
VITE_API_URL	Base URL of the backend API

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

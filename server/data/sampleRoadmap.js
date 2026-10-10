const sampleRoadmap = {
  title: "Cloud Engineer Career Roadmap",

  summary:
    "A personalized roadmap to help you develop cloud engineering skills and prepare for technical placements.",

  milestones: [
    {
      id: "programming",
      title: "Programming Fundamentals",
      phase: "Foundations",
      durationWeeks: 3,

      description:
        "Strengthen programming fundamentals and learn basic scripting.",

      skills: ["Python", "Git", "Problem Solving"],

      prerequisites: [],

      project: "Build a Python automation script",

      certifications: [],

      resources: [],

      status: "not-started",
    },

    {
      id: "linux",
      title: "Linux Fundamentals",
      phase: "Foundations",
      durationWeeks: 3,

      description:
        "Learn Linux commands, permissions, processes, and shell basics.",

      skills: ["Linux Commands", "Permissions", "Bash"],

      prerequisites: ["programming"],

      project: "Create a Linux system monitoring script",

      certifications: [],

      resources: [],

      status: "not-started",
    },

    {
      id: "networking",
      title: "Networking Fundamentals",
      phase: "Core Skills",
      durationWeeks: 4,

      description:
        "Understand IP addresses, DNS, HTTP, ports, and subnetting.",

      skills: ["TCP/IP", "DNS", "HTTP", "Subnetting"],

      prerequisites: ["linux"],

      project: "Document and test a small network lab",

      certifications: [],

      resources: [],

      status: "not-started",
    },

    {
      id: "cloud",
      title: "Cloud Computing Fundamentals",
      phase: "Cloud Skills",
      durationWeeks: 4,

      description:
        "Learn cloud computing concepts and core infrastructure services.",

      skills: ["Compute", "Storage", "IAM", "Virtual Networks"],

      prerequisites: ["networking"],

      project: "Deploy a basic application to a cloud environment",

      certifications: [],

      resources: [],

      status: "not-started",
    },

    {
      id: "docker",
      title: "Docker Fundamentals",
      phase: "DevOps Skills",
      durationWeeks: 3,

      description:
        "Learn container images, containers, Dockerfiles, and registries.",

      skills: ["Docker", "Containers", "Dockerfiles"],

      prerequisites: ["cloud"],

      project: "Containerize a Node.js application",

      certifications: [],

      resources: [],

      status: "not-started",
    },

    {
      id: "deployment",
      title: "Deployment and CI/CD",
      phase: "Practical Experience",
      durationWeeks: 4,

      description:
        "Learn automated testing, build pipelines, and deployment workflows.",

      skills: ["CI/CD", "GitHub Actions", "Deployment"],

      prerequisites: ["docker"],

      project: "Build a CI/CD pipeline for your application",

      certifications: [],

      resources: [],

      status: "not-started",
    },

    {
      id: "capstone",
      title: "Cloud Portfolio Project",
      phase: "Career Preparation",
      durationWeeks: 4,

      description:
        "Combine cloud infrastructure, deployment, monitoring, and documentation.",

      skills: ["Cloud Architecture", "Monitoring", "Documentation"],

      prerequisites: ["deployment"],

      project: "Deploy and document a complete cloud-based application",

      certifications: [],

      resources: [],

      status: "not-started",
    },
  ],
};

module.exports = sampleRoadmap;
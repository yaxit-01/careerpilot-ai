const roadmap = require("./data/sampleRoadmap");

console.log("Roadmap:", roadmap.title);

console.log("Total milestones:", roadmap.milestones.length);

roadmap.milestones.forEach((milestone) => {
  console.log(
    `${milestone.title} | ${milestone.durationWeeks} weeks`
  );
});
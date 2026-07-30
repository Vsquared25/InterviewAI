const knownSkills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "SQL",
  "Git",
  "Node.js",
  "AWS",
  "Docker",
  "Figma",
  "Excel",
  "Data Analysis",
  "Machine Learning",
  "Product Management",
];

export function findResumeSkills(resumeText: string) {
  const normalizedResume = resumeText.toLowerCase();

  return knownSkills.filter((skill) =>
    normalizedResume.includes(skill.toLowerCase()),
  );
}
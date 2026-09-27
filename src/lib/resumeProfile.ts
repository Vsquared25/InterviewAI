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
    // Engineering
  "CAD",
  "SolidWorks",
  "AutoCAD",

  // Business and finance
  "Project Management",
  "Financial Analysis",
  "Financial Modeling",
  "Accounting",
  "Auditing",

  // Healthcare
  "Patient Care",
  "Medical Terminology",
  "Public Health",

  // Education
  "Lesson Planning",
  "Classroom Management",
  "Curriculum Development",

  // Science and research
  "Research Design",
  "Laboratory Techniques",
  "Statistical Analysis",

  // Marketing and communications
  "Market Research",
  "Content Writing",
  "Social Media Marketing",
  "Public Relations",

  // Design
  "Graphic Design",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "User Research",

  // Public service, law, and social services
  "Policy Analysis",
  "Legal Research",
  "Case Management",
  "Community Outreach",
];

export function findResumeSkills(resumeText: string) {
  const normalizedResume = resumeText
    .toLowerCase()
    .replace(/\s+/g, " ");

  return knownSkills.filter((skill) => {
    const escapedSkill = skill
      .toLowerCase()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const pattern = new RegExp(
      `(^|[^a-z0-9])${escapedSkill}(?=$|[^a-z0-9])`,
    );

    return pattern.test(normalizedResume);
  });
}
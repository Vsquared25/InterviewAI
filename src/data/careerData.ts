export const rolesByCareerField = {
  "Technology and Computing": [
    "Software Engineering Intern",
    "Data Science Intern",
    "IT Support Intern",
    "Product Management Intern",
  ],
  Engineering: [
    "Mechanical Engineering Intern",
    "Electrical Engineering Intern",
    "Civil Engineering Intern",
  ],
  "Business and Consulting": [
    "Business Analyst Intern",
    "Management Consulting Intern",
    "Operations Intern",
  ],
  "Finance and Accounting": [
    "Financial Analyst Intern",
    "Accounting Intern",
    "Audit Intern",
  ],
  "Healthcare and Allied Health": [
    "Registered Nurse",
    "Medical Assistant",
    "Public Health Intern",
  ],
  Education: [
    "Teaching Assistant",
    "Elementary School Teacher",
    "Education Program Intern",
  ],
  "Science and Research": [
    "Research Assistant",
    "Laboratory Technician",
    "Environmental Science Intern",
  ],
  "Marketing and Communications": [
    "Marketing Intern",
    "Public Relations Intern",
    "Communications Intern",
  ],
  "Design and Creative Work": [
    "Graphic Design Intern",
    "UX Design Intern",
    "Video Production Intern",
  ],
  "Public Service, Law, and Social Services": [
    "Public Policy Intern",
    "Legal Assistant",
    "Social Services Intern",
  ],
} as const;

export type CareerField = keyof typeof rolesByCareerField;

export const careerFields = Object.keys(
  rolesByCareerField,
) as CareerField[];

export const skillsByCareerField: Record<CareerField, string[]> = {
  "Technology and Computing": [
    "React", "TypeScript", "JavaScript", "Python", "Java", "C++",
    "SQL", "Git", "Node.js", "AWS", "Docker",
    "Data Analysis", "Machine Learning", "Product Management",
  ],
  Engineering: [
    "CAD", "SolidWorks", "AutoCAD", "Python",
    "Data Analysis", "Project Management",
  ],
  "Business and Consulting": [
    "Project Management", "Excel", "Data Analysis",
    "Market Research", "Financial Analysis",
  ],
  "Finance and Accounting": [
    "Financial Analysis", "Financial Modeling",
    "Accounting", "Auditing", "Excel",
  ],
  "Healthcare and Allied Health": [
    "Patient Care", "Medical Terminology",
    "Public Health", "Case Management",
  ],
  Education: [
    "Lesson Planning", "Classroom Management",
    "Curriculum Development",
  ],
  "Science and Research": [
    "Research Design", "Laboratory Techniques",
    "Statistical Analysis", "Data Analysis", "Python",
  ],
  "Marketing and Communications": [
    "Market Research", "Content Writing",
    "Social Media Marketing", "Public Relations",
  ],
  "Design and Creative Work": [
    "Graphic Design", "Adobe Photoshop",
    "Adobe Illustrator", "Figma", "User Research",
  ],
  "Public Service, Law, and Social Services": [
    "Policy Analysis", "Legal Research",
    "Case Management", "Community Outreach",
  ],
};
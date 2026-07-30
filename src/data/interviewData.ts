export const modes = ["Behavioral", "Technical"] as const;

export type InterviewMode = (typeof modes)[number];

export const questionsByMode: Record<InterviewMode, string[]> = {
  Behavioral: [
    "Tell me about a time you had to learn something difficult quickly.",
    "Describe a time you worked through a disagreement with a teammate.",
    "Tell me about a project that did not go as planned.",
    "Give an example of when you took initiative without being asked.",
    "Tell me about a time you had to prioritize competing deadlines.",
  ],
  Technical: [
    "How would you design a task scheduler that handles urgent and recurring jobs?",
    "What happens when you type a URL into a browser and press Enter?",
    "How would you find the most frequent item in a large list of values?",
    "Explain the difference between a stack and a queue, and when you would use each.",
    "How would you investigate a page that becomes slow as more users arrive?",
  ],
};

const technicalSkills = [
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
  "Data Analysis",
  "Machine Learning",
];

export function getQuestionsForSession(
  mode: InterviewMode,
  resumeSkills: string[],
) {
  const baseQuestions = questionsByMode[mode];

  const relevantSkill =
    mode === "Technical"
      ? resumeSkills.find((skill) => technicalSkills.includes(skill))
      : resumeSkills[0];

  if (!relevantSkill) {
    return baseQuestions;
  }

  const tailoredFirstQuestion =
    mode === "Behavioral"
      ? `Tell me about a project where you used ${relevantSkill}. What was the challenge, what did you do, and what was the outcome?`
      : `Tell me about a project where you used ${relevantSkill}. What technical decision did you make, and what tradeoff did you consider?`;

  return [tailoredFirstQuestion, ...baseQuestions.slice(1)];
}

export const sampleFeedback = {
  summary:
    "You completed the practice session. Your response shows a solid starting point—now focus on making your impact easier to understand.",
  strengths: [
    {
      title: "You gave context",
      detail:
        "You started with enough background for an interviewer to understand the situation.",
    },
    {
      title: "You focused on your contribution",
      detail:
        "You kept the answer centered on what you did, rather than only describing the team.",
    },
  ],
  nextStep: {
    title: "Make the result more concrete",
    detail:
      "End your answer with a specific outcome, number, or lesson learned so the interviewer understands the impact.",
  },
};
import { skillsByCareerField, type CareerField } from "./careerData";
import { careerQuestionBanks } from "./careerQuestions";

export const modes = [
  "Behavioral",
  "Technical",
  "Situational",
  "Motivation / Career Fit",
  "Portfolio / Project Discussion",
  "Case Study",
] as const;



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
  Situational: [
  "You receive two urgent assignments with the same deadline. How would you prioritize them?",
  "You notice a mistake in work your team is about to submit. What would you do?",
  "A teammate repeatedly misses commitments that affect your work. How would you handle this?",
  "You are assigned a task you have never done before, and your supervisor is unavailable. How would you proceed?",
  "A customer or stakeholder disagrees with your proposed solution. How would you respond?",
],
"Motivation / Career Fit": [
  "What interests you about this role, and how does it connect to your career goals?",
  "Which experiences have helped you decide to pursue this field?",
  "What do you understand about the day-to-day responsibilities of this role?",
  "What strengths would you bring to this position, and what would you like to develop?",
  "What would you want to learn about an organization before deciding whether to join it?",
],
"Portfolio / Project Discussion": [
  "Walk me through a project or piece of work that best represents your abilities.",
  "What problem were you trying to solve, and who was the work intended for?",
  "What was your individual contribution, and how did you collaborate with others?",
  "Explain an important decision you made. What alternatives did you consider?",
  "How did you evaluate the outcome, and what would you improve if you revisited the work?",
],
"Case Study": [
  "A community program has declining attendance despite positive feedback from participants. How would you investigate the causes and recommend improvements?",
  "An organization wants to introduce a new service with a limited budget. How would you assess demand and decide whether to proceed?",
  "A team is repeatedly missing delivery deadlines. What information would you gather, and how would you identify the underlying problem?",
  "Two proposed solutions offer different benefits: one costs less, while the other better meets user needs. How would you compare them and make a recommendation?",
  "An organization has implemented your recommendation. Which measures would you use to determine whether it worked?",
],
};



export function getQuestionsForSession(
  mode: InterviewMode,
  resumeSkills: string[],
  careerField: CareerField,
  role: string,
) {
  const careerQuestions = careerQuestionBanks[careerField]?.[mode];

  let baseQuestions = careerQuestions ?? questionsByMode[mode];

  if (
    !careerQuestions &&
    mode === "Technical" &&
    careerField !== "Technology and Computing"
  ) {
    baseQuestions = [
      `Which concepts or methods are most important for a ${role}, and how would you apply one?`,
      `Describe a tool or technique relevant to a ${role}. When would you use it?`,
      `How would you check the quality and accuracy of your work as a ${role}?`,
      `What professional standards or ethical responsibilities are relevant to a ${role}?`,
      `Explain a challenging concept from ${careerField} to someone without experience in the field.`,
    ];
  }

  const relevantSkill = resumeSkills.find((skill) =>
    skillsByCareerField[careerField].includes(skill),
  );

  if (!relevantSkill) {
    return baseQuestions;
  }

  let tailoredFirstQuestion: string;

  if (mode === "Behavioral") {
    tailoredFirstQuestion =
      `Tell me about a time you used ${relevantSkill}. What was the challenge, what did you do, and what was the outcome?`;
  } else if (mode === "Technical") {
    tailoredFirstQuestion =
      `Your resume mentions ${relevantSkill}. Explain how you have applied it and how it could be useful in a ${role} position.`;
  } else if (mode === "Portfolio / Project Discussion") {
    tailoredFirstQuestion =
      `Walk me through a project or piece of work where you used ${relevantSkill}. Explain your contribution, decisions, and results.`;
  } else {
    return baseQuestions;
  }

  return [tailoredFirstQuestion, ...baseQuestions.slice(1)];
}
import type { CareerField } from "./careerData";
import type { InterviewMode } from "./interviewData";

type CareerQuestionBanks = Partial<
  Record<CareerField, Partial<Record<InterviewMode, string[]>>>
>;

export const careerQuestionBanks: CareerQuestionBanks = {
  Education: {
    Technical: [
      "How would you plan a lesson with a clear learning objective?",
      "How would you check whether students understood a concept during a lesson?",
      "How would you adapt an activity for students with different learning needs?",
      "What approaches would you use to establish classroom expectations?",
      "How would you use assessment results to adjust your instruction?",
    ],
    Situational: [
      "A student repeatedly interrupts a group activity. How would you respond?",
      "Several students appear confused, but one student is ready for more challenging work. What would you do?",
      "A parent expresses concern about their child's progress. How would you approach the conversation?",
      "A planned classroom activity is not engaging the students. How would you adjust it?",
      "Two students disagree during a collaborative task. How would you help them resolve it?",
    ],
  },
  "Finance and Accounting": {
  Technical: [
    "How are the income statement, balance sheet, and cash flow statement connected?",
    "What is the difference between profit and cash flow, and why does it matter?",
    "How would you investigate a significant difference between budgeted and actual expenses?",
    "What checks would you perform before relying on financial data in a report?",
    "Explain an internal control that can help prevent financial errors or fraud.",
  ],
  Situational: [
    "You discover an error in a financial report shortly before its deadline. How would you handle it?",
    "Two departments provide conflicting figures for the same reporting period. How would you resolve the discrepancy?",
    "A colleague asks you to approve an expense without the required documentation. What would you do?",
    "You need to explain an unexpected cost increase to someone without a finance background. How would you approach it?",
    "You receive sensitive financial information that appears to have been shared with you accidentally. How would you respond?",
  ],
},
Engineering: {
  Technical: [
    "How would you turn a project requirement into measurable engineering specifications?",
    "How would you compare design alternatives when cost, performance, and reliability compete?",
    "Describe how you would test whether a design meets its requirements.",
    "How would you identify and investigate a potential failure in a system or design?",
    "How would you document assumptions, calculations, and design decisions for another engineer?",
  ],
  Situational: [
    "A test result contradicts your calculations. How would you investigate the difference?",
    "A proposed design change could reduce costs but introduce a safety concern. How would you evaluate and communicate it?",
    "You find an unclear requirement shortly before a design review. What would you do?",
    "A teammate suggests skipping a verification step to meet a deadline. How would you respond?",
    "A supplier changes a component specification after your design is underway. How would you assess the impact?",
  ],
},
"Business and Consulting": {
  Technical: [
    "How would you identify the stakeholders and requirements for a business project?",
    "How would you choose useful measures for evaluating an operational process?",
    "What is the difference between revenue, cost, and profit?",
    "How would you identify the root cause of a recurring business problem?",
    "How would you compare recommendations based on their expected benefits, costs, and risks?",
  ],
  "Case Study": [
    "A retailer's sales are increasing, but its profit is falling. What would you investigate before making a recommendation?",
    "A small business is considering opening a second location. How would you assess whether expansion makes sense?",
    "Customers are waiting longer for a service despite unchanged demand. How would you investigate and improve the process?",
    "An organization has a limited budget and three competing projects. How would you decide which project to prioritize?",
    "A company wants to enter a new market. What information would you gather, and how would you evaluate the opportunity?",
  ],
},
"Marketing and Communications": {
  Technical: [
    "How would you identify the target audience for a campaign?",
    "How would you choose communication channels based on an audience and campaign goal?",
    "Which measures would you use to evaluate whether a campaign achieved its objective?",
    "How would you adapt the same message for different audiences while keeping it consistent?",
    "How would you check the accuracy, accessibility, and tone of content before publishing it?",
  ],
  Situational: [
    "A campaign receives high engagement but few conversions. What would you investigate?",
    "You discover an inaccurate claim in content scheduled for publication. What would you do?",
    "A client requests messaging that you believe could mislead the audience. How would you respond?",
    "Negative comments begin spreading about an organization online. How would you assess the situation before responding?",
    "Two stakeholders disagree about a campaign's message. How would you help reach a decision?",
  ],
},
"Design and Creative Work": {
  Technical: [
    "How would you turn a creative brief into clear project goals and requirements?",
    "How do you use hierarchy, contrast, and spacing to communicate information?",
    "How would you gather feedback to evaluate whether your work meets its audience's needs?",
    "How would you account for accessibility in your creative process?",
    "How would you prepare and organize project files for handoff to a collaborator?",
  ],
  "Portfolio / Project Discussion": [
    "Walk me through a piece of creative work, including the brief and intended audience.",
    "What research or references informed your approach, and how did you develop your own direction?",
    "Explain an important creative decision and an alternative you considered.",
    "How did feedback or testing change the work during the project?",
    "What was your contribution, how did you evaluate the outcome, and what would you improve?",
  ],
},
"Science and Research": {
  Technical: [
    "How would you turn a research question into a testable hypothesis?",
    "How would you choose a method and identify appropriate controls for a study?",
    "How would you check the quality and reliability of collected data?",
    "How would you document a procedure so another researcher could reproduce it?",
    "How would you explain a study's findings while acknowledging uncertainty and limitations?",
  ],
  Situational: [
    "Your results differ from what you expected. How would you investigate before drawing conclusions?",
    "You discover missing or inconsistent entries in a dataset. What would you do?",
    "A colleague suggests leaving out results that do not support the hypothesis. How would you respond?",
    "An equipment problem interrupts data collection. How would you assess its impact and decide what to do next?",
    "You are asked to use a procedure you have not been trained to perform. How would you proceed?",
  ],
},
"Healthcare and Allied Health": {
  Technical: [
    "What practices would you use to protect confidential patient or participant information?",
    "How would you document your work accurately and communicate relevant information to your team?",
    "How would you explain unfamiliar healthcare information to someone without a medical background?",
    "How would you recognize the limits of your role and determine when to ask for support?",
    "How would you evaluate whether a healthcare information source is reliable and relevant to your work?",
  ],
  Situational: [
    "A patient or participant is upset and feels their concerns are being ignored. How would you approach the conversation?",
    "You notice a discrepancy in a record you are using. How would you address it?",
    "Someone requests confidential information, but you are unsure whether they are authorized to receive it. What would you do?",
    "You receive competing requests from several team members. How would you clarify priorities?",
    "You are asked to complete a task outside your training or responsibilities. How would you respond?",
  ],
},
"Public Service, Law, and Social Services": {
  Technical: [
    "How would you find and evaluate information relevant to a policy, legal, or social-service issue?",
    "How would you distinguish documented facts from assumptions when preparing a report?",
    "How would you organize sensitive records while protecting confidentiality?",
    "How would you explain a complex process or requirement to someone unfamiliar with it?",
    "How would you identify the limits of your responsibilities and determine when to seek supervision?",
  ],
  Situational: [
    "A member of the public is frustrated by a process you cannot change yourself. How would you respond?",
    "You find conflicting information in records used to support a decision. What would you do?",
    "Someone asks you to share sensitive information without clear authorization. How would you handle it?",
    "You are asked to help with a matter where you have a personal connection. How would you address the potential conflict?",
    "Several people need assistance, and resources are limited. How would you clarify priorities and communicate next steps?",
  ],
},
};
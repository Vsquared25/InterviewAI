import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

type AnswerRecord = {
  question: string;
  answer: string;
};

type OpenAiOutputItem = {
  type?: string;
  content?: Array<{
    type?: string;
    text?: string;
  }>;
};

export default {
  fetch: withSupabase({ auth: "user" }, async (req) => {
    if (req.method !== "POST") {
      return Response.json(
        { error: "Method not allowed." },
        { status: 405 },
      );
    }

    try {
      const { role, company, mode, answers } = await req.json();

      if (
        typeof role !== "string" ||
        typeof company !== "string" ||
        typeof mode !== "string" ||
        !Array.isArray(answers)
      ) {
        return Response.json(
          { error: "Invalid feedback request." },
          { status: 400 },
        );
      }

      const completedAnswers = answers
        .filter(
          (item: AnswerRecord) =>
            typeof item.question === "string" &&
            typeof item.answer === "string" &&
            item.answer.trim().length > 0,
        )
        .slice(0, 5);

      if (completedAnswers.length === 0) {
        return Response.json(
          { error: "Add at least one response before requesting feedback." },
          { status: 400 },
        );
      }

      const transcript = completedAnswers
        .map(
          (item: AnswerRecord, index: number) =>
            `Question ${index + 1}: ${item.question}\nAnswer: ${item.answer}`,
        )
        .join("\n\n");

      const prompt = `
You are a supportive interview coach for a college student.

Review this ${mode} mock interview for a ${role} role at ${company}.
Give practical, specific feedback based only on the responses below.

Return plain text with these exact sections:
Overall impression
What worked well
Most important improvement
A stronger answer approach
One action for the next practice session

Keep the tone encouraging. Do not assign a score or make hiring claims.

Interview responses:
${transcript}
      `.trim();

      const openAiResponse = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
          },
          body: JSON.stringify({
            model: "gpt-5.4-nano",
            input: prompt,
            max_output_tokens: 700,
          }),
        },
      );

      if (!openAiResponse.ok) {
  const openAiError = await openAiResponse.text();

  console.error("OpenAI request failed:", openAiError);

  return Response.json(
    { error: "Feedback could not be generated right now." },
    { status: 502 },
  );
}

      const data = (await openAiResponse.json()) as {
  output?: OpenAiOutputItem[];
};

const feedback = (data.output ?? [])
  .flatMap((item) =>
    item.type === "message" ? item.content ?? [] : [],
  )
  .filter(
    (item) =>
      item.type === "output_text" && typeof item.text === "string",
  )
  .map((item) => item.text)
  .join("\n")
  .trim();

      if (typeof feedback !== "string" || !feedback.trim()) {
        return Response.json(
          { error: "Feedback could not be generated right now." },
          { status: 502 },
        );
      }

      return Response.json({ feedback });
    } catch (error) {
      console.error("Feedback function failed:", error);

      return Response.json(
        { error: "Feedback could not be generated right now." },
        { status: 500 },
      );
    }
  }),
};
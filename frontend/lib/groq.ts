import Groq from "groq-sdk";

// ============================================================
// Groq Client
// ============================================================

export function createGroqClient(apiKey: string): Groq {
  return new Groq({
    apiKey,
  });
}

// ============================================================
// Get Groq API Key
// ============================================================

export function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY;

  if (!key) {
    throw new Error("GROQ_API_KEY is not set");
  }

  return key;
}

// ============================================================
// Page Type
// ============================================================

type Page = {
  title: string;
  content: string;
  url: string;
};

// ============================================================
// Build Link Summary Prompt
// ============================================================

export function buildLinkSummaryPrompt(page: Page): string {
  // Keep the content short
  const content = page.content.slice(0, 4000);

  return `
Summarize this webpage in clear Markdown.

Rules:
- Use ## for section titles.
- Use short bullet lists under each section.
- Do not use raw ** labels alone as headings.
- Keep it easy to scan.

URL: ${page.url}

Title: ${page.title}

Content:
${content}
  `.trim();
}

// ============================================================
// Stream AI Response
// ============================================================

export async function streamAI(client: Groq, prompt: string) {
  return await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  });
}
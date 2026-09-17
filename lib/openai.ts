// import { OpenAI } from "openai";

// // ============================================================
// // OpenAI Client
// // ============================================================

// export function createOpenAIClient(apiKey: string): OpenAI {
//   return new OpenAI({
//     apiKey,
//   });
// }

// // ============================================================
// // Get OpenAI API Key
// // ============================================================

// export function getOpenAiApiKey(): string {
//   const key = process.env.OPENAI_API_KEY;

//   if (!key) {
//     throw new Error("OPENAI_API_KEY is not set");
//   }

//   return key;
// }

// // ============================================================
// // Page Type
// // ============================================================

// type Page = {
//   title: string;
//   content: string;
//   url: string;
// };

// // ============================================================
// // Build Link Summary Prompt
// // ============================================================

// export function buildLinkSummaryPrompt(page: Page): string {
//   // Keep the content short
//   const content = page.content.slice(0, 4000);

//   return `
// Summarize this webpage in clear Markdown.

// Rules:
// - Use ## for section titles.
// - Use short bullet lists under each section.
// - Do not use raw ** labels alone as headings.
// - Keep it easy to scan.

// URL: ${page.url}

// Title: ${page.title}

// Content:
// ${content}
//   `.trim();
// }

// // ============================================================
// // Stream AI Response
// // ============================================================

// export async function streamAI(client: OpenAI, prompt: string) {
//   return await client.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "user",
//         content: prompt,
//       },
//     ],
//     stream: true,
//   });
// }
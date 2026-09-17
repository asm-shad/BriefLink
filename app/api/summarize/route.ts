import {
  createGroqClient,
  getGroqApiKey,
  buildLinkSummaryPrompt,
  streamAI,
} from "@/lib/groq";

import { scrapeWebpage } from "@/lib/scraper";

/** Check if the text is a valid http/https URL */
function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

/** Turn the Groq stream into a plain text Response stream */
function createTextStream(
  aiStream: Awaited<ReturnType<typeof streamAI>>,
): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of aiStream) {
          const text = chunk.choices[0]?.delta?.content;

          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/** Scrape a URL and stream an AI summary back to the browser */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      url?: string;
    };

    const url = body.url?.trim() || "";

    // Validate URL
    if (!isValidUrl(url)) {
      return Response.json(
        {
          error: "Please provide a valid http or https URL.",
        },
        {
          status: 400,
        },
      );
    }

    // Scrape webpage
    const page = await scrapeWebpage(url);

    // Check if content was extracted
    if (!page.content) {
      return Response.json(
        {
          error: "Could not extract text from this page.",
        },
        {
          status: 422,
        },
      );
    }

    // Create Groq client using existing helpers
    const client = createGroqClient(getGroqApiKey());

    // Build summary prompt
    const prompt = buildLinkSummaryPrompt(page);

    // Stream AI response
    const aiStream = await streamAI(client, prompt);

    // Convert Groq stream to browser-readable stream
    const stream = createTextStream(aiStream);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to summarize page";

    return Response.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}
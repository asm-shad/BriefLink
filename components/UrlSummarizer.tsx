"use client";

import { useState } from "react";
import {
  AlertCircle,
  Link2,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { RichTextSummary } from "./rich-text-summary";

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

/** Return the status label shown next to the summary card */
function getStatusLabel(
  isLoading: boolean,
  hasSummary: boolean,
): string {
  if (isLoading && !hasSummary) return "Fetching page";
  if (isLoading) return "Streaming";
  if (hasSummary) return "Ready";

  return "Waiting";
}

/** Read a streaming response and call onChunk for each piece of text */
async function readStream(
  response: Response,
  onChunk: (text: string) => void,
): Promise<void> {
  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    onChunk(decoder.decode(value, { stream: true }));
  }

  // Flush any remaining decoder content
  const remaining = decoder.decode();

  if (remaining) {
    onChunk(remaining);
  }
}

/** Loading skeleton shown while waiting for the first AI text */
function SummarySkeleton() {
  return (
    <div
      className="space-y-4 py-1"
      aria-hidden="true"
    >
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-[78%]" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-[88%]" />
        <Skeleton className="h-4 w-[70%]" />
        <Skeleton className="h-4 w-[84%]" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[65%]" />
      </div>
    </div>
  );
}

/** Empty state before the user runs a summary */
function EmptySummary() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Sparkles className="size-4" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          Your brief will appear here
        </p>

        <p className="max-w-sm text-sm text-muted-foreground">
          Paste a URL above and Linkbrief will scrape the page, then stream a
          clear structured summary live.
        </p>
      </div>
    </div>
  );
}

export function UrlSummarizer() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isWaitingForText = isLoading && !summary;
  const statusLabel = getStatusLabel(
    isLoading,
    Boolean(summary),
  );

  /** Send the URL to the API and stream the AI summary */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSummary("");

    const trimmedUrl = url.trim();

    if (!isValidUrl(trimmedUrl)) {
      setError("Please paste a valid http or https URL.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: trimmedUrl,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(
          data?.error || "Something went wrong",
        );
      }

      await readStream(response, (chunk) => {
        setSummary((prev) => prev + chunk);
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Request failed";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="font-sans text-base">
            Summarize a page
          </CardTitle>

          <CardDescription>
            Drop in any public article, docs page, or blog post. We read it and
            return a concise brief.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="url">Page URL</Label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative w-full">
                  <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/article"
                    value={url}
                    onChange={(event) =>
                      setUrl(event.target.value)
                    }
                    disabled={isLoading}
                    className="h-11 bg-background/80 pl-9"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !url.trim()}
                  className="h-11 shrink-0 px-5"
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="animate-spin"
                        data-icon="inline-start"
                      />
                      Working...
                    </>
                  ) : (
                    <>
                      <Sparkles data-icon="inline-start" />
                      Generate brief
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertCircle />

                <AlertTitle>
                  Could not summarize
                </AlertTitle>

                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            ) : null}
          </form>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
        <CardHeader className="border-b border-border/60">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="font-sans text-base">
                Live brief
              </CardTitle>

              <CardDescription>
                Text streams in as soon as the model starts writing.
              </CardDescription>
            </div>

            <Badge
              variant={
                isLoading
                  ? "default"
                  : summary
                    ? "secondary"
                    : "outline"
              }
            >
              {isLoading ? (
                <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-primary-foreground" />
              ) : null}

              {statusLabel}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {isWaitingForText ? (
            <SummarySkeleton />
          ) : null}

          {!isWaitingForText && !summary ? (
            <EmptySummary />
          ) : null}

          {summary ? (
            <RichTextSummary
              text={summary}
              isStreaming={isLoading}
            />
          ) : null}
        </CardContent>
      </Card>

      <Separator className="opacity-60" />

      <p className="text-center text-xs text-muted-foreground">
        Linkbrief scrapes public pages and streams an AI summary. Use it for
        research, reading, and quick takeaways.
      </p>
    </div>
  );
}
"use client";

import ReactMarkdown from "react-markdown";

type RichTextSummaryProps = {
  text: string;
  isStreaming?: boolean;
};

/** Render markdown as clean rich text (bold, lists, headings) */
export function RichTextSummary({
  text,
  isStreaming = false,
}: RichTextSummaryProps) {
  return (
    <div
      className={[
        "rich-text min-h-48 text-[0.95rem] leading-7 text-foreground",
        isStreaming ? "streaming-cursor" : "",
      ].join(" ")}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h2 className="mb-3 mt-5 text-lg font-semibold first:mt-0">
              {children}
            </h2>
          ),

          h2: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-semibold first:mt-0">
              {children}
            </h3>
          ),

          h3: ({ children }) => (
            <h4 className="mb-2 mt-4 text-sm font-semibold first:mt-0">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="mb-4 last:mb-0">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1.5 pl-5 last:mb-0">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1.5 pl-5 last:mb-0">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-0.5 marker:text-muted-foreground">
              {children}
            </li>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold">
              {children}
            </strong>
          ),

          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
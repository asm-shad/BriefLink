import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UrlSummarizer } from "@/components/UrlSummarizer";

export default function Home() {
  return (
    <main className="app-shell">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 sm:px-6">
        {/* Navigation */}
        <nav className="animate-fade-up flex items-center justify-between py-5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              LB
            </span>

            <span className="text-sm font-semibold tracking-tight text-foreground">
              Linkbrief
            </span>

            <Badge variant="secondary" className="hidden sm:inline-flex">
              AI summaries
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            URL Brief in Seconds
          </p>
        </nav>

        <Separator className="opacity-50" />

        {/* Main Content */}
        <div className="flex flex-1 flex-col py-10 sm:py-14">
          {/* Header */}
          <header className="animate-fade-up mb-10 max-w-xl">
            <p className="font-heading text-5xl tracking-tight text-foreground sm:text-6xl">
              Linkbrief
            </p>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Paste any page URL and get a clear, structured brief streamed
              live as it&apos;s written.
            </p>
          </header>

          {/* URL Summarizer */}
          <div className="animate-fade-up-delay">
            <UrlSummarizer />
          </div>
        </div>
      </div>
    </main>
  );
}

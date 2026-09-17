import * as cheerio from "cheerio";

/** Scraped webpage data */
export type ScrapedPage = {
  title: string;
  content: string;
  links: string[];
  url: string;
};

/** Download HTML from a URL */
export async function downloadHtml(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download page: ${response.status} ${response.statusText}`,
    );
  }

  return await response.text();
}

/** Get the page title from HTML */
export function getPageTitle(html: string): string {
  const $ = cheerio.load(html);

  return $("title").first().text().trim();
}

/** Get clean text content from HTML */
export function getCleanText(html: string): string {
  const $ = cheerio.load(html);

  // Remove elements that usually don't contain useful page content
  $("script, style, noscript, iframe, svg").remove();

  return $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();
}

/** Get all links from the page */
export function extractLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);

  const links: string[] = [];

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    if (!href) {
      return;
    }

    try {
      // Convert relative URLs into absolute URLs
      const absoluteUrl = new URL(href, baseUrl).href;

      links.push(absoluteUrl);
    } catch {
      // Ignore invalid URLs
    }
  });

  return [...new Set(links)];
}

/** Scrape a webpage and return title, content, links, and URL */
export async function scrapeWebpage(url: string): Promise<ScrapedPage> {
  const html = await downloadHtml(url);

  return {
    title: getPageTitle(html),
    content: getCleanText(html),
    links: extractLinks(html, url),
    url,
  };
}
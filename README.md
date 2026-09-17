# Linkbrief

> **AI-powered URL summarizer that turns web pages into clear, structured briefs in seconds.**

Linkbrief lets you paste a public webpage URL and receive a concise, easy-to-read summary. The application scrapes the webpage, extracts useful text, sends it to a Groq-powered LLM, and streams the generated summary to the browser in real time.

---

## ✨ Features

* 🔗 **URL-based summarization**
* 🤖 **AI-powered summaries using Groq**
* ⚡ **Real-time streaming responses**
* 📝 **Markdown-formatted summaries**
* 🌐 **Webpage scraping with Cheerio**
* 🔍 **Automatic extraction of page title and content**
* 🔗 **Extraction of links from webpages**
* 🎨 **Clean and responsive UI**
* 🧩 **Reusable React components**
* 🔐 **Environment-based API key configuration**
* 🚀 **Next.js App Router API endpoint**

---

## 🖼️ How It Works

```text
User enters URL
       │
       ▼
Next.js Frontend
       │
       ▼
POST /api/summarize
       │
       ▼
Validate URL
       │
       ▼
Fetch webpage HTML
       │
       ▼
Cheerio extracts page content
       │
       ▼
Build AI summary prompt
       │
       ▼
Groq LLM
       │
       ▼
Stream response
       │
       ▼
React frontend
       │
       ▼
Live Markdown summary
```

---

## 🛠️ Tech Stack

### Frontend

* [Next.js](https://nextjs.org/)
* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.com/)
* [Lucide React](https://lucide.dev/)
* [React Markdown](https://github.com/remarkjs/react-markdown)

### Backend / API

* Next.js Route Handlers
* Node.js
* TypeScript
* Groq SDK

### Web Scraping

* [Cheerio](https://cheerio.js.org/)

### AI

* [Groq](https://groq.com/)
* Model: `openai/gpt-oss-120b`

---

## 📁 Project Structure

```text
linkbrief/
│
├── app/
│   ├── api/
│   │   └── summarize/
│   │       └── route.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   └── skeleton.tsx
│   │
│   ├── rich-text-summary.tsx
│   └── UrlSummarizer.tsx
│
├── lib/
│   ├── groq.ts
│   └── scrapper.ts
│
├── public/
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

> The exact structure may vary depending on additional files and shadcn/ui components in the project.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/linkbrief.git
cd linkbrief
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
```

You can obtain a Groq API key from the [Groq Console](https://console.groq.com/).

> **Important:** Never commit your `.env.local` file or expose your API key in client-side code.

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 🧠 How the Application Works

### 1. User submits a URL

The `UrlSummarizer` component accepts a URL from the user.

Before sending the request, the URL is checked to make sure it uses either:

```text
http://
```

or:

```text
https://
```

---

### 2. Frontend sends the request

The frontend sends a `POST` request to:

```text
/api/summarize
```

with:

```json
{
  "url": "https://example.com/article"
}
```

---

### 3. API validates the URL

The API route validates the URL before attempting to fetch the webpage.

Invalid URLs return:

```json
{
  "error": "Please provide a valid http or https URL."
}
```

with HTTP status:

```text
400
```

---

### 4. Webpage is scraped

The scraper downloads the webpage HTML using `fetch()`.

Cheerio then removes elements that normally don't contain useful text:

```text
script
style
noscript
iframe
svg
```

The remaining body text is cleaned and normalized.

For example:

```ts
$("body")
  .text()
  .replace(/\s+/g, " ")
  .trim();
```

---

### 5. AI prompt is created

The extracted webpage information is passed to the prompt builder.

The prompt instructs the model to:

* Use Markdown
* Use `##` for section headings
* Use short bullet lists
* Keep the summary easy to scan

The scraped content is currently limited to the first **4,000 characters** before being sent to the model.

---

### 6. Groq generates the summary

The application uses:

```text
openai/gpt-oss-120b
```

through the Groq SDK.

The response is requested as a stream:

```ts
stream: true
```

---

### 7. Response is streamed to the browser

The Next.js API converts the Groq stream into a standard Web `ReadableStream`.

The browser reads the stream chunk by chunk using:

```ts
response.body.getReader()
```

Each chunk is immediately appended to the existing summary.

This allows the user to see the answer being generated instead of waiting for the complete response.

---

## 🔄 Streaming Flow

```text
Groq
  │
  │ token/chunk
  ▼
Next.js API Route
  │
  │ ReadableStream
  ▼
Browser
  │
  │ chunk
  ▼
React State
  │
  ▼
ReactMarkdown
  │
  ▼
Live Summary
```

---

## 📡 API

### `POST /api/summarize`

Generate an AI summary from a public webpage.

#### Request

```http
POST /api/summarize
Content-Type: application/json
```

```json
{
  "url": "https://example.com/article"
}
```

#### Successful Response

The endpoint returns a streaming text response:

```text
## Overview

- Main point of the article
- Important information
- Key takeaway

## Key Points

- Point one
- Point two
- Point three
```

#### Invalid URL

```http
400 Bad Request
```

```json
{
  "error": "Please provide a valid http or https URL."
}
```

#### No Content Extracted

```http
422 Unprocessable Entity
```

```json
{
  "error": "Could not extract text from this page."
}
```

#### Server Error

```http
500 Internal Server Error
```

```json
{
  "error": "Failed to summarize page"
}
```

---

## 🧩 Core Components

### `UrlSummarizer`

Responsible for:

* URL input
* URL validation
* API request
* Streaming response handling
* Loading state
* Error handling
* Summary display

---

### `RichTextSummary`

Uses `react-markdown` to render the AI response as formatted Markdown.

Supported formatting includes:

* Headings
* Paragraphs
* Ordered lists
* Unordered lists
* Bold text
* Links

---

### `scrapper.ts`

Responsible for webpage extraction.

Main functions:

```ts
downloadHtml()
getPageTitle()
getCleanText()
extractLinks()
scrapeWebpage()
```

The main function returns:

```ts
type ScrapedPage = {
  title: string;
  content: string;
  links: string[];
  url: string;
};
```

---

### `groq.ts`

Contains the Groq-related functionality.

Main functions:

```ts
createGroqClient()
getGroqApiKey()
buildLinkSummaryPrompt()
streamAI()
```

This keeps the AI configuration separate from the API route.

---

## 🔐 Environment Variables

The project requires:

| Variable       | Required | Description                 |
| -------------- | -------- | --------------------------- |
| `GROQ_API_KEY` | Yes      | API key used to access Groq |

Example:

```env
GROQ_API_KEY=your_groq_api_key
```

Never use:

```env
NEXT_PUBLIC_GROQ_API_KEY=...
```

for the server API key.

---

## 📦 Frontend Dependencies

Important frontend dependencies include:

```json
{
  "next": "16.3.5",
  "react": "19.2.8",
  "react-dom": "19.2.8",
  "cheerio": "^1.2.0",
  "groq-sdk": "^1.6.0",
  "react-markdown": "^10.1.0",
  "lucide-react": "^1.46.0"
}
```

Install dependencies with:

```bash
npm install
```

---

## 🧪 Development

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

---

## ⚠️ Current Limitations

The current implementation intentionally keeps the architecture simple. Some limitations include:

* Only publicly accessible webpages can be scraped.
* Pages that require JavaScript rendering may not return their full content.
* Some websites may block automated requests.
* The extracted content is currently limited to 4,000 characters for summarization.
* Very large or complex webpages may not produce complete summaries.
* Authentication-protected pages are not supported.
* The application does not currently maintain a summary history.
* The scraper does not currently perform advanced content extraction or article detection.

---

## 🔮 Future Improvements

Possible improvements include:

* [ ] Better article/content extraction
* [ ] Support for JavaScript-rendered websites
* [ ] URL metadata extraction
* [ ] Summary history
* [ ] Copy summary button
* [ ] Download summary as Markdown/PDF
* [ ] Multiple summary lengths
* [ ] Multiple AI model options
* [ ] Authentication
* [ ] Database integration
* [ ] Rate limiting
* [ ] Request caching
* [ ] Better error handling for blocked websites
* [ ] Streaming cancellation
* [ ] SEO and Open Graph metadata
* [ ] Deployment configuration

---

## 🛡️ Security Considerations

Because the server fetches URLs provided by users, production deployments should consider **SSRF protection**.

Potential protections include:

* Blocking localhost addresses
* Blocking private IP ranges
* Blocking internal network addresses
* Restricting unsupported protocols
* Applying request timeouts
* Limiting response size
* Rate limiting API requests

The current URL validation only verifies that the URL uses `http` or `https`; it is **not a complete SSRF protection mechanism**.

---

## 📜 License

This project is currently distributed without a specified open-source license.

If you intend to make the repository open source, consider adding an appropriate license such as MIT.

---

## 👨‍💻 Author

**ASM Shad**

Built with:

* Next.js
* React
* TypeScript
* Cheerio
* Groq
* Tailwind CSS

---

## ⭐ Project Goal

Linkbrief is designed to make web reading faster by turning long webpages into concise, structured briefs that can be read at a glance.

> **Paste a link. Get the brief.**

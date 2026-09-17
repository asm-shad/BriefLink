# Linkbrief

**AI-powered URL summarizer that turns web pages into clear, structured briefs in seconds.**

Linkbrief is a full-stack Next.js application that lets users paste a public webpage URL and receive an AI-generated summary streamed live as it is being written.

🔗 **Live Demo:** https://brief-link-nine.vercel.app/

---

## ✨ Features

* 🔗 Summarize any public webpage using its URL
* 🤖 AI-powered summaries using Groq
* ⚡ Real-time streaming responses
* 📝 Markdown-formatted summaries
* 🎨 Clean and responsive UI
* 🔍 Extracts webpage content using Cheerio
* 🛡️ Keeps the Groq API key on the server
* ☁️ Deployed with Vercel
* 📱 Responsive design for desktop and mobile

---

## 🖥️ Live Demo

Try Linkbrief here:

**https://brief-link-nine.vercel.app/**

The application allows you to:

1. Paste a webpage URL.
2. Click **Generate brief**.
3. Linkbrief fetches and extracts the webpage content.
4. The content is sent to the Groq AI model.
5. The generated summary is streamed back to the browser.

---

## 🏗️ Architecture

Linkbrief is built as a **Next.js full-stack application**.

There is **no separate Express or Node.js backend**.

```text
┌─────────────────────────┐
│       Browser           │
│                         │
│   UrlSummarizer.tsx     │
└────────────┬────────────┘
             │
             │ POST /api/summarize
             ▼
┌─────────────────────────┐
│    Next.js Server       │
│                         │
│ app/api/summarize/      │
│ route.ts                │
└────────────┬────────────┘
             │
       ┌─────┴─────┐
       ▼           ▼
┌────────────┐ ┌────────────┐
│  Scraper   │ │    Groq    │
│  Cheerio   │ │     AI     │
└────────────┘ └────────────┘
       │           │
       └─────┬─────┘
             ▼
       Streaming Response
             │
             ▼
┌─────────────────────────┐
│       Browser           │
│                         │
│  Rich Text Summary      │
└─────────────────────────┘
```

### Why no separate backend?

Next.js provides server-side functionality through **Route Handlers**.

The file:

```text
app/api/summarize/route.ts
```

acts as the backend API for the application.

This allows the project to:

* Keep API keys private
* Scrape webpages server-side
* Communicate securely with Groq
* Stream AI responses
* Avoid maintaining a separate Express server
* Deploy the entire application as one project

---

## 🛠️ Tech Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide React**
* **React Markdown**

### Backend / Server-side

* **Next.js Route Handlers**
* **TypeScript**
* **Cheerio**
* **Groq SDK**

### AI

* **Groq**
* Model: `openai/gpt-oss-120b`

### Deployment

* **Vercel**

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
│   └── scraper.ts
│
├── public/
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔄 How It Works

### 1. User enters a URL

The user enters a public webpage URL in the Linkbrief interface.

Example:

```text
https://example.com/article
```

The frontend sends the URL to:

```text
POST /api/summarize
```

---

### 2. URL validation

The API checks that the URL uses either:

```text
http://
```

or:

```text
https://
```

Invalid URLs are rejected before processing.

---

### 3. Webpage scraping

The Next.js server downloads the webpage using `fetch()`.

Cheerio is then used to parse the HTML.

The scraper extracts:

* Page title
* Clean text content
* Links
* Original URL

Unnecessary elements such as:

```text
<script>
<style>
<noscript>
<iframe>
<svg>
```

are removed before extracting the page text.

---

### 4. Build the AI prompt

The extracted webpage content is passed to the prompt builder.

The prompt asks the AI to produce a clear Markdown summary with:

* Section headings
* Short bullet points
* Easy-to-scan content

---

### 5. Send content to Groq

The server creates a Groq client using the private API key.

The application uses:

```text
openai/gpt-oss-120b
```

through the Groq API.

---

### 6. Stream the response

Instead of waiting for the complete AI response, Linkbrief streams the generated text back to the browser.

```text
AI starts generating
        ↓
First chunk arrives
        ↓
Browser displays it
        ↓
Next chunk arrives
        ↓
Browser appends it
        ↓
...
        ↓
Complete summary
```

This makes the application feel much faster and more interactive.

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
```

### Important

Never commit `.env.local` or your API key to GitHub.

Make sure `.gitignore` contains:

```gitignore
.env*
```

For Vercel deployment, add the same environment variable through the Vercel project settings.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/linkbrief.git
```

Then:

```bash
cd linkbrief
```

---

### 2. Install dependencies

Using npm:

```bash
npm install
```

---

### 3. Configure environment variables

Create:

```text
.env.local
```

Add:

```env
GROQ_API_KEY=your_groq_api_key
```

---

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 📦 Main Dependencies

The project uses packages including:

```text
next
react
react-dom
cheerio
groq-sdk
react-markdown
lucide-react
tailwindcss
```

---

## 🧩 Core Components

### `app/page.tsx`

The main application page.

It provides:

* Navigation
* Application title
* Description
* URL summarizer interface

---

### `components/UrlSummarizer.tsx`

The main client-side component responsible for:

* URL input
* URL validation
* API requests
* Loading state
* Error handling
* Streaming response handling
* Summary display

---

### `components/rich-text-summary.tsx`

Responsible for rendering the AI response as Markdown.

It supports:

* Headings
* Paragraphs
* Ordered lists
* Unordered lists
* Bold text
* Links

---

### `app/api/summarize/route.ts`

This is the server-side API endpoint.

It handles the complete summarization pipeline:

```text
Receive URL
    ↓
Validate URL
    ↓
Scrape webpage
    ↓
Build prompt
    ↓
Call Groq
    ↓
Stream response
    ↓
Return to browser
```

---

### `lib/scraper.ts`

Responsible for extracting useful information from webpages using Cheerio.

Main functions include:

```text
downloadHtml()
getPageTitle()
getCleanText()
extractLinks()
scrapeWebpage()
```

---

### `lib/groq.ts`

Contains the Groq-related functionality.

It handles:

* Groq client creation
* API key retrieval
* Prompt creation
* AI streaming

---

## ⚡ Streaming Architecture

Linkbrief uses streaming at two levels.

### Server

Groq generates the response incrementally:

```text
Groq
 ↓
AI chunk
 ↓
Next.js Route Handler
```

### Client

The browser reads the response stream:

```text
Next.js
 ↓
ReadableStream
 ↓
Browser
 ↓
React state
 ↓
Rich text renderer
```

The summary therefore appears progressively instead of appearing only after the entire response has been generated.

---

## 🛡️ Security

The Groq API key is accessed only from server-side code:

```ts
process.env.GROQ_API_KEY
```

It is never exposed directly to the browser.

The frontend communicates with:

```text
/api/summarize
```

instead of calling Groq directly.

### SSRF Consideration

Because the application accepts arbitrary URLs and fetches them from the server, production deployments should consider **SSRF protection**.

Possible improvements include:

* Blocking private IP addresses
* Blocking localhost URLs
* Blocking internal network ranges
* Restricting allowed protocols
* Limiting response size
* Adding request timeouts
* Restricting redirects
* Rate limiting requests

These protections become especially important if the application is exposed publicly at scale.

---

## ⚠️ Current Limitations

Linkbrief currently focuses on public webpages.

Some pages may not work correctly when:

* Content requires JavaScript to render
* The website blocks automated requests
* The website requires authentication
* The content is behind a paywall
* The page has unusual HTML structure
* The website blocks Vercel/server-side requests

The quality of the summary also depends on the amount and quality of text extracted from the webpage.

---

## 🔮 Future Improvements

Potential improvements include:

* [ ] Better webpage content extraction
* [ ] SSRF protection
* [ ] Request rate limiting
* [ ] URL history
* [ ] User authentication
* [ ] Database integration
* [ ] Save summaries
* [ ] Copy summary button
* [ ] Download summary as Markdown/PDF
* [ ] Multiple AI model options
* [ ] Better handling of JavaScript-rendered websites
* [ ] Improved prompt customization
* [ ] Summary length controls
* [ ] Browser extension
* [ ] API access for external applications

---

## ☁️ Deployment

Linkbrief is deployed on **Vercel**.

Live application:

**https://brief-link-nine.vercel.app/**

Vercel handles the Next.js application deployment, including the server-side Route Handler used by the summarization API.

---

## 🎯 Project Goal

The goal of Linkbrief is simple:

> **Turn a long webpage into a useful brief without making the user read the entire page first.**

It combines webpage scraping, server-side AI processing, and streaming responses into a simple URL-to-summary workflow.

---

## 📄 License

This project is currently intended for learning and demonstration purposes.

If you publish the repository, you can add a specific open-source license such as MIT depending on how you want others to use the code.

---

## 👨‍💻 Author

**ASM Shad**

Built with:

* Next.js
* TypeScript
* Groq
* Cheerio
* React
* Tailwind CSS

---

⭐ If you find Linkbrief useful, consider giving the repository a star.

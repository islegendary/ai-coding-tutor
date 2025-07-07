# AI Coding Tutor

AI Coding Tutor is a lightweight programming tutor that runs entirely in the browser and communicates with ChatGPT‑4o through a small Node.js server.  It helps beginners explore several programming languages with guided tasks and real‑time feedback.

## Features

- Language selector supporting Python, JavaScript, TypeScript, Java, Kotlin, Rust, Go, C#, C++, Swift, PHP and Ruby
- Toggle between prompted lesson mode or free‑form exploration
- ChatGPT‑4o integration for contextual code examples and explanations
- Side panel feedback that highlights positives and suggests improvements
- Personalized learning goals with simple progress bars
- Health check endpoint at `/api/health`

The interface shows the chat on the left and a feedback / goal panel on the right.

## Getting Started

1. Install server dependencies:

   ```bash
   cd server && npm install
   ```

2. Create a `.env` file in the `server` folder and set your `OPENAI_API_KEY`.

3. Start the server (use `npm run dev` for hot reload during development):

   ```bash
   node index.js
   ```

4. Open `http://localhost:3000` in your browser to use the tutor.

The server serves the React client from the `client` folder and proxies chat requests to ChatGPT‑4o.

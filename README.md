# AI Coding Tutor

This project provides a simple programming tutor that runs entirely in the browser and communicates with ChatGPT‑4o through a small Node.js server. Beginners can explore Python, JavaScript and Rust with guided tasks and real‑time feedback.

## Features

- Language selector for Python, JavaScript and Rust
- Prompted or exploration modes so beginners receive suggestions
- ChatGPT‑4o integration for contextual code explanations
- Side panel feedback highlighting positive points and improvements
- Personalized learning goals with progress bars

The interface shows the chat on the left and a feedback/goal panel on the right.

## Getting Started

1. Install server dependencies:
   ```bash
   cd server && npm install
   ```
2. Set your `OPENAI_API_KEY` environment variable.
3. Start the server:
   ```bash
   node index.js
   ```
4. Open `http://localhost:3000` in your browser to use the tutor.

The server serves the React client from the `client` folder and proxies chat requests to ChatGPT‑4o.

# About This Project
## Programming Language Learning Tutor

This project is an **interactive programming language learning tutor** designed for real-time, conversational coding practice and skill-building. Unlike spoken language tutors, 
this system is built to **scaffold the learning journey from zero**, offering guided tasks, examples, and contextual feedback for users who may not know how to ask the right questions at the start.

---

## Key Features

### Core Functionality
- **Language Selector Dropdown:**  
  Supports Python, JavaScript, Kotlin, TypeScript, Rust, and more.
  
- **Conversation Modes:**  
  - **Prompted Mode (Default for Beginners):**  
    The tutor proactively asks whether the user wants:
    - Example code  
    - Guided tasks  
    - Answers to user-initiated questions  
  - **Exploration Mode (For Intermediate and Advanced Users):**  
    Free-form conversation with optional tutor prompts and scenario suggestions when the user stalls.

- **Real-Time ChatGPT-4o API Integration:**  
  Uses `window.chatgpt.complete` to generate:
  - Contextual code examples  
  - Debugging advice  
  - Syntax explanations in the selected language

---

### Dynamic Learning Feedback
- **Live Syntax, Logic, and Style Feedback:**  
  The system evaluates each user message for:
  - Syntax accuracy  
  - Logical correctness  
  - Best practices for the chosen language
  
- **Non-Interruptive Corrections:**  
  Feedback appears in a dedicated side panel to maintain conversation flow.

- **Error Tracking and Scaffolding:**  
  Tracks common mistakes and suggests corrections or hints based on recurring patterns.

---

### Personalized Learning Goals
- **Automatic Skill Assessment:**  
  The tutor identifies user proficiency based on:
  - Complexity of completed tasks  
  - Accuracy of user submissions
  
- **Dynamic Goal Setting:**  
  Automatically generates learning goals (e.g., "Master list comprehensions in Python") with user ability to add or modify goals.

- **Adaptive Conversations:**  
  Future conversation topics and coding exercises align with active learning goals.

---

### Progress Tracking
- **Visual Charts and Progress Bars:**  
  Tracks:
  - Syntax accuracy  
  - Debugging efficiency  
  - Vocabulary and concept growth  
  - Time spent in each language
  
- **Session Learning Journal:**  
  Summarizes:
  - Concepts learned  
  - Errors corrected  
  - Skill advancements over time

---

### UI Overview
- **Clean, Mobile-Responsive Design**
- **Clear Workspace Separation:**
  - Left Panel: Chat conversation
  - Right Panel: Feedback and progress visualization

- **Proficiency Indicators:**  
  Displays user’s skill level per language.

- **Mode Toggle:**
  - Casual Chat  
  - Structured Lessons

---

## Unique Design Consideration
Unlike spoken language tutors that assume the user knows how to ask questions, this system:
- **Actively scaffolds** with tutor-initiated prompts.
- **Guides task discovery** for users with no prior coding knowledge.
- Provides **contextual learning pathways** rather than free-form exploration alone.

---

## Future Extensions
- Multi-language code switching  
- Community-shared exercises  
- GitHub integration for code persistence and version tracking

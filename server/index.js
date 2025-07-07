require('dotenv').config({ override: true });

const express = require('express');
const OpenAI = require('openai');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

console.log('=== MIDDLEWARE SETUP ===');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, '..', 'client')));

console.log('=== OPENAI CLIENT INITIALIZATION ===');

// pull api key from .env
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ 
  apiKey: apiKey
});
console.log('API Key Raw:', process.env.OPENAI_API_KEY);

console.log('OpenAI client initialized');

// Define available models with extensive logging
const AVAILABLE_MODELS = [
  'chatgpt-4o-latest'
];

console.log('Available models to try:', AVAILABLE_MODELS);

// Programming languages configuration
const PROGRAMMING_LANGUAGES = {
  python: { 
    name: 'Python', 
    icon: '🐍', 
    color: 'bg-blue-100 text-blue-800',
    extension: '.py',
    difficulty: 'Beginner-friendly'
  },
  javascript: { 
    name: 'JavaScript', 
    icon: '🟨', 
    color: 'bg-yellow-100 text-yellow-800',
    extension: '.js',
    difficulty: 'Beginner-friendly'
  },
  typescript: { 
    name: 'TypeScript', 
    icon: '🔷', 
    color: 'bg-blue-100 text-blue-800',
    extension: '.ts',
    difficulty: 'Intermediate'
  },
  java: { 
    name: 'Java', 
    icon: '☕', 
    color: 'bg-orange-100 text-orange-800',
    extension: '.java',
    difficulty: 'Intermediate'
  },
  kotlin: { 
    name: 'Kotlin', 
    icon: '🎯', 
    color: 'bg-purple-100 text-purple-800',
    extension: '.kt',
    difficulty: 'Intermediate'
  },
  rust: { 
    name: 'Rust', 
    icon: '🦀', 
    color: 'bg-red-100 text-red-800',
    extension: '.rs',
    difficulty: 'Advanced'
  },
  golang: { 
    name: 'Go', 
    icon: '🐹', 
    color: 'bg-cyan-100 text-cyan-800',
    extension: '.go',
    difficulty: 'Intermediate'
  },
  csharp: { 
    name: 'C#', 
    icon: '💜', 
    color: 'bg-purple-100 text-purple-800',
    extension: '.cs',
    difficulty: 'Intermediate'
  },
  cpp: { 
    name: 'C++', 
    icon: '⚡', 
    color: 'bg-blue-100 text-blue-800',
    extension: '.cpp',
    difficulty: 'Advanced'
  },
  swift: { 
    name: 'Swift', 
    icon: '🦉', 
    color: 'bg-orange-100 text-orange-800',
    extension: '.swift',
    difficulty: 'Intermediate'
  },
  php: { 
    name: 'PHP', 
    icon: '🐘', 
    color: 'bg-indigo-100 text-indigo-800',
    extension: '.php',
    difficulty: 'Beginner-friendly'
  },
  ruby: { 
    name: 'Ruby', 
    icon: '💎', 
    color: 'bg-red-100 text-red-800',
    extension: '.rb',
    difficulty: 'Beginner-friendly'
  }
};

// Helper function to analyze proficiency level
const analyzeProficiencyLevel = (messageHistory, conceptsLearned = []) => {
  const messageCount = messageHistory.length;
  const conceptsCount = conceptsLearned.length;
  
  if (messageCount < 5 || conceptsCount < 5) return 'Beginner';
  if (messageCount < 15 || conceptsCount < 15) return 'Intermediate';
  if (messageCount < 30 || conceptsCount < 25) return 'Advanced';
  return 'Expert';
};

// Helper function to generate learning goals
const generateLearningGoals = (level, language) => {
  const goalsByLevel = {
    Beginner: {
      python: [
        'Learn Python syntax and basic data types',
        'Master print statements and input/output',
        'Understand variables and basic operations',
        'Practice with lists and dictionaries',
        'Write simple functions'
      ],
      javascript: [
        'Learn JavaScript syntax and variables',
        'Master DOM manipulation basics',
        'Understand functions and scope',
        'Practice with arrays and objects',
        'Learn event handling'
      ],
      java: [
        'Learn Java syntax and class structure',
        'Master variables and data types',
        'Understand methods and parameters',
        'Practice with arrays and loops',
        'Learn object-oriented basics'
      ],
      rust: [
        'Learn Rust syntax and ownership',
        'Master variables and mutability',
        'Understand structs and enums',
        'Practice with pattern matching',
        'Learn error handling basics'
      ]
    },
    Intermediate: {
      python: [
        'Master object-oriented programming',
        'Learn decorators and context managers',
        'Understand list comprehensions',
        'Practice with modules and packages',
        'Learn exception handling'
      ],
      javascript: [
        'Master async/await and promises',
        'Learn ES6+ features',
        'Understand closures and prototypes',
        'Practice with modern frameworks',
        'Learn testing fundamentals'
      ]
    },
    Advanced: {
      python: [
        'Master metaclasses and descriptors',
        'Learn performance optimization',
        'Understand concurrency patterns',
        'Practice with advanced libraries',
        'Learn design patterns'
      ]
    }
  };

  const goals = goalsByLevel[level]?.[language] || goalsByLevel.Beginner[language] || goalsByLevel.Beginner.python;
  return goals.slice(0, 3).map((text, index) => ({
    id: Date.now() + index,
    text,
    completed: false,
    progress: Math.floor(Math.random() * 30)
  }));
};

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  console.log('=== CHAT REQUEST RECEIVED ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { language, lesson, history, message, userProfile } = req.body;
    
    console.log('Extracted data:');
    console.log('- Language:', language);
    console.log('- Lesson mode:', lesson);
    console.log('- Message:', message);
    console.log('- History length:', history ? history.length : 0);
    console.log('- User profile:', userProfile);
    
    // Validate input
    if (!message || !message.trim()) {
      console.log('ERROR: Empty message received');
      return res.status(400).json({ 
        tutorResponse: "Please provide a message to continue." 
      });
    }

    console.log('=== CREATING ENHANCED PROMPT ===');

    const currentLang = PROGRAMMING_LANGUAGES[language] || PROGRAMMING_LANGUAGES.python;
    const detectedLevel = analyzeProficiencyLevel(history || [], userProfile?.conceptsLearned || []);
    const learningGoals = generateLearningGoals(detectedLevel, language);

    // Create a comprehensive prompt based on App-sample.js
    const systemPrompt = `You are an expert programming tutor specializing in ${currentLang.name}. You're helping someone learn programming concepts.

Current language: ${currentLang.name}
User's proficiency level: ${detectedLevel}
Learning goals: ${learningGoals.map(g => g.text).join(', ')}
Lesson mode: ${lesson}
Conversation history: ${JSON.stringify((history || []).slice(-5).map(m => ({ sender: m.sender, text: m.text })))}

Current user message: "${message}"

Respond with a JSON object in this exact format:
{
  "tutorResponse": "Your encouraging and educational response about ${currentLang.name}. ${lesson ? 'Focus on teaching specific concepts with examples.' : 'Keep the conversation natural and answer their questions.'} Be specific and practical.",
  "codeExample": "If relevant, provide a short code example in ${currentLang.name} (or null if not needed)",
  "explanation": "Brief explanation of the code example (or null if no code)",
  "feedback": {
    "positive": ["Positive aspects of their understanding or question"],
    "suggestions": ["Helpful suggestions for improvement or next steps"],
    "concepts": ["Key programming concepts mentioned or should be learned"]
  },
  "skillAnalysis": {
    "accuracy": 100,
    "detectedLevel": "${detectedLevel}",
    "strengths": ["Areas they understand well"],
    "improvements": ["Areas to focus on next"]
  },
  "conceptsUsed": ["programming", "concepts", "they", "mentioned"],
  "progressNotes": "Brief encouraging note about their programming progress",
  "nextSteps": "Suggestion for what to learn or practice next"
}

Your entire response MUST be valid JSON only. DO NOT include any text outside the JSON structure.`;

    console.log('System prompt length:', systemPrompt.length);

    console.log('=== TRYING MODELS ===');

    // Try different models in order
    let completion;
    let modelUsed = '';
    let lastError = null;
    
    for (const model of AVAILABLE_MODELS) {
      try {
        console.log(`\n--- Trying model: ${model} ---`);
        
        const requestPayload = {
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message.trim() }
          ],
          temperature: 0.7,
          max_tokens: 1500
        };
        
        console.log('Request payload:', JSON.stringify(requestPayload, null, 2));
        
        completion = await openai.chat.completions.create(requestPayload);
        
        modelUsed = model;
        console.log(`✅ SUCCESS: Successfully used model: ${model}`);
        break;
        
      } catch (modelError) {
        lastError = modelError;
        console.log(`❌ FAILED: Model ${model} failed:`);
        console.log('  - Error message:', modelError.message);
        console.log('  - Error code:', modelError.code);
        console.log('  - Error status:', modelError.status);
        
        if (model === AVAILABLE_MODELS[AVAILABLE_MODELS.length - 1]) {
          console.log('  - This was the last model, throwing error');
          throw modelError;
        } else {
          console.log('  - Continuing to next model');
          continue;
        }
      }
    }

    if (!completion) {
      console.log('❌ ERROR: No completion received from any model');
      throw new Error('No available models found');
    }

    console.log('=== PROCESSING RESPONSE ===');
    console.log(`Model used: ${modelUsed}`);
    
    const content = completion.choices[0].message.content;
    console.log('Raw response length:', content.length);
    console.log('Raw response preview:', content.substring(0, 200) + '...');
    
    // Try to parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
      console.log('✅ SUCCESS: Parsed JSON response');
      console.log('Response keys:', Object.keys(parsedResponse));
    } catch (parseError) {
      console.log('❌ WARNING: Failed to parse AI response as JSON');
      console.log('Parse error:', parseError.message);
      console.log('Raw content:', content);
      
      // Fallback response with enhanced structure
      parsedResponse = {
        tutorResponse: content,
        codeExample: null,
        explanation: null,
        feedback: {
          positive: ["Good question!"],
          suggestions: ["Keep practicing and asking questions"],
          concepts: ["general programming"]
        },
        skillAnalysis: {
          accuracy: 75,
          detectedLevel: detectedLevel,
          strengths: ["Curiosity and willingness to learn"],
          improvements: ["Continue with hands-on practice"]
        },
        conceptsUsed: ["general programming"],
        progressNotes: "You're making great progress! Keep up the good work.",
        nextSteps: "Try writing some code examples and experiment with what you've learned."
      };
      console.log('Using enhanced fallback response');
    }

    console.log('=== SENDING RESPONSE ===');
    console.log('Final response:', JSON.stringify(parsedResponse, null, 2));
    
    res.json(parsedResponse);

  } catch (error) {
    console.log('=== ERROR HANDLING ===');
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    console.log('Error status:', error.status);
    console.log('Full error:', error);
    
    // Provide specific error messages
    if (error.code === 'model_not_found' || error.message.includes('does not have access to model')) {
      console.log('Sending model not found error response');
      res.status(500).json({ 
        tutorResponse: "Sorry, the AI model is currently unavailable. Please try again later." 
      });
    } else if (error.status === 429) {
      console.log('Sending rate limit error response');
      res.status(429).json({ 
        tutorResponse: "Too many requests. Please wait a moment and try again." 
      });
    } else if (error.status === 401) {
      console.log('Sending authentication error response');
      res.status(401).json({ 
        tutorResponse: "Authentication error. Please check your API configuration." 
      });
    } else {
      console.log('Sending generic error response');
      res.status(500).json({ 
        tutorResponse: "Sorry, I'm having trouble responding right now. Please try again." 
      });
    }
  }
});

// Get learning goals endpoint
app.get('/api/learning-goals/:language/:level', (req, res) => {
  const { language, level } = req.params;
  const goals = generateLearningGoals(level, language);
  res.json({ goals });
});

// Get programming languages endpoint
app.get('/api/languages', (req, res) => {
  res.json(PROGRAMMING_LANGUAGES);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    openaiKeyExists: !!process.env.OPENAI_API_KEY
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.log('=== UNHANDLED ERROR ===');
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    tutorResponse: "An unexpected error occurred. Please try again." 
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('=== SERVER STARTED ===');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Application: http://localhost:${PORT}`);
  console.log('=== READY TO RECEIVE REQUESTS ===');
});

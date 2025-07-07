import React, { useState, useEffect, useRef } from 'react';
import { Send, Code, Target, TrendingUp, MessageSquare, Settings, CheckCircle, AlertCircle, Star, BarChart3, Play, Book, Lightbulb, Terminal } from 'lucide-react';

const ProgrammingTutor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    proficiencyLevel: 'Beginner',
    totalMessages: 0,
    conceptsLearned: new Set(),
    codeAccuracy: 0,
    sessionCount: 0,
    streakDays: 0
  });
  const [learningGoals, setLearningGoals] = useState([
    { id: 1, text: 'Learn basic syntax and variables', completed: false, progress: 25 },
    { id: 2, text: 'Master control structures (if/else, loops)', completed: false, progress: 10 },
    { id: 3, text: 'Understand functions and scope', completed: false, progress: 5 }
  ]);
  const [feedback, setFeedback] = useState(null);
  const [showLessonMode, setShowLessonMode] = useState(false);
  const [codeExamples, setCodeExamples] = useState([]);
  const [progressStats, setProgressStats] = useState({
    conceptsLearned: [5, 12, 18, 25, 34],
    codeAccuracy: [60, 68, 75, 82, 88],
    problemsSolved: [2, 5, 8, 12, 18]
  });
  const messagesEndRef = useRef(null);

  const programmingLanguages = {
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Generate initial learning goals based on selected language
    const newGoals = generateLearningGoals(userProfile.proficiencyLevel, selectedLanguage);
    setLearningGoals(newGoals);
  }, [selectedLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getProficiencyColor = (level) => {
    const colors = {
      'Beginner': 'text-green-600 bg-green-100',
      'Intermediate': 'text-yellow-600 bg-yellow-100',
      'Advanced': 'text-red-600 bg-red-100',
      'Expert': 'text-purple-600 bg-purple-100'
    };
    return colors[level] || colors.Beginner;
  };

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

  const analyzeProficiencyLevel = (messageHistory) => {
    const messageCount = messageHistory.length;
    const conceptsUsed = userProfile.conceptsLearned.size;
    
    if (messageCount < 5 || conceptsUsed < 5) return 'Beginner';
    if (messageCount < 15 || conceptsUsed < 15) return 'Intermediate';
    if (messageCount < 30 || conceptsUsed < 25) return 'Advanced';
    return 'Expert';
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage];
      const detectedLevel = analyzeProficiencyLevel(conversationHistory);
      const currentLang = programmingLanguages[selectedLanguage];
      
      const prompt = `
You are an expert programming tutor specializing in ${currentLang.name}. You're helping someone learn programming concepts.

Current language: ${currentLang.name}
User's proficiency level: ${detectedLevel}
Learning goals: ${learningGoals.map(g => g.text).join(', ')}
Lesson mode: ${showLessonMode}
Conversation history: ${JSON.stringify(conversationHistory.slice(-5).map(m => ({ sender: m.sender, text: m.text })))}

Current user message: "${currentMessage}"

Respond with a JSON object in this exact format:
{
  "tutorResponse": "Your encouraging and educational response about ${currentLang.name}. ${showLessonMode ? 'Focus on teaching specific concepts with examples.' : 'Keep the conversation natural and answer their questions.'} Be specific and practical.",
  "codeExample": "If relevant, provide a short code example in ${currentLang.name} (or null if not needed)",
  "explanation": "Brief explanation of the code example (or null if no code)",
  "feedback": {
    "positive": ["Positive aspects of their understanding or question"],
    "suggestions": ["Helpful suggestions for improvement or next steps"],
    "concepts": ["Key programming concepts mentioned or should be learned"]
  },
  "skillAnalysis": {
    "accuracy": 85,
    "detectedLevel": "${detectedLevel}",
    "strengths": ["Areas they understand well"],
    "improvements": ["Areas to focus on next"]
  },
  "conceptsUsed": ["programming", "concepts", "they", "mentioned"],
  "progressNotes": "Brief encouraging note about their programming progress",
  "nextSteps": "Suggestion for what to learn or practice next"
}

Your entire response MUST be valid JSON only. DO NOT include any text outside the JSON structure.
`;

      const response = await window.claude.complete(prompt);
      const parsedResponse = JSON.parse(response);

      const tutorMessage = {
        id: Date.now() + 1,
        text: parsedResponse.tutorResponse,
        sender: 'tutor',
        timestamp: new Date(),
        type: 'text',
        codeExample: parsedResponse.codeExample,
        explanation: parsedResponse.explanation
      };

      setMessages(prev => [...prev, tutorMessage]);
      setFeedback(parsedResponse.feedback);

      // Add code example as separate message if provided
      if (parsedResponse.codeExample) {
        const codeMessage = {
          id: Date.now() + 2,
          text: parsedResponse.codeExample,
          sender: 'tutor',
          timestamp: new Date(),
          type: 'code',
          language: selectedLanguage,
          explanation: parsedResponse.explanation
        };
        setMessages(prev => [...prev, codeMessage]);
      }

      // Update user profile
      setUserProfile(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 1,
        proficiencyLevel: parsedResponse.skillAnalysis.detectedLevel,
        codeAccuracy: parsedResponse.skillAnalysis.accuracy,
        conceptsLearned: new Set([...prev.conceptsLearned, ...parsedResponse.conceptsUsed])
      }));

      // Update progress stats
      if (userProfile.totalMessages % 5 === 0) {
        setProgressStats(prev => ({
          conceptsLearned: [...prev.conceptsLearned, userProfile.conceptsLearned.size],
          codeAccuracy: [...prev.codeAccuracy, parsedResponse.skillAnalysis.accuracy],
          problemsSolved: [...prev.problemsSolved, Math.floor(userProfile.totalMessages / 3)]
        }));
      }

    } catch (error) {
      console.error('Error getting tutor response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble responding right now. Let's keep coding! Try asking about specific programming concepts or code examples.",
        sender: 'tutor',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    setMessages([]);
    setFeedback(null);
    setCodeExamples([]);
    const newGoals = generateLearningGoals(userProfile.proficiencyLevel, newLang);
    setLearningGoals(newGoals);
  };

  const toggleGoalCompletion = (goalId) => {
    setLearningGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, completed: !goal.completed, progress: goal.completed ? goal.progress : 100 }
          : goal
      )
    );
  };

  const addCustomGoal = () => {
    const goalText = prompt('Enter your learning goal:');
    if (goalText?.trim()) {
      const newGoal = {
        id: Date.now(),
        text: goalText.trim(),
        completed: false,
        progress: 0
      };
      setLearningGoals(prev => [...prev, newGoal]);
    }
  };

  const formatCode = (code, language) => {
    // Basic syntax highlighting simulation
    return code;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-800">Programming Tutor</h1>
              </div>
              
              <select 
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(programmingLanguages).map(([code, lang]) => (
                  <option key={code} value={code}>
                    {lang.icon} {lang.name}
                  </option>
                ))}
              </select>

              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getProficiencyColor(userProfile.proficiencyLevel)}`}>
                {userProfile.proficiencyLevel}
              </div>

              <div className={`px-2 py-1 rounded text-xs font-medium ${programmingLanguages[selectedLanguage].color}`}>
                {programmingLanguages[selectedLanguage].difficulty}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowLessonMode(!showLessonMode)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  showLessonMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showLessonMode ? (
                  <>
                    <Book className="h-4 w-4 mr-1 inline" />
                    Lesson Mode
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-1 inline" />
                    Chat Mode
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">{programmingLanguages[selectedLanguage].icon}</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Ready to learn {programmingLanguages[selectedLanguage].name}?
              </h2>
              <p className="text-gray-500 mb-4">
                Start by asking questions about programming concepts, requesting code examples, or sharing your code for review!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button 
                  onClick={() => setCurrentMessage("How do I write a hello world program?")}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  Hello World
                </button>
                <button 
                  onClick={() => setCurrentMessage("Explain variables and data types")}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                >
                  Variables
                </button>
                <button 
                  onClick={() => setCurrentMessage("Show me how to write a function")}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                >
                  Functions
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : message.type === 'code' 
                    ? 'bg-gray-900 text-green-400 font-mono' 
                    : 'bg-white border border-gray-200 text-gray-800'
              } px-4 py-2 rounded-lg relative`}>
                
                {message.type === 'code' ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 uppercase">
                        {programmingLanguages[message.language]?.name || 'Code'}
                      </span>
                      <Terminal className="h-3 w-3 text-gray-400" />
                    </div>
                    <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                      {message.text}
                    </pre>
                    {message.explanation && (
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <p className="text-xs text-gray-300">{message.explanation}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    {message.codeExample && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-gray-800 font-mono text-sm">
                        <pre>{message.codeExample}</pre>
                      </div>
                    )}
                  </div>
                )}
                
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' 
                    ? 'text-blue-100' 
                    : message.type === 'code' 
                      ? 'text-gray-500' 
                      : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-500">Tutor is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Ask about ${programmingLanguages[selectedLanguage].name}, request code examples, or share your code...`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !currentMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Progress Overview */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Progress Overview
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Messages:</span>
              <span className="font-medium">{userProfile.totalMessages}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Concepts:</span>
              <span className="font-medium">{userProfile.conceptsLearned.size} learned</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Code Accuracy:</span>
              <span className="font-medium">{userProfile.codeAccuracy}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Streak:</span>
              <span className="font-medium">{userProfile.streakDays} days</span>
            </div>
          </div>
        </div>

        {/* Learning Goals */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Learning Goals
            </h3>
            <button
              onClick={addCustomGoal}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {learningGoals.map((goal) => (
              <div key={goal.id} className="p-2 bg-gray-50 rounded-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {goal.text}
                    </p>
                    <div className="mt-1">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleGoalCompletion(goal.id)}
                    className="ml-2 mt-1"
                  >
                    {goal.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Feedback */}
        {feedback && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Feedback
            </h3>
            {feedback.positive.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-green-600 mb-1">Great job!</p>
                {feedback.positive.map((item, idx) => (
                  <p key={idx} className="text-sm text-green-700 bg-green-50 p-2 rounded mb-1">
                    {item}
                  </p>
                ))}
              </div>
            )}
            {feedback.suggestions.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-blue-600 mb-1">Suggestions:</p>
                {feedback.suggestions.map((item, idx) => (
                  <p key={idx} className="text-sm text-blue-700 bg-blue-50 p-2 rounded mb-1">
                    {item}
                  </p>
                ))}
              </div>
            )}
            {feedback.concepts.length > 0 && (
              <div>
                <p className="text-xs font-medium text-purple-600 mb-1">Key Concepts:</p>
                <div className="flex flex-wrap gap-1">
                  {feedback.concepts.map((concept, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Learning Stats */}
        <div className="flex-1 p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Learning Stats
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Concepts Learned</p>
              <div className="flex items-end space-x-1 h-8">
                {progressStats.conceptsLearned.slice(-5).map((value, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-600 rounded-t"
                    style={{ height: `${(value / 40) * 100}%`, width: '20%' }}
                  ></div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Code Accuracy</p>
              <div className="flex items-end space-x-1 h-8">
                {progressStats.codeAccuracy.slice(-5).map((value, idx) => (
                  <div
                    key={idx}
                    className="bg-green-600 rounded-t"
                    style={{ height: `${value}%`, width: '20%' }}
                  ></div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Problems Solved</p>
              <div className="flex items-end space-x-1 h-8">
                {progressStats.problemsSolved.slice(-5).map((value, idx) => (
                  <div
                    key={idx}
                    className="bg-purple-600 rounded-t"
                    style={{ height: `${(value / 20) * 100}%`, width: '20%' }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgrammingTutor;

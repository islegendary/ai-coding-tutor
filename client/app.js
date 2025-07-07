const { useState, useEffect, useRef, useCallback } = React;

function ProgrammingTutor() {
  // Enhanced state management
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLessonMode, setShowLessonMode] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [learningGoals, setLearningGoals] = useState([]);
  const [error, setError] = useState(null);
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    proficiencyLevel: 'Beginner',
    totalMessages: 0,
    conceptsLearned: new Set(),
    codeAccuracy: 0,
    sessionCount: 1,
    streakDays: 0
  });
  
  // Progress statistics - start with empty arrays for real data
  const [progressStats, setProgressStats] = useState({
    conceptsLearned: [0],
    codeAccuracy: [0],
    problemsSolved: [0]
  });
  
  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Enhanced programming languages configuration
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

  // Learning goals configuration
  const LEARNING_GOALS_CONFIG = {
    python: [
      { id: 1, text: 'Learn basic syntax', progress: 0, completed: false },
      { id: 2, text: 'Understand functions', progress: 0, completed: false },
      { id: 3, text: 'Explore list comprehensions', progress: 0, completed: false },
      { id: 4, text: 'Work with classes and objects', progress: 0, completed: false }
    ],
    javascript: [
      { id: 1, text: 'Learn variables and types', progress: 0, completed: false },
      { id: 2, text: 'Understand DOM basics', progress: 0, completed: false },
      { id: 3, text: 'Use async/await', progress: 0, completed: false },
      { id: 4, text: 'Master ES6+ features', progress: 0, completed: false }
    ],
    rust: [
      { id: 1, text: 'Master ownership rules', progress: 0, completed: false },
      { id: 2, text: 'Use structs and enums', progress: 0, completed: false },
      { id: 3, text: 'Handle errors with Result', progress: 0, completed: false },
      { id: 4, text: 'Understand lifetimes', progress: 0, completed: false }
    ]
  };

  // Effects
  useEffect(() => {
    setFeedback(null);
    setError(null);
    // Reset progress when changing languages
    setUserProfile(prev => ({
      ...prev,
      totalMessages: 0,
      conceptsLearned: new Set(),
      codeAccuracy: 0
    }));
    setProgressStats({
      conceptsLearned: [0],
      codeAccuracy: [0],
      problemsSolved: [0]
    });
    // Initialize learning goals
    const initialGoals = [
      { id: 1, text: 'Learn basic syntax', progress: 0, completed: false },
      { id: 2, text: 'Understand variables', progress: 0, completed: false },
      { id: 3, text: 'Write simple functions', progress: 0, completed: false }
    ];
    setLearningGoals(initialGoals);
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Helper functions
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const getProficiencyColor = (level) => {
    const colors = {
      'Beginner': 'text-green-600 bg-green-100',
      'Intermediate': 'text-yellow-600 bg-yellow-100',
      'Advanced': 'text-red-600 bg-red-100',
      'Expert': 'text-purple-600 bg-purple-100'
    };
    return colors[level] || colors.Beginner;
  };

  const updateLearningProgress = useCallback((concepts) => {
    if (!concepts || !Array.isArray(concepts)) return;
    
    setLearningGoals(prev => prev.map(goal => {
      const conceptMatch = concepts.some(concept => 
        goal.text.toLowerCase().includes(concept.toLowerCase())
      );
      if (conceptMatch && goal.progress < 100) {
        return { ...goal, progress: Math.min(goal.progress + 25, 100) };
      }
      return goal;
    }));
  }, []);

  // API functions
  const sendMessage = useCallback(async () => {
    const message = currentMessage.trim();
    if (!message || isLoading) return;

    const userMsg = { 
      id: Date.now(), 
      sender: 'user', 
      text: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: selectedLanguage,
          lesson: showLessonMode,
          history: messages.slice(-5),
          message: message,
          userProfile: {
            ...userProfile,
            conceptsLearned: Array.from(userProfile.conceptsLearned)
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.tutorResponse) {
        const tutorMsg = {
          id: Date.now() + 1,
          sender: 'tutor',
          text: data.tutorResponse,
          codeExample: data.codeExample,
          explanation: data.explanation,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, tutorMsg]);
        setFeedback(data.feedback);
        
        // Update user profile with enhanced data
        if (data.skillAnalysis) {
          setUserProfile(prev => {
            const newConcepts = new Set([].concat(Array.from(prev.conceptsLearned), data.conceptsUsed || []));
            return {
              ...prev,
              totalMessages: prev.totalMessages + 1,
              proficiencyLevel: data.skillAnalysis.detectedLevel,
              codeAccuracy: data.skillAnalysis.accuracy,
              conceptsLearned: newConcepts
            };
          });
        }
        
        // Update learning progress based on concepts
        if (data.feedback && data.feedback.concepts) {
          updateLearningProgress(data.feedback.concepts);
        }

        // Update progress stats with real data
        setProgressStats(prev => {
          const newConceptsLearned = [...prev.conceptsLearned];
          const newCodeAccuracy = [...prev.codeAccuracy];
          const newProblemsSolved = [...prev.problemsSolved];
          
          // Add new data point every few messages
          if (userProfile.totalMessages % 3 === 0) {
            newConceptsLearned.push(userProfile.conceptsLearned.size);
            newCodeAccuracy.push((data.skillAnalysis && data.skillAnalysis.accuracy) || 75);
            newProblemsSolved.push(Math.floor(userProfile.totalMessages / 2));
            
            // Keep only last 10 data points
            if (newConceptsLearned.length > 10) {
              newConceptsLearned.shift();
              newCodeAccuracy.shift();
              newProblemsSolved.shift();
            }
          }
          
          return {
            conceptsLearned: newConceptsLearned,
            codeAccuracy: newCodeAccuracy,
            problemsSolved: newProblemsSolved
          };
        });
      } else {
        throw new Error('Invalid response format');
      }

    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);
      
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'tutor',
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [currentMessage, isLoading, selectedLanguage, showLessonMode, messages, userProfile, updateLearningProgress]);

  // Event handlers
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const handleLanguageChange = useCallback((e) => {
    setSelectedLanguage(e.target.value);
    setMessages([]);
    setFeedback(null);
  }, []);

  const handleModeToggle = useCallback(() => {
    setShowLessonMode(prev => !prev);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setFeedback(null);
    setError(null);
  }, []);

  const toggleGoalCompletion = useCallback((goalId) => {
    setLearningGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, completed: !goal.completed, progress: goal.completed ? goal.progress : 100 }
          : goal
      )
    );
  }, []);

  const addCustomGoal = useCallback(() => {
    const goalText = prompt('Enter your learning goal:');
    if (goalText && goalText.trim()) {
      const newGoal = {
        id: Date.now(),
        text: goalText.trim(),
        completed: false,
        progress: 0
      };
      setLearningGoals(prev => [...prev, newGoal]);
    }
  }, []);

  // Calculate streak days based on message count (simplified)
  const calculateStreakDays = useCallback((totalMessages) => {
    // Simple calculation: every 5 messages = 1 day of learning
    return Math.floor(totalMessages / 5);
  }, []);

  // Render helpers
  const renderMessage = (message) => (
    <div key={message.id} className="message-container">
      <div className={`message ${message.sender}`}>
        <div className="message-content">
          <pre className="message-text">{message.text}</pre>
          {message.codeExample && (
            <div className="code-example-container">
              <div className="code-header">
                <span className="code-language">{(PROGRAMMING_LANGUAGES[selectedLanguage] && PROGRAMMING_LANGUAGES[selectedLanguage].name) || 'Code'}</span>
                <span className="code-icon">💻</span>
              </div>
              <pre className="code-example">{message.codeExample}</pre>
              {message.explanation && (
                <div className="code-explanation">
                  <p>{message.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="message-timestamp">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );

  const renderLearningGoal = (goal) => (
    <div key={goal.id} className="learning-goal">
      <div className="goal-content">
        <p className={`goal-text ${goal.completed ? 'completed' : ''}`}>{goal.text}</p>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <span className="progress-text">{goal.progress}%</span>
        </div>
      </div>
      <button
        onClick={() => toggleGoalCompletion(goal.id)}
        className="goal-toggle"
      >
        {goal.completed ? '✓' : '○'}
      </button>
    </div>
  );

  return (
    <div className="app-container">
      <div className="main-content">
        <header className="app-header">
          <div className="header-left">
            <h1>💻 Programming Tutor</h1>
            <select 
              value={selectedLanguage} 
              onChange={handleLanguageChange}
              className="language-select"
            >
              {Object.entries(PROGRAMMING_LANGUAGES).map(([code, lang]) => (
                <option key={code} value={code}>
                  {lang.icon} {lang.name}
                </option>
              ))}
            </select>
            <div className={`proficiency-badge ${getProficiencyColor(userProfile.proficiencyLevel)}`}>
              {userProfile.proficiencyLevel}
            </div>
            <div className={`difficulty-badge ${PROGRAMMING_LANGUAGES[selectedLanguage].color}`}>
              {PROGRAMMING_LANGUAGES[selectedLanguage].difficulty}
            </div>
          </div>
          <div className="header-right">
            <button 
              onClick={handleModeToggle} 
              className={`mode-toggle ${showLessonMode ? 'active' : ''}`}
            >
              {showLessonMode ? '📚 Lesson Mode' : '💬 Chat Mode'}
            </button>
            <button 
              onClick={clearChat} 
              className="clear-chat"
              title="Clear conversation"
            >
              🗑️
            </button>
          </div>
        </header>

        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-icon">{PROGRAMMING_LANGUAGES[selectedLanguage].icon}</div>
              <h2>Ready to learn {PROGRAMMING_LANGUAGES[selectedLanguage].name}?</h2>
              <p>Start by asking questions about programming concepts, requesting code examples, or sharing your code for review!</p>
              <div className="quick-actions">
                <button 
                  onClick={() => setCurrentMessage("How do I write a hello world program?")}
                  className="quick-action-btn"
                >
                  Hello World
                </button>
                <button 
                  onClick={() => setCurrentMessage("Explain variables and data types")}
                  className="quick-action-btn"
                >
                  Variables
                </button>
                <button 
                  onClick={() => setCurrentMessage("Show me how to write a function")}
                  className="quick-action-btn"
                >
                  Functions
                </button>
              </div>
            </div>
          )}
          
          {messages.map(renderMessage)}
          
          {isLoading && (
            <div className="loading-message">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Tutor is thinking...</p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <input
            ref={inputRef}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask about ${PROGRAMMING_LANGUAGES[selectedLanguage].name}, request code examples, or share your code...`}
            className="message-input"
            disabled={isLoading}
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoading || !currentMessage.trim()}
            className="send-button"
          >
            ➤
          </button>
        </div>
      </div>

      <aside className="sidebar">
        <div className="progress-overview">
          <h3>📊 Progress Overview</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Messages:</span>
              <span className="stat-value">{userProfile.totalMessages}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Concepts:</span>
              <span className="stat-value">{userProfile.conceptsLearned.size} learned</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Accuracy:</span>
              <span className="stat-value">{userProfile.codeAccuracy}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Streak:</span>
              <span className="stat-value">{calculateStreakDays(userProfile.totalMessages)} days</span>
            </div>
          </div>
        </div>

        <div className="learning-goals-section">
          <div className="goals-header">
            <h3>🎯 Learning Goals</h3>
            <button onClick={addCustomGoal} className="add-goal-btn">+ Add</button>
          </div>
          {learningGoals.map(renderLearningGoal)}
        </div>

        {feedback && (
          <div className="feedback-section">
            <h3>💡 Feedback</h3>
            {feedback.positive && feedback.positive.length > 0 && (
              <div className="feedback-positive">
                <h4>Great job! 👍</h4>
                {feedback.positive.map((point, i) => (
                  <p key={i} className="positive-point">{point}</p>
                ))}
              </div>
            )}
            
            {feedback.suggestions && feedback.suggestions.length > 0 && (
              <div className="feedback-suggestions">
                <h4>Suggestions 💡</h4>
                {feedback.suggestions.map((suggestion, i) => (
                  <p key={i} className="suggestion">{suggestion}</p>
                ))}
              </div>
            )}
            
            {feedback.concepts && feedback.concepts.length > 0 && (
              <div className="feedback-concepts">
                <h4>Key Concepts 📚</h4>
                <div className="concepts-tags">
                  {feedback.concepts.map((concept, i) => (
                    <span key={i} className="concept-tag">{concept}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="learning-stats">
          <h3>📈 Learning Stats</h3>
          <div className="stats-charts">
            <div className="chart-item">
              <p className="chart-label">Concepts Learned</p>
              <div className="chart-bars">
                {progressStats.conceptsLearned.length > 0 ? (
                  progressStats.conceptsLearned.slice(-5).map((value, idx) => (
                    <div
                      key={idx}
                      className="chart-bar"
                      style={{ height: `${Math.max((value / 20) * 100, 10)}%` }}
                    ></div>
                  ))
                ) : (
                  <div className="no-data">No data yet</div>
                )}
              </div>
            </div>
            <div className="chart-item">
              <p className="chart-label">Code Accuracy</p>
              <div className="chart-bars">
                {progressStats.codeAccuracy.length > 0 ? (
                  progressStats.codeAccuracy.slice(-5).map((value, idx) => (
                    <div
                      key={idx}
                      className="chart-bar"
                      style={{ height: `${Math.max(value, 10)}%` }}
                    ></div>
                  ))
                ) : (
                  <div className="no-data">No data yet</div>
                )}
              </div>
            </div>
            <div className="chart-item">
              <p className="chart-label">Problems Solved</p>
              <div className="chart-bars">
                {progressStats.problemsSolved.length > 0 ? (
                  progressStats.problemsSolved.slice(-5).map((value, idx) => (
                    <div
                      key={idx}
                      className="chart-bar"
                      style={{ height: `${Math.max((value / 10) * 100, 10)}%` }}
                    ></div>
                  ))
                ) : (
                  <div className="no-data">No data yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        .app-container {
          display: flex;
          height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }
        
        .app-header {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .header-right {
          display: flex;
          gap: 0.5rem;
        }
        
        .app-header h1 {
          margin: 0;
          color: #1e293b;
          font-size: 1.5rem;
        }
        
        .language-select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background: white;
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .proficiency-badge, .difficulty-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .mode-toggle {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background: white;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        
        .mode-toggle.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        .clear-chat {
          padding: 0.5rem;
          border: 1px solid #ef4444;
          border-radius: 0.375rem;
          background: #ef4444;
          color: white;
          cursor: pointer;
        }
        
        .messages-container {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          background: #f8fafc;
        }
        
        .welcome-message {
          text-align: center;
          padding: 2rem;
          color: #64748b;
        }
        
        .welcome-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        
        .welcome-message h2 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
        }
        
        .quick-actions {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .quick-action-btn {
          padding: 0.5rem 1rem;
          background: #e0e7ff;
          color: #3730a3;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s;
        }
        
        .quick-action-btn:hover {
          background: #c7d2fe;
        }
        
        .message-container {
          margin-bottom: 1rem;
        }
        
        .message {
          display: inline-block;
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          position: relative;
        }
        
        .message.user {
          background: #3b82f6;
          color: white;
          margin-left: auto;
          text-align: right;
        }
        
        .message.tutor {
          background: white;
          color: #1e293b;
          border: 1px solid #e2e8f0;
        }
        
        .message-text {
          margin: 0;
          white-space: pre-wrap;
          font-family: inherit;
        }
        
        .code-example-container {
          margin-top: 0.5rem;
        }
        
        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .code-example {
          background: #1e293b;
          color: #e2e8f0;
          padding: 0.75rem;
          margin: 0;
          border-radius: 0.375rem;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          overflow-x: auto;
        }
        
        .code-explanation {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #f1f5f9;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #64748b;
        }
        
        .message-timestamp {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 0.25rem;
        }
        
        .loading-message {
          text-align: center;
          padding: 1rem;
          color: #64748b;
        }
        
        .typing-indicator {
          display: flex;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #94a3b8;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        
        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 0.375rem;
          margin: 1rem 0;
        }
        
        .input-container {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          background: white;
          display: flex;
          gap: 0.5rem;
        }
        
        .message-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
        }
        
        .send-button {
          padding: 0.75rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
          font-size: 1.25rem;
        }
        
        .send-button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
        
        .sidebar {
          width: 320px;
          border-left: 1px solid #e2e8f0;
          background: white;
          overflow-y: auto;
        }
        
        .progress-overview, .learning-goals-section, .feedback-section, .learning-stats {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .progress-overview h3, .learning-goals-section h3, .feedback-section h3, .learning-stats h3 {
          margin: 0 0 1rem 0;
          color: #1e293b;
          font-size: 1.125rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }
        
        .stat-label {
          color: #64748b;
        }
        
        .stat-value {
          font-weight: 500;
          color: #1e293b;
        }
        
        .goals-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .add-goal-btn {
          color: #3b82f6;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .learning-goal {
          margin-bottom: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .goal-content {
          flex: 1;
        }
        
        .goal-text {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #374151;
        }
        
        .goal-text.completed {
          text-decoration: line-through;
          color: #9ca3af;
        }
        
        .progress-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .progress-bar {
          flex: 1;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s ease;
        }
        
        .progress-text {
          font-size: 0.75rem;
          color: #64748b;
          min-width: 2rem;
        }
        
        .goal-toggle {
          background: none;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          width: 1.25rem;
          height: 1.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: #10b981;
        }
        
        .feedback-section h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #374151;
        }
        
        .positive-point {
          color: #059669;
          font-size: 0.875rem;
          margin: 0.25rem 0;
        }
        
        .suggestion {
          color: #2563eb;
          font-size: 0.875rem;
          margin: 0.25rem 0;
        }
        
        .concepts-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }
        
        .concept-tag {
          background: #f3f4f6;
          color: #374151;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          border: 1px solid #d1d5db;
        }
        
        .stats-charts {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .chart-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .chart-label {
          margin: 0;
          font-size: 0.875rem;
          color: #64748b;
        }
        
        .chart-bars {
          display: flex;
          align-items: end;
          gap: 0.25rem;
          height: 2rem;
        }
        
        .chart-bar {
          flex: 1;
          background: #3b82f6;
          border-radius: 0.125rem;
          min-height: 4px;
          transition: height 0.3s ease;
        }
        
        .chart-bar:nth-child(1) { background: #3b82f6; }
        .chart-bar:nth-child(2) { background: #10b981; }
        .chart-bar:nth-child(3) { background: #8b5cf6; }
        .chart-bar:nth-child(4) { background: #f59e0b; }
        .chart-bar:nth-child(5) { background: #ef4444; }
        
        .no-data {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #94a3b8;
          font-size: 0.75rem;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

ReactDOM.render(<ProgrammingTutor />, document.getElementById('root'));

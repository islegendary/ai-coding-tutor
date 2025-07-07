const { useState, useEffect, useRef } = React;

function ProgrammingTutor() {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLessonMode, setShowLessonMode] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [learningGoals, setLearningGoals] = useState([]);
  const messagesEndRef = useRef(null);

  const LANGUAGES = {
    python: { name: 'Python', icon: '🐍' },
    javascript: { name: 'JavaScript', icon: '🟨' },
    rust: { name: 'Rust', icon: '🦀' }
  };

  useEffect(() => {
    setLearningGoals(generateLearningGoals(selectedLanguage));
  }, [selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function generateLearningGoals(lang) {
    const base = {
      python: [
        'Learn basic syntax',
        'Understand functions',
        'Explore list comprehensions'
      ],
      javascript: [
        'Learn variables and types',
        'Understand DOM basics',
        'Use async/await'
      ],
      rust: [
        'Master ownership rules',
        'Use structs and enums',
        'Handle errors with Result'
      ]
    };
    return base[lang].map((text, i) => ({
      id: i,
      text,
      progress: 0,
      completed: false
    }));
  }

  async function sendMessage() {
    if (!currentMessage.trim() || isLoading) return;
    const userMsg = { id: Date.now(), sender: 'user', text: currentMessage };
    setMessages(prev => [...prev, userMsg]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: selectedLanguage,
          lesson: showLessonMode,
          history: messages.slice(-5),
          message: currentMessage
        })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'tutor', text: data.tutorResponse, codeExample: data.codeExample, explanation: data.explanation }
      ]);
      setFeedback(data.feedback);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'tutor', text: "Sorry, I'm having trouble responding right now." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
          <h1>Programming Tutor</h1>
          <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
            {Object.entries(LANGUAGES).map(([code, l]) => (
              <option key={code} value={code}>{l.icon} {l.name}</option>
            ))}
          </select>
          <button onClick={() => setShowLessonMode(!showLessonMode)} style={{ marginLeft: '1rem' }}>
            {showLessonMode ? 'Switch to Chat' : 'Switch to Lesson'}
          </button>
        </header>

        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {messages.map(m => (
            <div key={m.id} style={{ marginBottom: '1rem', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
              <div style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '8px', background: m.sender === 'user' ? '#2563eb' : '#f1f5f9', color: m.sender === 'user' ? 'white' : '#111' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{m.text}</pre>
                {m.codeExample && (
                  <pre style={{ background: '#e2e8f0', padding: '0.5rem', marginTop: '0.5rem' }}>{m.codeExample}</pre>
                )}
                {m.explanation && (
                  <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{m.explanation}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && <p>Tutor is thinking...</p>}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid #ddd' }}>
          <input
            value={currentMessage}
            onChange={e => setCurrentMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder='Ask a question or request a code example'
            style={{ width: '80%', padding: '0.5rem' }}
          />
          <button onClick={sendMessage} disabled={isLoading} style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
            Send
          </button>
        </div>
      </div>

      <aside style={{ width: '300px', borderLeft: '1px solid #ddd', padding: '1rem', overflowY: 'auto' }}>
        <h2>Learning Goals</h2>
        {learningGoals.map(goal => (
          <div key={goal.id} style={{ marginBottom: '1rem' }}>
            <p style={{ margin: 0 }}>{goal.text}</p>
            <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
              <div style={{ width: `${goal.progress}%`, height: '100%', background: '#2563eb' }} />
            </div>
          </div>
        ))}

        {feedback && (
          <div>
            <h2>Feedback</h2>
            {feedback.positive && feedback.positive.map((p, i) => <p key={`p${i}`} style={{ color: 'green' }}>{p}</p>)}
            {feedback.suggestions && feedback.suggestions.map((s, i) => <p key={`s${i}`} style={{ color: 'blue' }}>{s}</p>)}
            {feedback.concepts && feedback.concepts.map((c, i) => <span key={`c${i}`} style={{ fontSize: '0.75rem', marginRight: '0.25rem' }}>{c}</span>)}
          </div>
        )}
      </aside>
    </div>
  );
}

ReactDOM.render(<ProgrammingTutor />, document.getElementById('root'));

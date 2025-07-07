const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  const { language, lesson, history, message } = req.body;
  const prompt = `You are a helpful programming tutor.\nCurrent language: ${language}.\nLesson mode: ${lesson}.\nConversation history: ${JSON.stringify(history)}.\nUser message: "${message}".\nRespond in JSON with keys tutorResponse, codeExample (or null), explanation (or null), feedback (object with positive, suggestions, concepts arrays).`;
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }]
    });
    const content = completion.data.choices[0].message.content;
    res.json(JSON.parse(content));
  } catch (err) {
    console.error(err);
    res.status(500).json({ tutorResponse: "Error contacting AI service." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

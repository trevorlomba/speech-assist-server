const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

// Debug loading of .env
console.log('Current directory:', __dirname);
console.log('Loading .env from:', path.join(__dirname, '.env'));
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('API Key length:', process.env.OPENAI_API_KEY?.length);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 100,
      temperature: 0.7,
    });

    res.json(response.data.choices[0].message);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

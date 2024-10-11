require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Route to handle user input and interact with OpenAI API
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Send user input to OpenAI's API
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [{ role: 'user', content: userMessage }],
                max_tokens: 150,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        // Extract the chatbot's response from the API
        const botReply = response.data.choices[0].message.content;

        // Send the bot's reply back to the frontend
        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).json({ error: 'Failed to communicate with AI' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

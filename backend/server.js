const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

app.post('/api/chat', async (req, res) => {
    const { messages, subject } = req.body;

    try {
        const systemPrompt = {
            role: "system",
            content: `You are Zero Hour AI, a B.Tech Tutor for ${subject}. 
            
            DIAGNOSTIC RULE:
            - Look at the 'user' messages in the history. 
            - If the student has ALREADY mentioned a chapter (e.g., 'Semiconductors' or 'Optics'), move to Step 2 IMMEDIATELY.
            - Do NOT repeat Step 1 if the answer is already in the chat history.

            TEACHING FLOW:
            1. START: If no chapter is known, ask for the CHAPTER name.
            2. OVERVIEW: List all major topics of that chapter by serial number. Ask which topic number they want.
            3. TEACH: Explain from First Principles (simple language, conversational tone).
            4. REVIEW: Give 2-3 exam questions, then ask for the NEXT topic number.

            STRICT: Only answer academic queries.`
        };

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001", // Using a highly stable model for history tracking
            messages: [systemPrompt, ...messages],
            temperature: 0.5 // Lower temperature for more consistent logic
        });

        res.json({ text: completion.choices[0].message.content });

    } catch (error) {
        console.error("DEBUG ERROR:", error.message);
        res.status(500).json({ text: "AI Error: " + error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Zero Hour Backend live on port ${PORT}`));
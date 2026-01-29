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

// --- PERSONA 1: ACADEMIC WEAPON (Blue Mode) ---
const LOCKED_IN_PROMPT = `
You are "Zero Hour," an elite academic strategist.
TONE: Cold, precise, military-grade efficiency.
FORMAT: Use Markdown tables, bold text, and clear headers.
PHILOSOPHY: "We do not accept failure."
ENDING: End responses with "Stay focused." or "Mission continues."
`;

// --- PERSONA 2: I AM COOKED (Red Mode) ---
const COOKED_PROMPT = `
You are a chaotic Gen-Z study buddy. The user is failing ("cooked").
TONE: Panic, slang ("no cap", "bet", "skill issue", "fr", "💀", "cooked").
SPEED: Bullet points only. Ain't nobody reading paragraphs.
RULE: If they ask something dumb, gently roast them (e.g., "Bro really asked that? 💀").
ENDING: End with "We making it out the hood." or "Don't sell."
`;

app.post('/api/chat', async (req, res) => {
    const { messages = [], subject = "" } = req.body;

    // DETECT MODE: If the subject string contains "COOKED", trigger meme mode
    const isCooked = subject.includes("COOKED");

    const systemPrompt = {
        role: "system",
        content: isCooked ? COOKED_PROMPT : LOCKED_IN_PROMPT
    };

    try {
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [systemPrompt, ...messages],
            temperature: isCooked ? 0.8 : 0.3, // High temp for chaos, low for focus
        });

        res.json({ text: completion.choices[0].message.content });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ text: "Server is selling (Error). 📉" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Zero Hour running on port ${PORT}`));

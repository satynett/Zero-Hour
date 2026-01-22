document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatArea = document.getElementById('chatArea');
    const displaySubject = document.getElementById('displaySubject');
    const sidebar = document.getElementById('sidebar');
    const converter = new showdown.Converter();

    // --- 1. CRITICAL: Global History Array ---
    // This keeps the context alive so the AI doesn't repeat Step 1
    let chatHistory = [];

    // --- 2. SETUP SUBJECT FROM URL ---
    const params = new URLSearchParams(window.location.search);
    const subject = params.get('subject') || "Engineering Physics";
    if(displaySubject) displaySubject.innerText = subject.toUpperCase();

    // --- 3. SIDEBAR TOGGLE ---
    window.toggleSidebar = () => {
        if (sidebar.style.marginLeft === '0px' || sidebar.style.marginLeft === '') {
            sidebar.style.marginLeft = '-270px';
        } else {
            sidebar.style.marginLeft = '0px';
        }
    };

    // --- 4. SEND FUNCTION ---
    async function handleSend() {
        const msg = userInput.value.trim();
        if (!msg) return;

        // Add user message to local history
        chatHistory.push({ role: "user", content: msg });

        // UI: User Bubble (Red Theme)
        chatContainer.innerHTML += `
            <div style="align-self: flex-end; background: #450a0a; border: 1px solid #991b1b; padding: 12px 24px; border-radius: 20px 20px 4px 20px; color: white; max-width: 80%; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                ${msg}
            </div>
        `;
        
        userInput.value = "";
        
        // UI: Thinking Placeholder (Red Theme)
        const tempId = "ai-" + Date.now();
        chatContainer.innerHTML += `
            <div id="${tempId}" class="bot-msg" style="margin-bottom: 25px; display: flex; gap: 15px;">
                <div class="avatar" style="background: #dc2626; width: 35px; height: 35px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: white; box-shadow: 0 0 10px #dc2626; flex-shrink: 0;">ZH</div>
                <div class="bubble" style="color: #991b1b; font-style: italic; padding-top: 8px;">Analyzing history...</div>
            </div>
        `;
        
        chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });

        try {
            // 5. POST the FULL history to the backend
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: chatHistory, 
                    subject: subject 
                })
            });

            const data = await res.json();
            const aiText = data.text || "I'm having trouble connecting to the GGU module.";

            // 6. Save AI response to history so it remembers for next time
            chatHistory.push({ role: "assistant", content: aiText });

            // UI: Update AI bubble with real text
            const botElement = document.getElementById(tempId);
            const bubble = botElement.querySelector('.bubble');
            bubble.style.color = "#fef2f2";
            bubble.style.fontStyle = "normal";
            bubble.innerHTML = converter.makeHtml(aiText);

        } catch (e) {
            console.error("Fetch Error:", e);
            document.getElementById(tempId).querySelector('.bubble').innerText = "Server Error. Is your server.js running?";
        }
        
        chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
    }

    // --- 7. EVENT LISTENERS ---
    sendBtn.onclick = handleSend;
    userInput.onkeydown = (e) => { 
        if(e.key === 'Enter') {
            e.preventDefault(); // Prevents newline in input
            handleSend(); 
        }
    };
});
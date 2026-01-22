document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatContainer = document.getElementById('chatContainer');
    const chatArea = document.getElementById('chatArea');
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menuBtn');
    const displaySubject = document.getElementById('displaySubject');
    const historyList = document.getElementById('historyList');

    const converter = new showdown.Converter();

    // 1. Capture Subject from URL
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject') || "GENERAL STUDY";
    displaySubject.innerText = subject.toUpperCase();

    // 2. Load History Capsules
    const dummyHistory = ["Semiconductor Physics", "Python f-strings", "Logic Gates"];
    dummyHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerText = `🕒 ${item}`;
        historyList.appendChild(div);
    });

    // 3. Toggle Sidebar Logic
    window.toggleSidebar = () => {
        if (sidebar.style.marginLeft === '0px' || sidebar.style.marginLeft === '') {
            sidebar.style.marginLeft = '-270px';
            menuBtn.classList.remove('hidden');
        } else {
            sidebar.style.marginLeft = '0px';
            menuBtn.classList.add('hidden');
        }
    };

    // 4. Send Message Function
    async function handleSend() {
        const msg = userInput.value.trim();
        if (!msg) return;

        // User Message (Crimson Bubble)
        chatContainer.innerHTML += `
            <div style="align-self: flex-end; background: #450a0a; padding: 15px 25px; border-radius: 20px 20px 4px 20px; border: 1px solid #991b1b; max-width: 80%; color: white; margin-bottom: 10px;">
                ${msg}
            </div>
        `;

        userInput.value = "";
        chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });

        // AI Thinking Placeholder
        const tempId = "ai-" + Date.now();
        chatContainer.innerHTML += `
            <div id="${tempId}" class="bot-msg">
                <div class="avatar" style="background: #dc2626; box-shadow: 0 0 10px #dc2626;">ZH</div>
                <div class="bubble" style="font-style: italic; color: #991b1b;">Thinking...</div>
            </div>
        `;
        chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, subject: subject })
            });
            const data = await response.json();
            
            const botBubble = document.getElementById(tempId).querySelector('.bubble');
            botBubble.style.fontStyle = "normal";
            botBubble.style.color = "#fef2f2";
            botBubble.innerHTML = converter.makeHtml(data.text || "Error getting response.");
        } catch (error) {
            document.getElementById(tempId).querySelector('.bubble').innerText = "Server offline.";
        }
        chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
// assets/js/chatbot.js

// 1. Import Firebase to get the data
import { db } from "./firebase-config.js";
import { ref, get, query, limitToLast } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// REPLACE WITH YOUR WORKER URL
const WORKER_URL = "https://minescout-life-api.tmcarleton11.workers.dev"; 

document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("minescout-chat-widget")) {
        // ... (HTML injection remains the same) ...
        const widgetHTML = `
            <div id="minescout-chat-widget">
                <div id="chat-window" class="chat-hidden">
                    <div class="chat-header">
                        <span>Minescout AI</span>
                        <button id="chat-close-btn">&times;</button>
                    </div>
                    <div id="chat-messages">
                        <div class="chat-msg ai">Hello! I can read the latest posts. Ask me what's new!</div>
                    </div>
                    <div class="chat-input-area">
                        <input type="text" id="chat-input" placeholder="Type a message...">
                        <button id="chat-send-btn">➤</button>
                    </div>
                </div>
                <button id="chat-toggle-btn">
                    <img src="assests/images/favicon.png" alt="AI">
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", widgetHTML);
        initChatLogic();
    }
});

// --- NEW FUNCTION: GET DATA FROM FIREBASE ---
async function getWebsiteContext() {
    try {
        // Fetch the last 10 posts
        const contentRef = query(ref(db, 'content'), limitToLast(10));
        const snapshot = await get(contentRef);
        
        if (!snapshot.exists()) return "No posts found.";

        const data = snapshot.val();
        let contextString = "Here is a list of the latest articles and updates on the site:\n";

        Object.values(data).forEach(post => {
            const date = new Date(post.timestamp).toLocaleDateString();
            contextString += `- Title: "${post.title}" (Category: ${post.category}, Date: ${date})\n  Summary: ${post.summary}\n\n`;
        });

        return contextString;
    } catch (error) {
        console.error("Context Error:", error);
        return "Could not load posts.";
    }
}

function initChatLogic() {
    const toggleBtn = document.getElementById("chat-toggle-btn");
    const closeBtn = document.getElementById("chat-close-btn");
    const chatWindow = document.getElementById("chat-window");
    const sendBtn = document.getElementById("chat-send-btn");
    const input = document.getElementById("chat-input");

    const toggleChat = () => chatWindow.classList.toggle("chat-hidden");
    toggleBtn.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", toggleChat);

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, "user");
        input.value = "";
        const loadingId = addMessage("Thinking...", "ai", true);

        try {
            // 1. GET THE DATA LIVE
            const siteContext = await getWebsiteContext();

            // 2. SEND MESSAGE + DATA TO WORKER
            const response = await fetch(WORKER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: text,
                    context: siteContext // <--- Sending the "Knowledge" here
                })
            });

            const data = await response.json();
            updateMessage(loadingId, data.reply);
            
        } catch (error) {
            updateMessage(loadingId, "Connection error.");
            console.error(error);
        }
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });
}

function addMessage(text, type, isLoading = false) {
    const messages = document.getElementById("chat-messages");
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${type} ${isLoading ? 'loading' : ''}`;
    msgDiv.textContent = text;
    msgDiv.id = "msg-" + Date.now();
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
    return msgDiv.id;
}

function updateMessage(id, text) {
    const msgDiv = document.getElementById(id);
    if (msgDiv) {
        msgDiv.className = "chat-msg ai";
        msgDiv.textContent = text;
        const messages = document.getElementById("chat-messages");
        messages.scrollTop = messages.scrollHeight;
    }
}
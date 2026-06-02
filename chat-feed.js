const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycby0Odhm4GaSku2tmLcYuxf5qSnsPj8673ee7X1vUxtFepnGA28PihKXEAO8A1iYi-6Z4g/exec";

const chatBox = document.getElementById("chat-widget-box");
const messagesLog = document.getElementById("chat-messages-log");
const userInput = document.getElementById("user-chat-input");
const sendBtn = document.getElementById("chat-send-btn");

window.toggleChatWindow = function() {
    const chatBox = document.getElementById('chat-widget-box');

    if (chatBox) {
        // Toggle the 'active' class on and off cleanly
        chatBox.classList.toggle('active');
    } else {
        // Ultimate fallback: Scan the entire document if layout tree shifting occurs
        const fallbackBox = document.querySelector('.chatbot #chat-widget-box') || document.querySelector('#chat-widget-box');
        if (fallbackBox) {
            fallbackBox.classList.toggle('active');
        }
    }
};

function handleKeyPress(event) {
    if (event.key === "Enter" && !userInput.disabled) {
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const messageText = userInput.value.trim();
    if (!messageText) return;

    // 1. Lock down inputs immediately
    userInput.disabled = true;
    sendBtn.disabled = true;
    userInput.placeholder = "Processing telemetry matrix...";

    // 2. Append User Question (Orange Box) with a clear 'user-' tag prefix
    appendMessage(messageText, "user", "user-" + Date.now());
    userInput.value = "";

    // 3. Append Loading Indicator (Gray Box) with a distinct 'bot-' tag prefix
    const typingIndicatorId = "bot-" + Date.now();
    appendMessage("Thinking... ⚙️", "bot", typingIndicatorId);

    // 4. Create Isolation Callback Token
    const callbackName = "gemini_callback_" + Date.now();

    // 5. Establish Global Window Callback
    window[callbackName] = function (data) {
        // Targets ONLY the specific bot tracking ID
        updateBotMessage(typingIndicatorId, data.reply);

        // Release UI inputs
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.placeholder = "Type your telemetry inquiry...";
        userInput.focus();

        // Clean browser memory tag
        document.getElementById(callbackName).remove();
        delete window[callbackName];
    };

    // 6. Generate Script Tag Look-up
    const script = document.createElement("script");
    script.id = callbackName;
    script.src = `${APPS_SCRIPT_WEB_APP_URL}?message=${encodeURIComponent(messageText)}&callback=${callbackName}&_=${Date.now()}`;

    script.onerror = function () {
        updateBotMessage(typingIndicatorId, "Connection dropped. Operational link status offline.");
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.placeholder = "Type your telemetry inquiry...";
    };

    document.body.appendChild(script);
}

// Modified to accept and bind a strict unique element ID
function appendMessage(text, sender, uniqueId) {
    const messageDiv = document.createElement("div");
    messageDiv.id = uniqueId;
    messageDiv.classList.add("message", sender);
    messageDiv.innerText = text;
    messagesLog.appendChild(messageDiv);
    messagesLog.scrollTop = messagesLog.scrollHeight;
}

function updateBotMessage(id, newText) {
    const targetMessage = document.getElementById(id);
    if (targetMessage) {
        targetMessage.innerText = newText;
        messagesLog.scrollTop = messagesLog.scrollHeight;
    }
}

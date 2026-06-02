const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycby0Odhm4GaSku2tmLcYuxf5qSnsPj8673ee7X1vUxtFepnGA28PihKXEAO8A1iYi-6Z4g/exec";

// Element references will be assigned here once HTML lands
let messagesLog = null;
let userInput = null;
let sendBtn = null;

// 1. FIRST STEP: Fetch the HTML template
fetch('chatbot.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('chatbot').innerHTML = html;

        // 2. SECOND STEP: Now that HTML is in the DOM, bind elements safely
        messagesLog = document.getElementById("chat-messages-log");
        userInput = document.getElementById("user-chat-input");
        sendBtn = document.getElementById("chat-send-btn");
    })
    .catch(error => console.error('Error loading chatbot template:', error));


// --- GLOBAL HOOK ACTIONS FOR THE HTML BUTTONS ---

window.toggleChatWindow = function() {
    const chatBox = document.getElementById('chat-widget-box');
    if (chatBox) {
        // Toggles class to match the CSS layout styles perfectly
        chatBox.classList.toggle('active');
    }
};

window.handleKeyPress = function(event) {
    if (event.key === "Enter" && userInput && !userInput.disabled) {
        window.sendChatMessage();
    }
};

window.sendChatMessage = async function() {
    if (!userInput || !sendBtn || !messagesLog) return;

    const messageText = userInput.value.trim();
    if (!messageText) return;

    // Lock down inputs immediately
    userInput.disabled = true;
    sendBtn.disabled = true;
    userInput.placeholder = "Processing telemetry matrix...";

    // Append User Question
    appendMessage(messageText, "user", "user-" + Date.now());
    userInput.value = "";

    // Append Loading Indicator
    const typingIndicatorId = "bot-" + Date.now();
    appendMessage("Thinking... ⚙️", "bot", typingIndicatorId);

    // Create Isolation Callback Token
    const callbackName = "gemini_callback_" + Date.now();

    // Establish Global Window Callback
    window[callbackName] = function (data) {
        updateBotMessage(typingIndicatorId, data.reply);

        // Release UI inputs
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.placeholder = "Type your telemetry inquiry...";
        userInput.focus();

        // Clean browser memory tag
        const scriptElement = document.getElementById(callbackName);
        if (scriptElement) scriptElement.remove();
        delete window[callbackName];
    };

    // Generate Script Tag Look-up
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
};

function appendMessage(text, sender, uniqueId) {
    if (!messagesLog) return;
    const messageDiv = document.createElement("div");
    messageDiv.id = uniqueId;
    messageDiv.classList.add("message", sender);
    messageDiv.innerText = text;
    messagesLog.appendChild(messageDiv);
    messagesLog.scrollTop = messagesLog.scrollHeight;
}

function updateBotMessage(id, newText) {
    const targetMessage = document.getElementById(id);
    if (targetMessage && messagesLog) {
        targetMessage.innerText = newText;
        messagesLog.scrollTop = messagesLog.scrollHeight;
    }
}

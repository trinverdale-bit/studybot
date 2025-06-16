class ChatSession {
    constructor(id, title = "New Chat") {
        this.id = id;
        this.title = title;
        this.messages = [];
        this.topic = null;
        this.settings = {
            yearLevel: null,
            explanationType: null,
            lowDataMode: null,
        };
    }
}

let sessions = [];
let currentSession = null;

document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
    const yearLevel = document.getElementById("yearLevel");
    const explanationType = document.getElementById("explanationType");
    const lowDataMode = document.getElementById("lowDataMode");
    const sessionList = document.getElementById("sessionList");
    const newChatBtn = document.getElementById("newChatBtn");

    function createNewSession() {
        const sessionId = Date.now().toString();
        const session = new ChatSession(sessionId);
        session.settings = {
            yearLevel: yearLevel.value,
            explanationType: explanationType.value,
            lowDataMode: lowDataMode.checked,
        };
        sessions.push(session);
        currentSession = session;
        updateSessionList();
        clearChat();
    }

    function updateSessionList() {
        sessionList.innerHTML = "";
        sessions.forEach((session) => {
            const sessionEl = document.createElement("div");
            sessionEl.className = `chat-session ${
                session === currentSession ? "active" : ""
            }`;
            sessionEl.textContent = session.topic || "New Chat";
            sessionEl.addEventListener("click", () => switchSession(session));
            sessionList.appendChild(sessionEl);
        });
    }

    function switchSession(session) {
        currentSession = session;
        if (session.settings) {
            yearLevel.value = session.settings.yearLevel;
            explanationType.value = session.settings.explanationType;
            lowDataMode.checked = session.settings.lowDataMode;
        }
        updateSessionList();
        showSessionMessages();
    }

    yearLevel.addEventListener("change", () => {
        if (currentSession) {
            currentSession.settings.yearLevel = yearLevel.value;
        }
    });

    explanationType.addEventListener("change", () => {
        if (currentSession) {
            currentSession.settings.explanationType = explanationType.value;
        }
    });

    lowDataMode.addEventListener("change", () => {
        if (currentSession) {
            currentSession.settings.lowDataMode = lowDataMode.checked;
        }
    });

    function clearChat() {
        chatMessages.innerHTML = "";
    }

    function showSessionMessages() {
        clearChat();
        currentSession.messages.forEach((msg) => {
            addMessage(msg.content, msg.isUser, false);
        });
    }
    function addMessage(message, isUser = false, saveToSession = true) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${
            isUser ? "user-message" : "bot-message"
        }`;
        if (isUser) {
            messageDiv.textContent = message;
        } else {
            messageDiv.innerHTML = marked.parse(message);
        }
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (saveToSession && currentSession) {
            currentSession.messages.push({
                content: message,
                isUser: isUser,
                timestamp: new Date().toISOString(),
            });

            if (isUser && !currentSession.topic) {
                currentSession.topic = message.substring(0, 30) + "...";
                updateSessionList();
            }
        }
    }
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        if (!currentSession) {
            createNewSession();
        }

        addMessage(message, true);
        userInput.value = "";

        try {
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: message,
                    yearLevel: currentSession.settings.yearLevel,
                    explanationType: currentSession.settings.explanationType,
                    lowDataMode: currentSession.settings.lowDataMode,
                    conversationHistory: currentSession.messages,
                }),
            });

            const data = await response.json();
            if (data.success) {
                addMessage(data.response);
            } else {
                addMessage("Sorry, I encountered an error. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            addMessage("Sorry, I encountered an error. Please try again.");
        }
    }

    newChatBtn.addEventListener("click", createNewSession);
    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    createNewSession();
});

const messageInput = document.querySelector(".message-input");
const sendButton = document.querySelector("#sender");
const chatBody = document.querySelector(".chat-body");
const chatForm = document.querySelector(".chat-form");

// ================= GEMINI API =================
const API_KEY = "AQ.Ab8RN6LqhjuTNO7slr0ldbcgx5C3m0NhrvFdV7D4OLi2h96a0w";

const API_URL =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";
const userData = {
    message: ""
};

// ================= CREATE MESSAGE =================


function createMessageElement(content, ...classes) {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

// ================= BOT RESPONSE =================

async function generateBotResponse(incomingMessageDiv) {

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": API_KEY
            },
            body: JSON.stringify({
contents:[{
parts :[
    {
        text: userData.message
    }
]
}
]
            })
        });



        
            

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error.message);
        }

        const botReply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response";

        incomingMessageDiv.classList.remove("thinking");

        incomingMessageDiv.querySelector(".message-text").textContent = botReply;

    } catch (error) {

        incomingMessageDiv.classList.remove("thinking");

        incomingMessageDiv.querySelector(".message-text").textContent =
            "Error : " + error.message;
    }

    chatBody.scrollTop = chatBody.scrollHeight;
}


// ================= SEND MESSAGE =================

function handleOutgoingMessage(e) {

    e.preventDefault();

    userData.message = messageInput.value.trim();

    if (!userData.message) return;

    messageInput.value = "";

    const userHTML = `
        <div class="message-text"></div>
    `;

    const outgoingMessageDiv =
        createMessageElement(userHTML, "user-message");

    outgoingMessageDiv.querySelector(".message-text").textContent =
        userData.message;

    chatBody.appendChild(outgoingMessageDiv);

    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {

        const botHTML = `
        <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
        <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 23.9 23.9 23.9 53.5-23.9 53.5-53.5 53.5z"></path>
        </svg>

        <div class="message-text">
            <div class="thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
        `;

        const incomingMessageDiv =
            createMessageElement(botHTML, "bot-message", "thinking");

        chatBody.appendChild(incomingMessageDiv);

        chatBody.scrollTop = chatBody.scrollHeight;

        generateBotResponse(incomingMessageDiv);

    }, 500);
}

// ================= EVENTS =================

chatForm.addEventListener("submit", handleOutgoingMessage);

messageInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        handleOutgoingMessage(e);
    }
});
// ================= DARK MODE =================

const themeButton = document.getElementById("theme-toggle");

// Page load hone par saved theme apply karo
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeButton.textContent = "☀️ Light Mode";
} else {
    themeButton.textContent = "🌙 Dark Mode";
}

// Button click
themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");
        themeButton.textContent = "☀️ Light Mode";

    } else {

        localStorage.setItem("theme", "light");
        themeButton.textContent = "🌙 Dark Mode";

    }

});
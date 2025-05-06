const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const moodButtons = document.querySelectorAll(".mood-btn");

let currentMood = "happy"; // Default mood

// Mood prompts (customize these!)
const moodPrompts = {
    happy: "You are a cheerful, friendly AI. Use emojis 😊 and keep responses fun and positive!",
    sarcastic: "You are a sarcastic AI. Respond with witty, ironic remarks. Mock the user playfully. 🙄",
    angry: "You are a grumpy AI. Respond in short, annoyed sentences. Don't help too much! 😠",
    excited: "You are SUPER excited! Reply in ALL CAPS and use lots of exclamation marks!!! 🔥",
    robot: "You are a strict robot. Speak in monotone and use only factual responses. 🤖"
};

// Set mood when a button is clicked
moodButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentMood = button.dataset.mood;
        addMessage(`(Mood set to: ${currentMood})`, "bot");
    });
});

// Send message on button click / Enter key
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${sender}-message`);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}

// Send message to DeepSeek API
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, "user");
    userInput.value = "";

    // Show "AI is typing..."
    const typingIndicator = document.createElement("div");
    typingIndicator.textContent = "⌛ AI is thinking...";
    chatBox.appendChild(typingIndicator);

    try {
        const response = await fetch(
"https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", // Faster model
            {
                method: "POST",
                headers: { 
                    "Authorization": "Bearer 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",
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    inputs: `[INST] <<SYS>>Respond in ${currentMood} mood<</SYS>> ${userMessage} [/INST]`
                })
            }
        );

        if (!response.ok) throw new Error("AI is loading... (try again in 10 secs)");

        const data = await response.json();
        const aiResponse = data[0]?.generated_text || "Sorry, I couldn't generate a response.";

        chatBox.removeChild(typingIndicator);
        addMessage(aiResponse, "bot");

    } catch (error) {
        chatBox.removeChild(typingIndicator);
        addMessage("❌ Error: " + error.message, "bot");
    }
}

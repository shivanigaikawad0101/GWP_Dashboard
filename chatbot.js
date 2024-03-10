// Replace these with your actual credentials
// const API_KEY = "YOUR_API_KEY";
// const API_ENDPOINT = "https://api.chatbot.com/v2/stories";

// const chatDisplay = document.getElementById("chat-display");
// const userInput = document.getElementById("user-input");
// const sendBtn = document.getElementById("send-btn");

// sendBtn.addEventListener("click", sendMessage);

// function sendMessage() {
//   const userMessage = userInput.value;
//   displayMessage(userMessage, "user");

//   // Call your chatbot API
//   fetch(API_ENDPOINT, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${API_KEY}`,
//     },
//     body: JSON.stringify({ message: userMessage }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       const botReply = data.reply; // Assuming your API returns the bot's response as 'reply'
//       displayMessage(botReply, "bot");
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       displayMessage("Sorry, something went wrong.", "bot");
//     });

//   userInput.value = ""; // Clear input field
// }

// function displayMessage(message, sender) {
//   const messageElement = document.createElement("div");
//   messageElement.classList.add(sender);
//   messageElement.innerText = message;
//   chatDisplay.appendChild(messageElement);
// }

document
  .getElementById("toggle-icon-down")
  .addEventListener("click", function () {
    console.log("----");
    const chatSection = document.getElementById("chat-container");
    chatSection.style.display = "none";
    const chatClosedSection = document.getElementById("chat-container-closed");
    chatClosedSection.style.display = "flex";
  });

document
  .getElementById("toggle-icon-up")
  .addEventListener("click", function () {
    const chatSection = document.getElementById("chat-container");
    chatSection.style.display = "block";
    const chatClosedSection = document.getElementById("chat-container-closed");
    chatClosedSection.style.display = "none";
  });

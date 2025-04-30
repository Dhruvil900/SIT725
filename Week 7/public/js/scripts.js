const socket = io();

socket.on("number", (msg) => {
  console.log("Random number:", msg);
  document.getElementById("number").innerText = msg;
});

socket.on("newMessage", (msg) => {
  const messageSection = document.getElementById("message-section");
  const messageDiv = document.createElement("div");
  messageDiv.innerText = msg;
  messageSection.appendChild(messageDiv);
});

document.getElementById("sendMessageBtn").addEventListener("click", () => {
  const message = document.getElementById("userMessage").value;
  socket.emit("sendMessage", message); 
  document.getElementById("userMessage").value = "";  
});

document.getElementById("newNumberBtn").addEventListener("click", () => {
  socket.emit("newNumberRequest"); 
});

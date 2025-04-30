const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://localhost:27017/myprojectDB")
  .then(async () => {
    console.log(" Database connected successfully");
    await Message.deleteMany({});
    await RandomNumber.deleteMany({});
  })
  .catch((err) => console.error("MongoDB error:", err));

const MessageSchema = new mongoose.Schema({
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const RandomNumberSchema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);
const RandomNumber = mongoose.model("RandomNumber", RandomNumberSchema);

app.get("/api/projects", async (req, res) => {
  const projects = await Project.find({});
  res.json({ statusCode: 200, data: projects, message: "Success" });
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", async (messageContent) => {
    const newMessage = new Message({ content: messageContent });
    await newMessage.save();
    console.log(`New message: ${messageContent}`);
    io.emit("newMessage", messageContent);
  });

  socket.on("newNumberRequest", async () => {
    const newNumber = Math.floor(Math.random() * 100);
    const numberRecord = new RandomNumber({ value: newNumber });
    await numberRecord.save();
    console.log(`New number generated: ${newNumber}`);
    io.emit("number", newNumber);
  });

  RandomNumber.findOne()
    .sort({ timestamp: -1 })
    .limit(1)
    .then((latestNumber) => {
      if (latestNumber) {
        socket.emit("number", latestNumber.value);
      }
    });

  Message.find()
    .sort({ timestamp: -1 })
    .limit(10)
    .then((messages) => {
      messages.forEach((message) => {
        socket.emit("newMessage", message.content);
      });
    });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

http.listen(port, () => {
  console.log(`Running at: http://localhost:${port}`);
});

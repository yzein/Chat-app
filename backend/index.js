const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", handleConnection);

function handleConnection(socket) {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", handleJoinRoom);

  function handleJoinRoom(data) {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  }

  socket.on("send_message", handleSendMessage);

  function handleSendMessage(data) {
    socket.to(data.room).emit("receive_message", data);
  }

  socket.on("disconnect", handleDisconnect);

  function handleDisconnect() {
    console.log("User Disconnected", socket.id);
  }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
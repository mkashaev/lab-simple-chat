const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { Redis } = require("ioredis");

const PORT = process.env.PORT || 3005;

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origins: ["*"],
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send({ msg: "Success" });
});

const pubClient = new Redis();
const subClient = new Redis();

io.adapter(createAdapter(pubClient, subClient));

io.on("connection", (socket) => {
  socket.emit("message", "Welcome to the chat room!");
  socket.on("message", (message) => {
    console.log("Test");
    // socket.emit("message", message);             // Emit to current connection
    // socket.broadcast.emit("message", message);   // Emit broadcast expect sender
    io.emit("message", message); // Emit broadcast
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log("Listen on port " + PORT);
});

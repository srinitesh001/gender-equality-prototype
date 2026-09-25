const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// In-memory store for active live user locations
const activeUsers = {};

// Socket.io connection for real-time live GPS tracking
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Receive live position updates from client
  socket.on("update-location", (coords) => {
    activeUsers[socket.id] = {
      id: socket.id,
      lat: coords.lat,
      lng: coords.lng,
      timestamp: new Date().toLocaleTimeString()
    };

    // Broadcast live locations to all connected clients/dashboards
    io.emit("live-locations-update", activeUsers);
  });

  // Handle SOS emergency broadcast
  socket.on("trigger-emergency-sos", (sosData) => {
    io.emit("sos-alert-received", {
      userId: socket.id,
      ...sosData
    });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    delete activeUsers[socket.id];
    io.emit("live-locations-update", activeUsers);
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
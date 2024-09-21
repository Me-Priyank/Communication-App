const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Import routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

// Initialize Express
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Create HTTP server and setup WebSocket
const server = http.createServer(app);
const io = socketio(server);

// Socket.io configuration
io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('send_message', (message) => {
    io.emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

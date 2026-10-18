import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import net from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const rooms = new Map();

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, signal }) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { initiator: { socket, signal } });
    } else {
      const room = rooms.get(roomId);
      room.initiator.socket.emit('peer-joined', { signal });
    }
  });

  socket.on('return-signal', ({ roomId, signal }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.initiator.socket.emit('room-signal', { signal });
      rooms.delete(roomId);
    }
  });

  socket.on('disconnect', () => {
    // Cleanup rooms
    for (const [roomId, room] of rooms.entries()) {
      if (room.initiator.socket === socket) {
        rooms.delete(roomId);
      }
    }
  });
});

// Function to check if a port is in use
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.close();
        resolve(true);
      })
      .listen(port);
  });
};

// Function to find an available port
const findAvailablePort = async (startPort) => {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
  }
  return port;
};

// Start server with port finding
const startServer = async () => {
  const preferredPort = process.env.PORT || 3001;
  const port = await findAvailablePort(preferredPort);
  
  server.listen(port, () => {
    console.log(`Signaling server running on port ${port}`);
  });
};

startServer().catch(console.error); 
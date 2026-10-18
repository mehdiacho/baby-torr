import Peer from 'simple-peer';
import io from 'socket.io-client';

const CHUNK_SIZE = 16384; // 16KB chunks
let socket;

const connectToServer = async () => {
  // Try ports in sequence until we find the server
  const ports = [3001, 3002, 3003, 3004, 3005];
  
  for (const port of ports) {
    try {
      const tempSocket = io(`http://localhost:${port}`);
      await new Promise((resolve, reject) => {
        tempSocket.on('connect', () => resolve(tempSocket));
        tempSocket.on('connect_error', () => reject());
        // Timeout after 1 second
        setTimeout(reject, 1000);
      });
      socket = tempSocket;
      return;
    } catch (e) {
      continue;
    }
  }
  throw new Error('Could not connect to signaling server');
};

export const initiateConnection = async (files) => {
  if (!socket) await connectToServer();
  
  const peer = new Peer({ initiator: true, trickle: false });
  const roomId = generateRoomId();

  return new Promise((resolve) => {
    peer.on('signal', data => {
      socket.emit('join-room', { roomId, signal: data });
    });

    socket.on('peer-joined', async ({ signal }) => {
      peer.signal(signal);
      resolve({ peer, files, roomId });
    });
  });
};

export const joinConnection = async (roomId) => {
  const peer = new Peer({ initiator: false, trickle: false });

  return new Promise((resolve) => {
    socket.emit('join-room', { roomId });

    socket.on('room-signal', async ({ signal }) => {
      peer.signal(signal);
    });

    peer.on('signal', data => {
      socket.emit('return-signal', { roomId, signal: data });
    });

    peer.on('connect', () => {
      resolve(peer);
    });
  });
};

export const sendFile = async (peer, file, onProgress) => {
  const chunks = Math.ceil(file.size / CHUNK_SIZE);
  
  for (let i = 0; i < chunks; i++) {
    const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const buffer = await chunk.arrayBuffer();
    peer.send(buffer);
    
    onProgress((i + 1) / chunks * 100);
  }
};

const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 15);
}; 
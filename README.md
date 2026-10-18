# Baby Torr - P2P File Transfer

A simple peer-to-peer file transfer application that allows direct file sharing between browsers.

## Features
- Direct P2P file transfer
- No file size limits
- Progress tracking
- Resume capability
- Share via link or QR code

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the application:
   ```bash
   npm start
   ```

3. Open http://localhost:3000 in your browser

## Development
- Frontend runs on port 3000
- Signaling server runs on port 3001
- Uses WebRTC for direct P2P connections
- React + Vite for the frontend
- Express for the signaling server

## Requirements
- Node.js 16+
- Modern browser with WebRTC support

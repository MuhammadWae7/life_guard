const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function broadcastNewVital(vital) {
  const message = JSON.stringify({ type: 'new_vital', data: vital });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Update POST /api/vitals to broadcast new vitals
app.post('/api/vitals', authMiddleware, async (req, res) => {
  const { temperature, heartRate, spo2, deviceId } = req.body;
  if (!temperature || !heartRate || !spo2 || !deviceId) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const vital = await prisma.vital.create({
    data: { temperature, heartRate, spo2, deviceId, timestamp: new Date() },
  });
  broadcastNewVital(vital);
  res.json({ success: true });
});

server.listen(PORT, () => {
  console.log(`API server (HTTP+WebSocket) running on port ${PORT}`);
});
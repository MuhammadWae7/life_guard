const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('./middleware/auth');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

if (true) { // Always serve frontend for single-service deployment
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`API server (HTTP+WebSocket) running on port ${PORT}`);
});

// Add this near the top with other constants
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

// Add these routes before your existing routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a device ID (using username for simplicity)
    const deviceId = username;
    
    // Create the user
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, deviceId }
    });
    
    // Generate a token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
    
    // Update user with token
    await prisma.user.update({
      where: { id: user.id },
      data: { token }
    });
    
    res.json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find the user
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate a token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
    
    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: { token }
    });
    
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});
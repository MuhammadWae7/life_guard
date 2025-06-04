# Hardware Integration Deployment Guide

## 1️⃣ Environment Variables Setup

Create a `.env.local` file in your project root:

\`\`\`env
# Hardware API Key (server-side only - not exposed to client)
ARDUINO_API_KEY=your_secure_api_key_here

# Public URLs (safe to expose to client)
NEXT_PUBLIC_API_BASE_URL=https://your-lifeguard-platform.vercel.app
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-lifeguard-platform.vercel.app
\`\`\`

## 2️⃣ Generate Secure API Key

\`\`\`bash
# On Linux/Mac
openssl rand -hex 32

# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
\`\`\`

## 3️⃣ Deploy to Vercel

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `ARDUINO_API_KEY`: Your generated secure key
4. Deploy your project

## 4️⃣ Test Your API

\`\`\`bash
curl -X POST https://your-url.vercel.app/api/arduino/vital-signs \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secure_api_key_here" \
  -d '{
    "heartRate": 75,
    "temperature": 36.8,
    "spO2": 97
  }'
\`\`\`

## 5️⃣ Hardware Team Integration

Provide your hardware team with:

### API Endpoint
\`\`\`
POST https://your-url.vercel.app/api/arduino/vital-signs
\`\`\`

### Required Headers
\`\`\`
Content-Type: application/json
x-api-key: your_secure_api_key_here
\`\`\`

### Expected Data Format
\`\`\`json
{
  "heartRate": 75,
  "temperature": 36.8,
  "spO2": 97,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
\`\`\`

## Security Notes

- ✅ API key is server-side only
- ✅ Client-side code doesn't expose sensitive data
- ✅ Hardware communicates directly with secure API endpoints
- ✅ Dashboard receives data through internal API routes
\`\`\`

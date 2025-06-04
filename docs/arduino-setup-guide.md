# Hardware Integration Setup Guide

## 1. Setting Up Environment Variables

Create a `.env.local` file in your project root with the following:

\`\`\`env
# Generate a secure API key for hardware authentication
ARDUINO_API_KEY=your_secure_api_key_here
\`\`\`

## 2. Generating a Secure API Key

Run this command to generate a secure API key:

\`\`\`bash
# On Linux/Mac
openssl rand -hex 16

# On Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
\`\`\`

## 3. Deploying Your API

### Option A: Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the `ARDUINO_API_KEY` environment variable in Vercel dashboard
4. Deploy your project

### Option B: Run Locally for Testing

1. Start your Next.js development server:
\`\`\`bash
npm run dev
\`\`\`

2. Use a tool like ngrok to expose your local server:
\`\`\`bash
ngrok http 3000
\`\`\`

3. Note the URL provided by ngrok (e.g., `https://a1b2c3d4.ngrok.io`)

## 4. Testing Your API

Use curl to test your API:

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

## 5. Hardware Team Integration

Provide your hardware team with:

### API Endpoint
\`\`\`
POST https://your-url.vercel.app/api/arduino/vital-signs
\`\`\`

### API Key
\`\`\`
your_secure_api_key_here
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
  "timestamp": "2024-01-15T10:30:00.000Z",
  "deviceId": "device_123"
}
\`\`\`

## 6. Data Validation

The API validates incoming data:
- Heart Rate: 30-200 BPM
- Temperature: 30-45°C
- SpO2: 70-100%

Invalid data will be rejected with a 400 error.

## 7. Response Format

Successful requests return:
\`\`\`json
{
  "success": true,
  "message": "Vital signs received successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
\`\`\`

Error responses return:
\`\`\`json
{
  "error": "Invalid vital signs data"
}
\`\`\`

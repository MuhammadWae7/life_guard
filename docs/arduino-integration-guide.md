# Hardware Integration Guide for LifeGuard Platform

## 🔑 **API Credentials for Hardware Team**

Give these credentials to your hardware developer:

### **API Endpoint**
\`\`\`
POST https://your-lifeguard-platform.vercel.app/api/arduino/vital-signs
\`\`\`

### **API Key**
\`\`\`
lifeguard_arduino_key_2024
\`\`\`

### **Headers Required**
\`\`\`
Content-Type: application/json
x-api-key: lifeguard_arduino_key_2024
\`\`\`

## 📊 **Data Format Hardware Should Send**

\`\`\`json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "heartRate": 72,
  "temperature": 36.5,
  "spO2": 98,
  "deviceId": "device_123"
}
\`\`\`

## 🔧 **Arduino Code Example**

The Arduino developer should use this code structure:

\`\`\`cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// API Configuration
const char* apiUrl = "https://your-lifeguard-platform.vercel.app/api/arduino/vital-signs";
const char* apiKey = "lifeguard_arduino_key_2024";

void sendVitalSigns() {
  // Create JSON
  DynamicJsonDocument doc(200);
  doc["heartRate"] = readHeartRate();
  doc["temperature"] = readTemperature();
  doc["spO2"] = readSpO2();
  doc["timestamp"] = getTimestamp();
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Send HTTP POST
  HTTPClient http;
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", apiKey);
  
  int responseCode = http.POST(jsonString);
  
  if (responseCode == 200) {
    Serial.println("Data sent successfully!");
  } else {
    Serial.println("Error: " + String(responseCode));
  }
  
  http.end();
}
\`\`\`

## 🧪 **Testing the API**

Hardware developer can test with curl:

\`\`\`bash
curl -X POST https://your-lifeguard-platform.vercel.app/api/arduino/vital-signs \
  -H "Content-Type: application/json" \
  -H "x-api-key: lifeguard_arduino_key_2024" \
  -d '{
    "heartRate": 75,
    "temperature": 36.8,
    "spO2": 97,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }'
\`\`\`

## 📱 **Available Endpoints**

### Send Vital Signs Data
\`\`\`
POST /api/arduino/vital-signs
\`\`\`

### Get Latest Data
\`\`\`
GET /api/arduino/vital-signs
\`\`\`

### Get Historical Data
\`\`\`
GET /api/arduino/history?limit=10
\`\`\`

### Check API Status
\`\`\`
GET /api/arduino/status
\`\`\`

## 🔐 **Security Notes**

- Always use HTTPS (not HTTP)
- Include the API key in every request
- Validate data before sending
- Handle network errors gracefully

## 📞 **Support**

If the hardware developer has issues:
1. Check the API key is correct
2. Verify the URL is accessible
3. Ensure JSON format is correct
4. Check network connectivity
5. Review the response codes

The platform is ready to receive hardware data!

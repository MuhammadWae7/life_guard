
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApiKeyInformation } from '@/api/vitalsApi';

const ApiInfoPage: React.FC = () => {
  const apiInfo = getApiKeyInformation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-10">API Documentation</h1>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>API Overview</CardTitle>
                <CardDescription>
                  The HealthMonitor API allows your GSM808 sensor to securely transmit vital signs data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our API is designed to be simple and efficient, allowing for reliable data transmission even over limited cellular connections.
                  The GSM808 sensor collects heart rate, SpO2, and temperature data, then sends it to our servers using HTTPS requests.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-2">Base URL</h3>
                  <code className="bg-gray-200 p-2 rounded text-sm block">
                    https://api.healthmonitor.com/v1
                  </code>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-2">Data Format</h3>
                  <p className="mb-2 text-sm">All requests must use JSON format:</p>
                  <pre className="bg-gray-200 p-2 rounded text-sm overflow-x-auto">
{`{
  "deviceId": "GSM808-1234-ABCD",
  "heartRate": 75,
  "spo2": 98,
  "temperature": 36.6,
  "timestamp": "2023-05-17T14:30:00Z"
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="authentication">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                  Secure your API requests using API keys.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  All API requests must be authenticated using an API key. This key is unique to your account and device.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-2">API Key Authentication</h3>
                  <p className="mb-2 text-sm">Include your API key in the header of each request:</p>
                  <pre className="bg-gray-200 p-2 rounded text-sm overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY`}
                  </pre>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                  <h3 className="font-medium mb-2">Getting Your API Key</h3>
                  <p className="whitespace-pre-line">{apiInfo}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="endpoints">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  Available endpoints for the HealthMonitor API.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-green-100 p-2 border-b flex items-center">
                    <span className="font-mono text-green-800 font-semibold mr-2">POST</span>
                    <span className="font-mono">/vitals</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm">Submit new vital signs data from the GSM808 sensor.</p>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Request Body</h4>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{
  "deviceId": "GSM808-1234-ABCD",
  "heartRate": 75,
  "spo2": 98,
  "temperature": 36.6,
  "timestamp": "2023-05-17T14:30:00Z"
}`}
                      </pre>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Response</h4>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{
  "success": true,
  "message": "Data received successfully",
  "id": "vt_12345"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-100 p-2 border-b flex items-center">
                    <span className="font-mono text-blue-800 font-semibold mr-2">GET</span>
                    <span className="font-mono">/vitals/{'{deviceId}'}</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm">Retrieve the latest vital signs for a specific device.</p>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Response</h4>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{
  "deviceId": "GSM808-1234-ABCD",
  "heartRate": 75,
  "spo2": 98,
  "temperature": 36.6,
  "timestamp": "2023-05-17T14:30:00Z"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiInfoPage;

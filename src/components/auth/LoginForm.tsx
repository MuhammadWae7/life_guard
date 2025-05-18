
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    // Password strength validation (in a real app, this would be on registration)
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // This would be replaced with actual authentication logic when connected to backend
      // Using a secure API endpoint defined in environment variables
      const API_URL = import.meta.env.VITE_AUTH_API_URL || '/api/auth';
      
      // In a real implementation, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      // In production, you would store a JWT token instead of a boolean
      sessionStorage.setItem('isLoggedIn', 'true');
      
      // In a real implementation, you would get the deviceId from the server response
      // For demo purposes, we'll simulate retrieving it
      const mockDeviceId = "GSM808-DEMO-1234"; // In a real app, this would come from your API
      
      // Use the login function from useAuth
      login("demo-jwt-token", mockDeviceId);
      
      // Store last login time for security purposes
      sessionStorage.setItem('lastLoginTime', new Date().toISOString());
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      
      // More specific error handling
      let errorMessage = "Failed to log in. Please check your credentials.";
      
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your internet connection.";
        } else if (error.message.includes('401')) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.message.includes('429')) {
          errorMessage = "Too many login attempts. Please try again later.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your health dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-sm text-health-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-health-primary hover:bg-health-secondary" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-health-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

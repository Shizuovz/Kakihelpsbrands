import React, { useState } from 'react';
import { API_BASE_URL } from '@/config';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ShieldAlert, ArrowRight, Lock, Mail } from 'lucide-react';
import logo from '../assets/logos/logo-no-bg.png';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        localStorage.setItem('adminToken', result.data.token);
        localStorage.setItem('adminUser', JSON.stringify(result.data.admin));
        toast.success("Welcome, Super Admin");
        navigate('/admin/content');
      } else {
        toast.error(result.message || "Invalid Admin Credentials");
      }
    } catch (error) {
      console.error("Admin Login Error:", error);
      toast.error("Auth server unreachable (CORS issues possible)");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-kaki-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/10 blur-[120px] rounded-full"></div>
      
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <img src={logo} alt="KAKI" className="h-16 w-auto animate-logo-float" />
          </div>
          <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            ADMIN PORTAL
          </CardTitle>
          <CardDescription className="text-kaki-grey text-lg mt-2">
            Website Content Management Access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" /> Email Address
              </label>
              <Input 
                type="email" 
                placeholder="admin@kaki.in" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/20 border-white/10 text-white h-12 focus:border-red-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" /> Administrative Password
              </label>
              <Input 
                type="password" 
                placeholder="Your secure password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/20 border-white/10 text-white h-12 focus:border-red-500/50 transition-all"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 text-white font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              >
                {isLoading ? "Authenticating Authority..." : (
                  <span className="flex items-center gap-2">
                    AUTHORIZE ACCESS <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-xs text-red-400/60 uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

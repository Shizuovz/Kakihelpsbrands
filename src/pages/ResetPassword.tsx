import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff, CheckCircle, Info } from 'lucide-react';
import { API_BASE_URL } from "@/config";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing reset token.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/confirm-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message || 'Failed to reset password.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && status === 'idle') {
    return (
      <div className="min-h-screen bg-kaki-black flex flex-col items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md">
          <Card className="bg-kaki-dark-grey border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl flex items-center justify-center gap-2">
                <Lock className="w-6 h-6 text-red-400" />
                Invalid Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-red-200">This password reset link is invalid or missing the security token.</p>
              </div>
              <div className="mt-6 text-center">
                <Link to="/login">
                  <Button className="bg-purple-600 hover:bg-purple-700 w-full">Go to Login</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kaki-black flex flex-col items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10 mt-12">
          <h1 className="text-4xl font-bold text-white mb-3">KAKI Hoardings</h1>
        </div>

        <Card className="bg-kaki-dark-grey border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl flex items-center justify-center gap-2">
              <Lock className="w-6 h-6 text-purple-400" />
              Create New Password
            </CardTitle>
            <CardDescription className="text-kaki-grey mt-2">
              Please enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'success' ? (
              <div className="space-y-6 pt-2">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold">Password Reset Successful</h4>
                    <p className="text-sm text-green-400/80 mt-1">{message}</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link to="/login">
                    <Button className="bg-purple-600 hover:bg-purple-700 w-full">Sign In Now</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6 pt-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-kaki-grey" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-black/40 border-white/10 text-white placeholder:text-kaki-grey"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-kaki-grey hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-kaki-grey" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 bg-black/40 border-white/10 text-white placeholder:text-kaki-grey"
                        required
                      />
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-3 text-red-200">
                      <Info className="w-4 h-4 text-red-500 shrink-0" />
                      <p className="text-sm">{message}</p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, ArrowRight, Shield, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface AuthFormProps {
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          ...(mode === 'register' && { username }) 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengirim OTP');
      }

      setSuccess('Kode OTP telah dikirim ke email Anda');
      setStep('otp');
      setOtp('');
      setResendTimer(60); // 60 seconds cooldown
      
      // Start resend timer
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp_code: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verifikasi OTP gagal');
      }

      setSuccess('Verifikasi berhasil! Mengalihkan...');
      
      // Redirect to dashboard after successful verification
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengirim ulang OTP');
      }

      setSuccess('Kode OTP baru telah dikirim');
      setResendTimer(60);
      
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(numericValue);
  };

  const renderOtpInputs = () => {
    return (
      <div className="flex justify-center space-x-2 mb-6">
        {Array.from({ length: 6 }, (_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={otp[index] || ''}
            onChange={(e) => {
              const newOtp = otp.split('');
              newOtp[index] = e.target.value;
              handleOtpChange(newOtp.join(''));
              
              // Auto-focus next input
              if (e.target.value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) (nextInput as HTMLInputElement).focus();
              }
            }}
            onKeyDown={(e) => {
              // Handle backspace
              if (e.key === 'Backspace' && !otp[index] && index > 0) {
                const prevInput = document.getElementById(`otp-${index - 1}`);
                if (prevInput) (prevInput as HTMLInputElement).focus();
              }
            }}
            id={`otp-${index}`}
            className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#D4A574] focus:outline-none transition-colors"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Empty space with subtle decoration */}
          <motion.div 
            className="hidden lg:block"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574]/20 to-transparent rounded-3xl"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-12 h-96 flex items-center justify-center border border-white/10">
                <motion.div 
                  className="text-center"
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="text-6xl mb-4">📚</div>
                  <h2 className="text-2xl font-bold text-white mb-2">Bookkita</h2>
                  <p className="text-white/70">Platform ebook terpercaya dengan keamanan terbaik</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div 
            className="w-full max-w-md mx-auto"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-white shadow-2xl border-0">
              <CardHeader className="text-center pb-6">
                <motion.div 
                  className="mx-auto w-16 h-16 bg-[#D4A574] rounded-full flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {mode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {step === 'email' 
                    ? mode === 'login' 
                      ? 'Masukkan email Anda untuk menerima kode OTP'
                      : 'Daftar dengan email dan username Anda'
                    : 'Masukkan kode OTP 6 digit yang telah dikirim'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                {/* Mode Toggle */}
                <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={mode === 'login' ? 'default' : 'ghost'}
                    className={`flex-1 transition-all duration-300 ${
                      mode === 'login' 
                        ? 'bg-[#2C1810] text-white shadow' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => onModeChange('login')}
                    size="sm"
                  >
                    Masuk
                  </Button>
                  <Button
                    variant={mode === 'register' ? 'default' : 'ghost'}
                    className={`flex-1 transition-all duration-300 ${
                      mode === 'register' 
                        ? 'bg-[#2C1810] text-white shadow' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => onModeChange('register')}
                    size="sm"
                  >
                    Daftar
                  </Button>
                </div>

                {/* Success/Error Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-sm text-red-700">{error}</span>
                    </motion.div>
                  )}
                  
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm text-green-700">{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {step === 'email' ? (
                    <motion.form
                      key="email-step"
                      onSubmit={handleSendOtp}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="nama@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent transition-all"
                        />
                      </div>

                      {mode === 'register' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Username
                          </label>
                          <Input
                            type="text"
                            placeholder="username123"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent transition-all"
                          />
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isLoading || !email || (mode === 'register' && !username)}
                        className="w-full bg-[#2C1810] hover:bg-[#1F120C] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Mengirim...' : (
                          <>
                            Kirim Kode OTP
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="otp-step"
                      onSubmit={handleVerifyOtp}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 text-center block">
                          Kode OTP 6 Digit
                        </label>
                        {renderOtpInputs()}
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={resendTimer > 0 || isLoading}
                          className="text-sm text-[#D4A574] hover:text-[#B8935F] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center mx-auto"
                        >
                          {resendTimer > 0 ? (
                            <>
                              <Clock className="w-4 h-4 mr-1" />
                              Kirim ulang dalam {resendTimer}s
                            </>
                          ) : (
                            'Kirim ulang kode'
                          )}
                        </button>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep('email')}
                          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                        >
                          Kembali
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading || otp.length !== 6}
                          className="flex-1 bg-[#2C1810] hover:bg-[#1F120C] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Memverifikasi...' : (
                            <>
                              {mode === 'login' ? 'Masuk' : 'Daftar'}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
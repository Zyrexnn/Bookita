"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, ArrowRight, Shield, CheckCircle, Clock, AlertCircle, Eye, EyeOff } from "lucide-react";

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
  const [showOtp, setShowOtp] = useState(false);

  // Auto-focus email input on mount
  useEffect(() => {
    const emailInput = document.getElementById('email-input');
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  // Auto-focus first OTP input when OTP step is shown
  useEffect(() => {
    if (step === 'otp') {
      const firstOtpInput = document.getElementById('otp-0');
      if (firstOtpInput) {
        firstOtpInput.focus();
      }
    }
  }, [step]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!email || !email.includes('@')) {
      setError('Masukkan email yang valid');
      setIsLoading(false);
      return;
    }

    if (mode === 'register' && (!username || username.length < 3)) {
      setError('Username minimal 3 karakter');
      setIsLoading(false);
      return;
    }

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
      setResendTimer(60);
      
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

    if (!otp || otp.length !== 6) {
      setError('Masukkan kode OTP 6 digit');
      setIsLoading(false);
      return;
    }

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

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 1);
    
    const newOtp = otp.split('');
    newOtp[index] = numericValue;
    setOtp(newOtp.join(''));
    
    // Auto-focus next input
    if (numericValue && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const numbers = text.replace(/[^0-9]/g, '').slice(0, 6);
        if (numbers.length === 6) {
          setOtp(numbers);
          // Focus last input
          const lastInput = document.getElementById('otp-5');
          if (lastInput) (lastInput as HTMLInputElement).focus();
        }
      });
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/[^0-9]/g, '').slice(0, 6);
    if (numbers.length === 6) {
      setOtp(numbers);
      // Focus last input
      const lastInput = document.getElementById('otp-5');
      if (lastInput) (lastInput as HTMLInputElement).focus();
    }
  };

  const renderOtpInputs = () => {
    return (
      <div className="flex justify-center space-x-3 mb-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="relative">
            <input
              id={`otp-${index}`}
              type={showOtp ? "text" : "password"}
              maxLength={1}
              value={otp[index] || ''}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              onPaste={handleOtpPaste}
              className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#D4A574] focus:outline-none transition-colors bg-white"
              disabled={isLoading}
            />
            {index === 5 && (
              <button
                type="button"
                onClick={() => setShowOtp(!showOtp)}
                className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const resetForm = () => {
    setStep('email');
    setEmail('');
    setUsername('');
    setOtp('');
    setError('');
    setSuccess('');
    setResendTimer(0);
    setShowOtp(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
      {/* Back to Home Button */}
      <motion.button
        onClick={() => window.location.href = '/'}
        className="absolute top-4 left-4 text-white hover:text-[#D4A574] transition-colors flex items-center space-x-2"
        // whileHover={{ scale: 1.05 }}
        // whileTap={{ scale: 0.95 }}
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        <span className="text-sm">Kembali</span>
      </motion.button>

      <motion.div 
        className="w-full max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
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
                  <div className="mt-6 space-y-2 text-sm text-white/60">
                    <p>✅ Passwordless Authentication</p>
                    <p>✅ OTP via Email</p>
                    <p>✅ Aman & Cepat</p>
                  </div>
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
                  // whileHover={{ scale: 1.05, rotate: 5 }}
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
                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 'email' ? 'bg-[#D4A574] text-white' : 'bg-green-500 text-white'
                    }`}>
                      {step === 'email' ? '1' : '✓'}
                    </div>
                    <div className={`w-16 h-1 ${
                      step === 'otp' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 'otp' ? 'bg-[#D4A574] text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      2
                    </div>
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={mode === 'login' ? 'default' : 'ghost'}
                    className={`flex-1 transition-all duration-300 ${
                      mode === 'login' 
                        ? 'bg-[#2C1810] text-white shadow' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      onModeChange('login');
                      resetForm();
                    }}
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
                    onClick={() => {
                      onModeChange('register');
                      resetForm();
                    }}
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
                          id="email-input"
                          type="email"
                          placeholder="nama@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent transition-all"
                          disabled={isLoading}
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
                            disabled={isLoading}
                          />
                        </div>
                      )}

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                          💡 Kode OTP akan dikirim ke email Anda. Pastikan email Anda valid dan dapat diakses.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading || !email || (mode === 'register' && !username)}
                        className="w-full bg-[#2C1810] hover:bg-[#1F120C] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Mengirim...
                          </div>
                        ) : (
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
                        <p className="text-sm text-gray-500 text-center">
                          Kode telah dikirim ke <span className="font-medium">{email}</span>
                        </p>
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
                          disabled={isLoading}
                        >
                          Kembali
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading || otp.length !== 6}
                          className="flex-1 bg-[#2C1810] hover:bg-[#1F120C] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Memverifikasi...
                            </div>
                          ) : (
                            <>
                              {mode === 'login' ? 'Masuk' : 'Daftar'}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-700">
                          ⚠️ Kode OTP akan kedaluwarsa dalam 5 menit. Jangan bagikan kode OTP kepada siapa pun.
                        </p>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Help Section */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                Butuh bantuan?{' '}
                <a href="#" className="text-[#D4A574] hover:text-[#B8935F] transition-colors">
                  Hubungi Support
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
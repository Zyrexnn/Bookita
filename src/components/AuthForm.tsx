"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowRight, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

interface AuthFormProps {
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Auto-focus email input on mount
  useEffect(() => {
    const emailInput = document.getElementById('email-input');
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  // Check if user is coming from email link
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            setSuccess('Login successful! Redirecting...');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1500);
          })
          .catch((err) => {
            setError(err.message);
          });
      }
    }
  }, []);

  const handleSendMagicLink = async (e: React.FormEvent) => {
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

    try {
      console.log('Sending magic link to:', email);
      console.log('Firebase config:', {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });

      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/verify-login`,
        handleCodeInApp: true,
      };

      console.log('Action code settings:', actionCodeSettings);

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      
      console.log('Magic link sent successfully');
      setSuccess('Magic Link telah dikirim ke email Anda. Silakan cek inbox Anda.');
      setEmailSent(true);
    } catch (err) {
      console.error('Send magic link error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      // Provide more specific error messages
      if (err.code === 'auth/invalid-api-key') {
        setError('Firebase API Key tidak valid. Silakan periksa konfigurasi Firebase.');
      } else if (err.code === 'auth/api-key-not-valid') {
        setError('API Key tidak valid. Pastikan API Key sudah benar.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Koneksi internet bermasalah. Silakan periksa koneksi Anda.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email tidak valid. Silakan masukkan email yang benar.');
      } else {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengirim Magic Link');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setError('');
    setSuccess('');
    setEmailSent(false);
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
                    <p>✅ Magic Link Login</p>
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
                  {emailSent 
                    ? 'Magic Link telah dikirim ke email Anda'
                    : 'Masukkan email Anda untuk menerima Magic Link'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8">
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
                  {!emailSent ? (
                    <motion.form
                      key="email-form"
                      onSubmit={handleSendMagicLink}
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent transition-all"
                          disabled={isLoading}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#2C1810] hover:bg-[#1a0f08] text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            Kirim Magic Link
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="text-center space-y-4"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">Magic Link Terkirim!</h3>
                        <p className="text-gray-600 text-sm">
                          Kami telah mengirimkan Magic Link ke <strong>{email}</strong>.<br />
                          Silakan cek inbox Anda dan klik link untuk masuk.
                        </p>
                      </div>
                      <div className="space-y-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEmailSent(false);
                            setSuccess('');
                          }}
                          className="w-full"
                        >
                          Kirim Ulang Magic Link
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            resetForm();
                            onModeChange(mode === 'login' ? 'register' : 'login');
                          }}
                          className="w-full text-gray-600"
                        >
                          {mode === 'login' ? 'Buat Akun Baru' : 'Sudah Punya Akun?'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mode Toggle */}
                {!emailSent && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
                      </p>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onModeChange(mode === 'login' ? 'register' : 'login');
                          resetForm();
                        }}
                        className="text-[#D4A574] hover:text-[#B8935F] font-medium"
                      >
                        {mode === 'login' ? 'Daftar Sekarang' : 'Masuk Sekarang'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
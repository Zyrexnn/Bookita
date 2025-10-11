"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowRight, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { auth, analytics } from "@/lib/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";
import { logEvent } from "firebase/analytics";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Track page view
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_title: 'Login',
        page_location: window.location.href
      });
    }
  }, [analytics]);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!email || !email.includes("@")) {
      setError("Masukkan email yang valid");
      setIsLoading(false);
      
      // Track validation error
      if (analytics) {
        logEvent(analytics, 'login_validation_error', {
          error_type: 'invalid_email'
        });
      }
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
      
      // Save email to localStorage for verification
      window.localStorage.setItem("emailForSignIn", email);
      
      // Track successful magic link send
      if (analytics) {
        logEvent(analytics, 'magic_link_sent', {
          email_domain: email.split('@')[1]
        });
      }
      
      console.log('Magic link sent successfully');
      setSuccess("Magic Link telah dikirim ke email Anda. Silakan cek inbox Anda.");
      setEmail("");
    } catch (err) {
      console.error("Send magic link error:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      
      // Check if it's an API key error
      if (err.code === 'auth/invalid-api-key') {
        setError("Firebase API Key tidak valid. Silakan periksa konfigurasi Firebase Anda.");
      } else if (err.code === 'auth/api-key-not-valid') {
        setError("API Key tidak valid. Pastikan API Key sudah benar.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("Koneksi internet bermasalah. Silakan periksa koneksi Anda.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Email tidak valid. Silakan masukkan email yang benar.");
      } else {
        setError(err instanceof Error ? err.message : "Gagal mengirim Magic Link");
      }
      
      // Track send error
      if (analytics) {
        logEvent(analytics, 'magic_link_send_error', {
          error_message: err instanceof Error ? err.message : 'unknown_error',
          error_code: err.code || 'unknown'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
      {/* Back to Home Button */}
      <motion.button
        onClick={() => {
          // Track back to home click
          if (analytics) {
            logEvent(analytics, 'back_to_home_click', {
              from_page: 'login'
            });
          }
          window.location.href = '/';
        }}
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
                  <p className="text-white/70">Platform ebook terpercaya dengan login tanpa password</p>
                  <div className="mt-6 space-y-2 text-sm text-white/60">
                    <p>✅ Magic Link Authentication</p>
                    <p>✅ Login dengan Email</p>
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
                  Masuk ke Akun Anda
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Masukkan email Anda untuk menerima Magic Link
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                {/* Success/Error Messages */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-green-700">{success}</span>
                  </div>
                )}

                <form onSubmit={handleSendMagicLink} className="space-y-4">
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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      💡 Magic Link akan dikirim ke email Anda. Klik link tersebut untuk login tanpa password.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-[#2C1810] hover:bg-[#1F120C] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Mengirim...
                      </div>
                    ) : (
                      <>
                        Kirim Magic Link
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Help Section */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                Butuh bantuan?{' '}
                <a 
                  href="#" 
                  className="text-[#D4A574] hover:text-[#B8935F] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    // Track support click
                    if (analytics) {
                      logEvent(analytics, 'support_click', {
                        from_page: 'login'
                      });
                    }
                  }}
                >
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
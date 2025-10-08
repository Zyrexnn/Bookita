"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, User, LogOut, Settings, Bell, TrendingUp, Star, Download } from "lucide-react";

interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info from JWT token or make API call
    const getUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          // If API fails, try to get from JWT token
          const authToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('auth-token='))
            ?.split('=')[1];
          
          if (authToken) {
            // For demo purposes, we'll use a simple approach
            // In production, decode JWT properly
            setUser({
              id: 'demo-id',
              email: 'demo@example.com',
              username: 'demo_user',
              name: 'Demo User'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Clear cookies
      document.cookie = 'session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // Redirect to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#D4A574] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Header */}
      <motion.header 
        className="bg-[#2C1810]/95 backdrop-blur-sm border-b border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Bookkita</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-[#D4A574] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-white">
                  <p className="text-sm font-medium">{user?.name || user?.username}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Selamat datang kembali, {user?.name || user?.username}! 👋
            </h2>
            <p className="text-gray-400">
              Mari lanjutkan perjalanan membaca Anda hari ini
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: BookOpen, label: "Buku Dibaca", value: "24", color: "text-blue-400" },
              { icon: Download, label: "Buku Diunduh", value: "12", color: "text-green-400" },
              { icon: Star, label: "Rating Rata-rata", value: "4.8", color: "text-yellow-400" },
              { icon: TrendingUp, label: "Streak Membaca", value: "7 hari", color: "text-purple-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Books */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-[#D4A574]" />
                    Buku Terbaru
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Lanjutkan membaca buku Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "The Psychology of Money", author: "Morgan Housel", progress: 75 },
                      { title: "Atomic Habits", author: "James Clear", progress: 45 },
                      { title: "Deep Work", author: "Cal Newport", progress: 90 }
                    ].map((book, index) => (
                      <motion.div
                        key={index}
                        className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{book.title}</h4>
                          <span className="text-sm text-gray-400">{book.progress}%</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{book.author}</p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-[#D4A574] h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${book.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Rekomendasi</CardTitle>
                  <CardDescription className="text-gray-400">
                    Berdasarkan preferensi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Sapiens", author: "Yuval Noah Harari", category: "History" },
                      { title: "The Lean Startup", author: "Eric Ries", category: "Business" },
                      { title: "Mindset", author: "Carol Dweck", category: "Psychology" }
                    ].map((book, index) => (
                      <motion.div
                        key={index}
                        className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <h4 className="text-white font-medium mb-1">{book.title}</h4>
                        <p className="text-sm text-gray-400 mb-2">{book.author}</p>
                        <span className="inline-block bg-[#D4A574]/20 text-[#D4A574] text-xs px-2 py-1 rounded-full">
                          {book.category}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-[#D4A574] hover:bg-[#B8935F] text-white">
                    Lihat Semua Rekomendasi
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
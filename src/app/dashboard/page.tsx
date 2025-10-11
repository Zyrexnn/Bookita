"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { BookOpen, User, LogOut, Settings, Bell, TrendingUp, Star, Download, ArrowRight, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/useAuthStatus";
import { auth } from "@/lib/firebase";

interface FirebaseUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
}

export default function DashboardPage() {
  const { currentUser, loading, isAuthenticated } = useRequireAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
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

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
          <p className="mb-6">Please login again to continue</p>
          <Button 
            onClick={() => router.push("/login")}
            className="bg-[#D4A574] hover:bg-[#B8935F] text-white"
          >
            Login Again
          </Button>
        </div>
      </div>
    );
  }

  const user = currentUser as FirebaseUser;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Dynamic Navbar */}
      <Navbar user={{
        id: user.uid,
        email: user.email,
        username: user.displayName || user.email?.split("@")[0],
        name: user.displayName || user.email?.split("@")[0]
      }} />

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
              Selamat datang kembali, {user.displayName || user.email?.split("@")[0]}! 👋
            </h2>
            <p className="text-gray-400">
              Mari lanjutkan perjalanan membaca Anda hari ini
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: BookOpen, label: "Buku Saya", action: "Lihat Semua", color: "bg-blue-500" },
              { icon: Download, label: "Unduhan", action: "Kelola", color: "bg-green-500" },
              { icon: Star, label: "Favorit", action: "Lihat", color: "bg-yellow-500" },
              { icon: Settings, label: "Pengaturan", action: "Atur", color: "bg-purple-500" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                //whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{item.label}</h3>
                    <p className="text-sm text-gray-400">{item.action}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: BookOpen, label: "Buku Dibaca", value: "24", color: "text-blue-400", change: "+3" },
              { icon: Download, label: "Buku Diunduh", value: "12", color: "text-green-400", change: "+2" },
              { icon: Star, label: "Rating Rata-rata", value: "4.8", color: "text-yellow-400", change: "+0.2" },
              { icon: TrendingUp, label: "Streak Membaca", value: "7 hari", color: "text-purple-400", change: "+1" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
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
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-[#D4A574]" />
                      Buku Terbaru
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#D4A574] hover:text-[#B8935F]">
                      Lihat Semua
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Lanjutkan membaca buku Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "The Psychology of Money", author: "Morgan Housel", progress: 75, category: "Finance" },
                      { title: "Atomic Habits", author: "James Clear", progress: 45, category: "Self-Help" },
                      { title: "Deep Work", author: "Cal Newport", progress: 90, category: "Productivity" },
                      { title: "Sapiens", author: "Yuval Noah Harari", progress: 30, category: "History" }
                    ].map((book, index) => (
                      <motion.div
                        key={index}
                        className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                        //whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">{book.title}</h4>
                            <p className="text-sm text-gray-400 mb-2">{book.author}</p>
                            <span className="inline-block bg-[#D4A574]/20 text-[#D4A574] text-xs px-2 py-1 rounded-full">
                              {book.category}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#D4A574] mb-1">{book.progress}%</div>
                            <div className="text-xs text-gray-400">Selesai</div>
                          </div>
                        </div>
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
                      { title: "The Lean Startup", author: "Eric Ries", category: "Business", rating: 4.5 },
                      { title: "Mindset", author: "Carol Dweck", category: "Psychology", rating: 4.7 },
                      { title: "The 4-Hour Work Week", author: "Tim Ferriss", category: "Productivity", rating: 4.2 }
                    ].map((book, index) => (
                      <motion.div
                        key={index}
                        className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                        //whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <h4 className="text-white font-medium mb-1">{book.title}</h4>
                        <p className="text-sm text-gray-400 mb-2">{book.author}</p>
                        <div className="flex items-center justify-between">
                          <span className="inline-block bg-[#D4A574]/20 text-[#D4A574] text-xs px-2 py-1 rounded-full">
                            {book.category}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-400">{book.rating}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-[#D4A574] hover:bg-[#B8935F] text-white">
                    Lihat Semua Rekomendasi
                  </Button>
                </CardContent>
              </Card>

              {/* Activity Card */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6">
                <CardHeader>
                  <CardTitle className="text-white">Aktivitas Terkini</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "Membaca", book: "Atomic Habits", time: "2 jam yang lalu" },
                      { action: "Mengunduh", book: "Deep Work", time: "1 hari yang lalu" },
                      { action: "Menilai", book: "The Psychology of Money", time: "3 hari yang lalu" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-[#D4A574] rounded-full"></div>
                        <span className="text-gray-300">{activity.action}</span>
                        <span className="text-white font-medium">{activity.book}</span>
                        <span className="text-gray-500 text-xs">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Tips */}
          <motion.div
            className="mt-8 bg-gradient-to-r from-[#D4A574]/20 to-[#B8935F]/20 rounded-xl p-6 border border-[#D4A574]/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-lg font-bold text-white mb-3">💡 Tips Hari Ini</h3>
            <p className="text-gray-300 mb-4">
              Luangkan waktu 15 menit untuk membaca sebelum tidur. Hal ini dapat meningkatkan kualitas tidur dan mengurangi stres.
            </p>
            <Button variant="outline" size="sm" className="border-[#D4A574] text-[#D4A574] hover:bg-[#D4A574] hover:text-white">
              Pelajari Lebih Lanjut
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { 
  Menu, X, ArrowRight, Check, Star, Quote, Mail, BookOpen, Gift, CheckCircle,
  Download, Smartphone, Users, Heart, TrendingUp, Award
} from "lucide-react";

interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("reader");
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        // User is not logged in
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail("");
      
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }, 1000);
  };

  const features = [
    {
      icon: BookOpen,
      title: "Koleksi Lengkap",
      description: "Akses ribuan ebook dari berbagai genre dan kategori.",
      color: "text-blue-600"
    },
    {
      icon: Download,
      title: "Download Offline",
      description: "Baca kapan saja tanpa koneksi internet.",
      color: "text-green-600"
    },
    {
      icon: Smartphone,
      title: "Multi Device",
      description: "Sinkronisasi otomatis di semua perangkat Anda.",
      color: "text-purple-600"
    },
    {
      icon: Users,
      title: "Komunitas",
      description: "Diskusi dan rekomendasi dengan pembaca lain.",
      color: "text-orange-600"
    }
  ];

  const stats = [
    { value: "75,000+", label: "Pengguna Aktif", icon: Users },
    { value: "150,000+", label: "Ebook Tersedia", icon: BookOpen },
    { value: "4.9/5", label: "Rating", icon: Star },
    { value: "24/7", label: "Support", icon: Heart }
  ];

  const testimonials = [
    {
      name: "Sarah Putri",
      role: "Mahasiswa",
      avatar: "👩‍🎓",
      rating: 5,
      comment: "Bookkita sangat membantu dalam mencari referensi kuliah. Koleksinya lengkap!"
    },
    {
      name: "Budi Santoso",
      role: "Professional",
      avatar: "👨‍💼",
      rating: 5,
      comment: "Praktis untuk membaca di perjalanan. Sangat merekomendasikan!"
    },
    {
      name: "Maya Anggraini",
      role: "Ibu Rumah Tangga",
      avatar: "👩‍👧‍👦",
      rating: 4,
      comment: "Bisa membaca novel sambil mengurus anak. Fitur bookmark sangat membantu!"
    }
  ];

  const readerPlans = [
    {
      name: "Lite",
      price: "Rp. 50,000",
      period: "1 Bulan",
      description: "Untuk pembaca kasual",
      features: [
        "Akses 10 ebook/bulan",
        "Baca offline",
        "Support dasar",
        "1 device"
      ],
      popular: false
    },
    {
      name: "Smart",
      price: "Rp. 100,000",
      period: "2 Bulan",
      description: "Untuk pembaca aktif",
      features: [
        "Akses 25 ebook/bulan",
        "Baca offline",
        "Prioritas support",
        "3 device",
        "Bookmark & notes"
      ],
      popular: true
    },
    {
      name: "Max",
      price: "Rp. 200,000",
      period: "3 Bulan",
      description: "Untuk pembaca intensif",
      features: [
        "Akses tak terbatas",
        "Baca offline",
        "Support 24/7",
        "5 device",
        "Bookmark & notes",
        "Early access new books"
      ],
      popular: false
    }
  ];

  const uploaderPlans = [
    {
      name: "Starter",
      price: "Rp. 100,000",
      period: "2 Bulan",
      description: "Untuk penulis pemula",
      features: [
        "Upload 5 ebook",
        "Basic analytics",
        "50% royalty",
        "Support email"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "Rp. 250,000",
      period: "3 Bulan",
      description: "Untuk penulis profesional",
      features: [
        "Upload 20 ebook",
        "Advanced analytics",
        "70% royalty",
        "Priority support",
        "Marketing tools"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Rp. 500,000",
      period: "6 Bulan",
      description: "Untuk penerbit",
      features: [
        "Upload tak terbatas",
        "Full analytics",
        "85% royalty",
        "Dedicated support",
        "Marketing tools",
        "API access"
      ],
      popular: false
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderPlanCard = (plan: any, index: number) => (
    <motion.div
      key={`${plan.name}-${index}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className={`relative h-full ${plan.popular ? 'border-2 border-[#D4A574] shadow-xl scale-105' : 'border-gray-200 shadow-lg hover:shadow-xl'} transition-all duration-300 hover:-translate-y-2`}>
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-[#D4A574] text-white px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg animate-pulse">
              <Star className="w-4 h-4 mr-2" />
              Paling Populer
            </div>
          </div>
        )}
        <CardHeader className="text-center pb-6 pt-8">
          <CardTitle className={`text-2xl font-bold ${plan.popular ? 'text-[#2C1810]' : 'text-gray-900'}`}>
            {plan.name}
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            {plan.description}
          </CardDescription>
          <div className="mt-4">
            <div className={`text-4xl font-bold ${plan.popular ? 'text-[#D4A574]' : 'text-gray-900'}`}>
              {plan.price}
            </div>
            <div className="text-gray-500 font-medium">
              /{plan.period}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-8">
          <ul className="space-y-3">
            {plan.features.map((feature: string, featureIndex: number) => (
              <li key={featureIndex} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            className={`w-full mt-6 font-bold py-3 ${plan.popular ? 'bg-[#2C1810] hover:bg-[#1F120C] text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'} transition-all duration-300 hover:scale-105`}
            size="lg"
          >
            Pilih Paket
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Navbar */}
      <Navbar user={user} />

      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-24 md:py-32 mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="text-center lg:text-left"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div 
                className="inline-block bg-[#D4A574] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
                //whileHover={{ scale: 1.05 }}
                //whileTap={{ scale: 0.95 }}
              >
                📚 Platform Ebook Terbaik
              </motion.div>
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Baca Tanpa
                <br />
                <span className="text-[#D4A574]">Batas</span>
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Temukan dan nikmati ribuan ebook favorit Anda. Baca kapan saja, di mana saja tanpa repot membawa buku fisik.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {!user && (
                  <Button 
                    size="lg" 
                    className="bg-[#D4A574] hover:bg-[#B8935F] text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    //whileHover={{ scale: 1.05 }}
                    //whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/auth'}
                  >
                    Mulai Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-[#1a1a2e] font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-lg"
                  //whileHover={{ scale: 1.05 }}
                  //whileTap={{ scale: 0.95 }}
                >
                  {user ? 'Lihat Koleksi Saya' : 'Lihat Koleksi'}
                </Button>
              </motion.div>
              
              <motion.div 
                className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-gray-400"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {[
                  { icon: "⭐", text: "4.9/5 Rating" },
                  { icon: "👥", text: "75,000+ Pengguna" },
                  { icon: "📚", text: "150,000+ Ebook" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center"
                    //whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-2xl mr-2">{item.icon}</span>
                    <span className="text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-500 border border-white/20"
                //whileHover={{ scale: 1.05 }}
                //whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <div className="bg-gradient-to-br from-[#D4A574] to-[#B8935F] rounded-xl h-80 md:h-96 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 text-center text-white p-8">
                      <motion.div 
                        className="text-8xl mb-6"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        📖
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-2">Koleksi Ebook Premium</h3>
                      <p className="text-lg opacity-90">Akses tak terbatas</p>
                    </div>
                    
                    <motion.div 
                      className="absolute -top-4 -left-4 bg-white/20 backdrop-blur-sm rounded-xl p-4"
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="text-3xl">📱</div>
                    </motion.div>
                    <motion.div 
                      className="absolute -bottom-4 -right-4 bg-white/20 backdrop-blur-sm rounded-xl p-4"
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    >
                      <div className="text-3xl">💻</div>
                    </motion.div>
                    <motion.div 
                      className="absolute top-1/2 -right-8 bg-white/20 backdrop-blur-sm rounded-xl p-4"
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    >
                      <div className="text-3xl">📚</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
            <motion.path 
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="#ffffff"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Kenapa Bookkita?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform ebook dengan fitur lengkap untuk pengalaman membaca terbaik.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  //whileHover={{ y: -10 }}
                >
                  <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-200 bg-white">
                    <CardHeader className="text-center pb-4">
                      <motion.div 
                        className="mx-auto w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-gray-100 transition-colors"
                        //whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className={`h-7 w-7 ${feature.color}`} />
                      </motion.div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center px-4">
                      <CardDescription className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div 
            className="mb-20"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      className="text-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      //whileHover={{ scale: 1.05 }}
                    >
                      <motion.div 
                        className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3"
                        //whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="h-6 w-6 text-blue-600" />
                      </motion.div>
                      <motion.div 
                        className="text-3xl font-bold text-gray-900 mb-1"
                        initial={{ y: 10 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                        viewport={{ once: true }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Apa Kata Mereka?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Testimoni dari pengguna puas Bookkita.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  //whileHover={{ y: -10 }}
                >
                  <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-200 bg-white relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-blue-100 opacity-30">
                      <Quote className="h-6 w-6" />
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="text-2xl mr-3">{testimonial.avatar}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex mb-3">
                        {renderStars(testimonial.rating)}
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        "{testimonial.comment}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section 
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-block bg-[#2C1810] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
              //whileHover={{ scale: 1.05 }}
              //whileTap={{ scale: 0.95 }}
            >
              💰 Harga Terjangkau
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pilih Paket Anda
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fleksibel sesuai kebutuhan Anda. Mulai dari pembaca kasual hingga penerbit profesional.
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12 bg-gray-200 p-1 rounded-lg">
              <TabsTrigger 
                value="reader" 
                className={`text-lg py-3 font-semibold transition-all duration-300 ${activeTab === 'reader' ? 'bg-white text-[#2C1810] shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                📖 Reader
              </TabsTrigger>
              <TabsTrigger 
                value="uploader" 
                className={`text-lg py-3 font-semibold transition-all duration-300 ${activeTab === 'uploader' ? 'bg-white text-[#2C1810] shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                ✍️ Uploader
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="reader" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {readerPlans.map((plan, index) => renderPlanCard(plan, index))}
                  </div>
                </TabsContent>

                <TabsContent value="uploader" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {uploaderPlans.map((plan, index) => renderPlanCard(plan, index))}
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-[#2C1810] to-[#1F120C] text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #fff 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-block bg-[#D4A574] text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg"
              //whileHover={{ scale: 1.05 }}
              //whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              STAY UPDATED
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Jangan Lewatkan Update Terbaru
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Dapatkan informasi tentang ebook baru, promo eksklusif, dan tips membaca menarik langsung di inbox Anda.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto border border-white/20"
              >
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Berhasil Berlangganan!</h3>
                <p className="text-white/90">
                  Terima kasih telah bergabung. Kami akan mengirimkan update terbaru ke email Anda.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <motion.div
                    className="flex-1"
                    //whileHover={{ scale: 1.02 }}
                    //whileTap={{ scale: 0.98 }}
                  >
                    <Input
                      type="email"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="px-6 py-4 text-gray-900 placeholder-gray-500 rounded-full border-0 focus:ring-2 focus:ring-[#D4A574] shadow-lg"
                    />
                  </motion.div>
                  <motion.div
                    //whileHover={{ scale: 1.05 }}
                    //whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="bg-[#D4A574] hover:bg-[#B8935F] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Mendaftar..." : "Daftar Gratis"}
                    </Button>
                  </motion.div>
                </div>
                <p className="text-sm text-white/70">
                  Dengan mendaftar, Anda setuju dengan{" "}
                  <a href="#" className="underline hover:text-white transition-colors">
                    Kebijakan Privasi
                  </a>{" "}
                  dan{" "}
                  <a href="#" className="underline hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </a>
                </p>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              { icon: BookOpen, title: "Ebook Gratis", desc: "1 ebook gratis setiap bulan khusus untuk subscriber" },
              { icon: Gift, title: "Promo Eksklusif", desc: "Diskon spesial dan penawaran terbatas setiap minggu" },
              { icon: Mail, title: "Content Personal", desc: "Rekomendasi buku sesuai preferensi baca Anda" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                //whileHover={{ y: -10, scale: 1.02 }}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="mx-auto w-12 h-12 bg-[#D4A574]/20 rounded-full flex items-center justify-center mb-4"
                  //whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="h-6 w-6 text-[#D4A574]" />
                </motion.div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="bg-[#1a1a2e] text-white py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 text-[#D4A574]">Bookkita</h3>
              <p className="text-gray-400 mb-4">
                Platform pembelian ebook terlengkap dan terpercaya di Indonesia.
              </p>
              <div className="flex space-x-4">
                {["📘", "🐦", "📷", "💼"].map((icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-[#D4A574] transition-colors"
                    //whileHover={{ scale: 1.2, rotate: 5 }}
                    //whileTap={{ scale: 0.9 }}
                  >
                    <span className="sr-only">Social {index}</span>
                    {icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            {[
              { title: "Quick Links", items: ["Tentang Kami", "Kategori", "Event", "Blog", "Karir"] },
              { title: "Support", items: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "FAQ"] },
              { title: "Contact", items: ["📧 info@bookkita.com", "📞 +62 21 1234 5678", "📍 Jakarta, Indonesia", "🕒 Mon-Fri: 9AM-6PM"] }
            ].map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold mb-4 text-white">{section.title}</h4>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      {section.title === "Contact" ? (
                        <div className="text-gray-400 flex items-center">
                          {item}
                        </div>
                      ) : (
                        <a 
                          href="#" 
                          className="text-gray-400 hover:text-[#D4A574] transition-colors inline-block"
                          //whileHover={{ x: 5 }}
                        >
                          {item}
                        </a>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p>© 2024 Bookkita. All rights reserved. | Made with ❤️ for book lovers</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block bg-[#D4A574] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              📚 Platform Ebook Terbaik
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Baca Tanpa
              <br />
              <span className="text-[#D4A574]">Batas</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Temukan dan nikmati ribuan ebook favorit Anda. Baca kapan saja, di mana saja tanpa repot membawa buku fisik.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-[#D4A574] hover:bg-[#B8935F] text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-[#1a1a2e] font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-lg"
              >
                Lihat Koleksi
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-gray-400">
              <div className="flex items-center">
                <span className="text-2xl mr-2">⭐</span>
                <span className="text-sm">4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">👥</span>
                <span className="text-sm">75,000+ Pengguna</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">📚</span>
                <span className="text-sm">150,000+ Ebook</span>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-500 border border-white/20">
              <div className="relative">
                {/* Main illustration */}
                <div className="bg-gradient-to-br from-[#D4A574] to-[#B8935F] rounded-xl h-80 md:h-96 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 text-center text-white p-8">
                    <div className="text-8xl mb-6 animate-pulse">📖</div>
                    <h3 className="text-2xl font-bold mb-2">Koleksi Ebook Premium</h3>
                    <p className="text-lg opacity-90">Akses tak terbatas</p>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -left-4 bg-white/20 backdrop-blur-sm rounded-xl p-4 animate-bounce">
                    <div className="text-3xl">📱</div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white/20 backdrop-blur-sm rounded-xl p-4 animate-bounce" style={{animationDelay: '0.5s'}}>
                    <div className="text-3xl">💻</div>
                  </div>
                  <div className="absolute top-1/2 -right-8 bg-white/20 backdrop-blur-sm rounded-xl p-4 animate-bounce" style={{animationDelay: '1s'}}>
                    <div className="text-3xl">📚</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ffffff"/>
        </svg>
      </div>
    </section>
  );
}
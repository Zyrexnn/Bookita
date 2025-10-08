"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, BookOpen, Gift, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }, 1000);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-[#2C1810] to-[#1F120C] text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #fff 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="mb-8">
          <div className="inline-block bg-[#D4A574] text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <Mail className="w-4 h-4 inline mr-2" />
            STAY UPDATED
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Jangan Lewatkan Update Terbaru
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Dapatkan informasi tentang ebook baru, promo eksklusif, dan tips membaca menarik langsung di inbox Anda.
          </p>
        </div>

        {isSubscribed ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto border border-white/20">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Berhasil Berlangganan!</h3>
            <p className="text-white/90">
              Terima kasih telah bergabung. Kami akan mengirimkan update terbaru ke email Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-500 rounded-full border-0 focus:ring-2 focus:ring-[#D4A574] shadow-lg"
              />
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="bg-[#D4A574] hover:bg-[#B8935F] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Mendaftar..." : "Daftar Gratis"}
              </Button>
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
          </form>
        )}

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="mx-auto w-12 h-12 bg-[#D4A574]/20 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-[#D4A574]" />
            </div>
            <h3 className="text-lg font-bold mb-2">Ebook Gratis</h3>
            <p className="text-white/80 text-sm">
              1 ebook gratis setiap bulan khusus untuk subscriber
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="mx-auto w-12 h-12 bg-[#D4A574]/20 rounded-full flex items-center justify-center mb-4">
              <Gift className="h-6 w-6 text-[#D4A574]" />
            </div>
            <h3 className="text-lg font-bold mb-2">Promo Eksklusif</h3>
            <p className="text-white/80 text-sm">
              Diskon spesial dan penawaran terbatas setiap minggu
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="mx-auto w-12 h-12 bg-[#D4A574]/20 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-[#D4A574]" />
            </div>
            <h3 className="text-lg font-bold mb-2">Content Personal</h3>
            <p className="text-white/80 text-sm">
              Rekomendasi buku sesuai preferensi baca Anda
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
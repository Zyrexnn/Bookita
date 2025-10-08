"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Download, Smartphone, Users, Star, Heart, TrendingUp, Award, Quote } from "lucide-react";

export default function AboutSection() {
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

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Kenapa Bookkita?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform ebook dengan fitur lengkap untuk pengalaman membaca terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white"
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-gray-100 transition-colors`}>
                      <Icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
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
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div>
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
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200 bg-white relative overflow-hidden"
              >
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
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
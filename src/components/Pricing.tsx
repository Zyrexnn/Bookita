"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star } from "lucide-react";

export default function Pricing() {
  const [activeTab, setActiveTab] = useState("reader");

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

  const renderPlanCard = (plan: any, index: number) => (
    <Card key={`${plan.name}-${index}`} className={`relative h-full ${plan.popular ? 'border-2 border-[#D4A574] shadow-xl scale-105' : 'border-gray-200 shadow-lg hover:shadow-xl'}`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-[#D4A574] text-white px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
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
          className={`w-full mt-6 font-bold py-3 ${plan.popular ? 'bg-[#2C1810] hover:bg-[#1F120C] text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}
          size="lg"
        >
          Pilih Paket
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#2C1810] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            💰 Harga Terjangkau
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pilih Paket Anda
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fleksibel sesuai kebutuhan Anda. Mulai dari pembaca kasual hingga penerbit profesional.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12 bg-gray-200 p-1 rounded-lg">
            <TabsTrigger 
              value="reader" 
              className={`text-lg py-3 font-semibold ${activeTab === 'reader' ? 'bg-white text-[#2C1810] shadow' : 'text-gray-600 hover:text-gray-900'}`}
            >
              📖 Reader
            </TabsTrigger>
            <TabsTrigger 
              value="uploader" 
              className={`text-lg py-3 font-semibold ${activeTab === 'uploader' ? 'bg-white text-[#2C1810] shadow' : 'text-gray-600 hover:text-gray-900'}`}
            >
              ✍️ Uploader
            </TabsTrigger>
          </TabsList>

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
        </Tabs>
      </div>
    </section>
  );
}
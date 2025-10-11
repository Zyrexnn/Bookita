"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function VerifyLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if the URL contains a Magic Link token from Firebase
    if (typeof window !== "undefined" && isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      
      // If email is missing (user switched browser), ask for it again
      if (!email) {
        email = window.prompt("Mohon masukkan kembali email Anda untuk menyelesaikan login:");
        if (!email) {
          alert("Email diperlukan untuk verifikasi.");
          router.push("/login");
          return;
        }
      }

      // Complete the sign-in process
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          // Login successful!
          console.log("Login successful:", result.user);
          window.localStorage.removeItem("emailForSignIn");
          
          // Redirect to dashboard
          router.push("/dashboard"); 
        })
        .catch((error) => {
          console.error("Login failed:", error);
          alert("Tautan tidak valid, sudah kedaluwarsa, atau email tidak cocok. Silakan coba lagi.");
          router.push("/login");
        });
    } 
    // If user accesses this page without a magic link, redirect to login
    else if (typeof window !== "undefined") {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-[#D4A574] rounded-full flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Memverifikasi Magic Link...
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Mohon tunggu, kami sedang memproses otentikasi Anda.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>📧 Mengecek email Anda</p>
              <p>🔐 Memverifikasi keamanan</p>
              <p>✨ Menyiapkan sesi login</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
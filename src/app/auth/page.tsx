"use client";

import { useState } from "react";
import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <AuthForm 
      mode={mode} 
      onModeChange={setMode} 
    />
  );
}
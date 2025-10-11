"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Bell, Settings, AlertTriangle } from "lucide-react";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface NavbarProps {
  user?: {
    id: string;
    email: string;
    username: string;
    name?: string;
  } | null;
}

export default function Navbar({ user: propUser }: NavbarProps) {
  const { currentUser, loading, firebaseReady, firebaseError } = useAuthStatus();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  // Use Firebase user if available, otherwise use prop user
  const user = currentUser ? {
    id: currentUser.uid,
    email: currentUser.email || "",
    username: currentUser.displayName || currentUser.email?.split("@")[0] || "",
    name: currentUser.displayName || currentUser.email?.split("@")[0] || ""
  } : propUser;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await auth.signOut();
      }
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAuthClick = () => {
    router.push("/login");
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <nav className="bg-[#2C1810] text-white shadow-xl border-b border-gray-800 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0 cursor-pointer"
            // whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.location.href = '/'}
          >
            <h1 className="text-2xl font-bold text-white">Bookkita</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-baseline space-x-6">
              {["Home", "Category", "Event"].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-gray-200 hover:text-white hover:bg-[#3D2418] px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  // whileHover={{ scale: 1.05 }}
                  // whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {firebaseError ? (
                <div className="flex items-center space-x-2 text-yellow-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">Auth Error</span>
                </div>
              ) : user ? (
                <>
                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-200 hover:text-white hover:bg-[#3D2418] relative"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>

                  {/* Settings */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-200 hover:text-white hover:bg-[#3D2418]"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>

                  {/* User Menu */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-2 text-gray-200 hover:text-white hover:bg-[#3D2418] px-3 py-2"
                    >
                      <div className="w-8 h-8 bg-[#D4A574] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">
                        {user.name || user.username}
                      </span>
                    </Button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
                        >
                          <button
                            onClick={handleDashboardClick}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Dashboard
                          </button>
                          <button
                            onClick={() => window.location.href = '/profile'}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => window.location.href = '/settings'}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Settings
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                /* Login Button - Only show if not loading and Firebase is ready */
                !loading && firebaseReady && (
                  <motion.button
                    onClick={handleAuthClick}
                    className="bg-[#D4A574] hover:bg-[#B8935F] text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                    // whileHover={{ scale: 1.05 }}
                    // whileTap={{ scale: 0.95 }}
                  >
                    Masuk
                  </motion.button>
                )
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-gray-200 hover:text-white hover:bg-[#3D2418]"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#1F120C] border-t border-gray-800">
                {/* Navigation Links */}
                {["Home", "Category", "Event"].map((item, index) => (
                  <motion.a
                    key={item}
                    href="#"
                    className="text-gray-200 hover:text-white hover:bg-[#2C1810] block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    // whileHover={{ x: 10 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.a>
                ))}

                {/* User Section */}
                {firebaseError ? (
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex items-center px-3 py-2 text-yellow-400">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Authentication Error</span>
                    </div>
                  </div>
                ) : user ? (
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex items-center px-3 py-2">
                      <div className="w-8 h-8 bg-[#D4A574] rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {user.name || user.username}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <button
                        onClick={handleDashboardClick}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-[#2C1810] rounded-md transition-colors"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => window.location.href = '/profile'}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-[#2C1810] rounded-md transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => window.location.href = '/settings'}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-200 hover:text-white hover:bg-[#2C1810] rounded-md transition-colors"
                      >
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Login Button - Only show if not loading and Firebase is ready */
                  !loading && firebaseReady && (
                    <motion.button
                      onClick={handleAuthClick}
                      className="w-full bg-[#D4A574] hover:bg-[#B8935F] text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                      // whileHover={{ x: 10 }}
                    >
                      Masuk
                    </motion.button>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
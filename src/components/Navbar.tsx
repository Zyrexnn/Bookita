"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#2C1810] text-white shadow-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">Bookkita</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#"
                className="text-gray-200 hover:text-white hover:bg-[#3D2418] px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-white hover:bg-[#3D2418] px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Category
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-white hover:bg-[#3D2418] px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Event
              </a>
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
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#1F120C] border-t border-gray-800">
              <a
                href="#"
                className="text-gray-200 hover:text-white hover:bg-[#2C1810] block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-white hover:bg-[#2C1810] block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Category
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-white hover:bg-[#2C1810] block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Event
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
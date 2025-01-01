"use client";
import React, { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Features", href: "/features" },
    { title: "Pricing", href: "/pricing" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Main Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-600">Logo</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-gray-900 hover:text-gray-700"
                >
                  {link.title}
                </Link>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-gray-900 hover:text-gray-700">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-900 p-2"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out md:hidden z-50 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-xl font-bold text-indigo-600">Logo</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="py-4">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.title}
                <ChevronRight className="ml-auto h-5 w-5" />
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <Link
              href="/login"
              className="block w-full mb-2 text-center text-gray-900 hover:text-gray-700 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="block w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-center"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  Home,
  LayoutGrid,
  Mail,
  Info,
  CreditCard,
  ChevronRight,
  User,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const navLinks = [
    { title: "Home", href: "/", icon: Home },
    { title: "Features", href: "/features", icon: LayoutGrid },
    { title: "Pricing", href: "/pricing", icon: CreditCard },
    { title: "About", href: "/about", icon: Info },
    { title: "Contact", href: "/contact", icon: Mail },
  ];

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("mobile-sidebar");
      if (sidebar && !sidebar.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors duration-200 mr-2"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/" className="flex-shrink-0">
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Logo
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <nav className="flex items-center space-x-1 mr-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-violet-600 rounded-lg transition-colors duration-200"
                  >
                    <link.icon className="h-4 w-4 mr-1.5" />
                    <span>{link.title}</span>
                  </Link>
                ))}
              </nav>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3 ml-4 border-l pl-4">
                <Link
                  href="/login"
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all duration-200"
                >
                  <LogIn className="h-4 w-4 mr-1.5" />
                  <span>Sign in</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center px-4 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  <span>Register</span>
                </Link>
              </div>
            </div>

            {/* Mobile Right Icons */}
            <div className="flex items-center space-x-2 md:hidden">
              {isLoggedIn ? (
                <>
                  <button className="p-2 text-gray-600 hover:text-violet-600 rounded-lg">
                    <Bell className="h-6 w-6" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-violet-600 rounded-lg">
                    <User className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="p-2 text-gray-600 hover:text-violet-600 rounded-lg"
                >
                  <LogIn className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 ${
          isSidebarOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        {/* Mobile Sidebar */}
        <div
          id="mobile-sidebar"
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Logo
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Profile Section (if logged in) */}
          {isLoggedIn && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">John Doe</div>
                  <div className="text-sm text-gray-500">john@example.com</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="px-4 py-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="flex items-center px-3 py-3 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <link.icon className="h-5 w-5 mr-3" />
                  <span>{link.title}</span>
                  <ChevronRight className="ml-auto h-5 w-5" />
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            {!isLoggedIn ? (
              <div className="mt-6 space-y-2 px-3">
                <Link
                  href="/login"
                  className="flex items-center w-full px-3 py-3 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <LogIn className="h-5 w-5 mr-3" />
                  <span>Sign in</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center w-full px-3 py-3 text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors duration-200"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <UserPlus className="h-5 w-5 mr-3" />
                  <span>Register</span>
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-2 px-3">
                <Link
                  href="/settings"
                  className="flex items-center w-full px-3 py-3 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors duration-200"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    // Handle logout
                    setIsSidebarOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <div className="text-sm text-gray-500 text-center">
              © 2024 Your Company. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronRight,
  UserCircle,
  LogOut,
  Settings,
  User,
} from "lucide-react";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Features", href: "/features" },
    { title: "Pricing", href: "/pricing" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  // Function to check login status and update user data
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token); // Fetch user data if token exists
    } else {
      setIsLoggedIn(false);
      setUser(null); // Reset user state if no token
    }
  };

  // Fetch user data using token
  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch("http://localhost:4000/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        // Handle error when token is invalid or expired
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // Handle logout
 const handleLogout = async () => {
   try {
     const token = localStorage.getItem("token");
     await fetch("http://localhost:4000/users/logout", {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });
     localStorage.removeItem("token");
     setIsLoggedIn(false);
     setUser(null);
     router.push("/"); // Redirect to login page
     window.location.reload(); // Refresh the page
   } catch (error) {
     console.error("Logout failed:", error);
   }
 };

  // User Dropdown component
  const UserDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <UserCircle className="h-6 w-6" />
        <span>{user?.fullname?.firstname || "User"}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    // Check login status when the component mounts
    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus(); // Recheck login status if localStorage changes
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

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

            {/* Desktop Auth/User Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <UserDropdown />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-900 hover:text-gray-700"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Register
                  </Link>
                </>
              )}
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
            {isLoggedIn ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block w-full text-center text-gray-900 hover:text-gray-700 py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block w-full text-center text-gray-900 hover:text-gray-700 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

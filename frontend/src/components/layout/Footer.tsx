// components/layout/Footer.tsx
import React from "react";
import Link from "next/link";

const Footer = () => {
  const footerLinks = {
    Product: [
      { title: "Features", href: "/features" },
      { title: "Pricing", href: "/pricing" },
      { title: "About", href: "/about" },
    ],
    Company: [
      { title: "About Us", href: "/about" },
      { title: "Careers", href: "/careers" },
      { title: "Contact", href: "/contact" },
    ],
    Resources: [
      { title: "Blog", href: "/blog" },
      { title: "Documentation", href: "/docs" },
      { title: "Help Center", href: "/help" },
    ],
    Legal: [
      { title: "Privacy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
      { title: "Security", href: "/security" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="max-w-md mb-8">
            <h3 className="text-white font-semibold mb-4">
              Subscribe to our newsletter
            </h3>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo & Social Links */}
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link href="/" className="text-2xl font-bold text-white">
                Logo
              </Link>
              <div className="flex items-center space-x-4">
                <a href="#" className="hover:text-white">
                  Twitter
                </a>
                <a href="#" className="hover:text-white">
                  Facebook
                </a>
                <a href="#" className="hover:text-white">
                  Instagram
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-sm">
              <p>
                &copy; {new Date().getFullYear()} Your Company. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

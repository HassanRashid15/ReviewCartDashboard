// app/dashboard/layout.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  FolderKanban,
  Calendar,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const sidebarLinks = [
    { icon: Home, name: "Dashboard", href: "/dashboard" },
    { icon: Calendar, name: "Calendar", href: "/dashboard/calendar" },
    { icon: MessageSquare, name: "Messages", href: "/dashboard/messages" },
  ];

  const notifications = [
    {
      id: 1,
      title: "New Message",
      description: "You have a new message",
      time: "5m ago",
    },
    {
      id: 2,
      title: "Meeting Reminder",
      description: "Team meeting in 30 minutes",
      time: "30m ago",
    },
    {
      id: 3,
      title: "Task Update",
      description: "Project deadline updated",
      time: "1h ago",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 z-30`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b">
            <span className="text-2xl font-bold text-indigo-600">
              Dashboard
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <link.icon className="h-5 w-5 mr-3" />
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Bottom Links */}
          <div className="p-4 border-t">
            <Link
              href="/dashboard/settings"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
            <Link
              href="/help"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              Help Center
            </Link>
            <button className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="text-gray-600 hover:text-gray-900 relative"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-2 hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-2">
              <img
                src="/api/placeholder/32/32"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-900">
                John Doe
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

// app/dashboard/page.tsx
"use client";
import React from "react";
import { BarChart2, Users, Clock, CheckCircle } from "lucide-react";

const DashboardPage = () => {
  const stats = [
    {
      title: "Total Projects",
      value: "45",
      change: "+12.5%",
      icon: BarChart2,
    },
    {
      title: "Team Members",
      value: "12",
      change: "+2.4%",
      icon: Users,
    },
    {
      title: "Hours Logged",
      value: "284",
      change: "+8.2%",
      icon: Clock,
    },
    {
      title: "Tasks Complete",
      value: "94%",
      change: "+5.1%",
      icon: CheckCircle,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "Sarah Connor",
      action: "completed",
      target: "Project Overview",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: "John Smith",
      action: "updated",
      target: "Design Tasks",
      time: "4 hours ago",
    },
    {
      id: 3,
      user: "Emily Brown",
      action: "commented on",
      target: "Marketing Strategy",
      time: "5 hours ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <stat.icon className="h-8 w-8 text-indigo-600" />
              <span className="text-green-600 text-sm">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">
              {stat.value}
            </h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;

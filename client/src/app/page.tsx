// app/page.tsx
import React from "react";
import { ChevronRight, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // Features data
  const features = [
    {
      title: "Easy Integration",
      description:
        "Seamlessly integrate with your existing workflows and tools.",
    },
    {
      title: "Real-time Analytics",
      description:
        "Get instant insights with our powerful analytics dashboard.",
    },
    {
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security to keep your data safe and protected.",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO at TechCorp",
      content:
        "This platform has transformed how we manage our projects. Highly recommended!",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      content:
        "The best solution we've found for our team's collaboration needs.",
    },
    {
      name: "Emma Davis",
      role: "Team Lead",
      content:
        "Incredibly intuitive and powerful. It's been a game-changer for us.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Build Better <span className="text-indigo-600">Solutions</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Empower your team with the tools they need to succeed. Streamline
              workflows, boost productivity, and achieve better results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/signup"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 inline-flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/demo"
                className="text-gray-900 px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you take control of your projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by teams everywhere
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and take your business to
              new heights
            </p>
            <Link
              href="/signup"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 inline-flex items-center gap-2"
            >
              Get Started Now <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

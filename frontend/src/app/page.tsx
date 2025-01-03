import React from "react";
import {
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Shield,
  Activity,
  User,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Easy Integration",
      description:
        "Seamlessly integrate with your existing workflows and tools.",
      icon: Users,
      color: "indigo",
      gradient: "from-indigo-600 to-indigo-400",
    },
    {
      title: "Real-time Analytics",
      description:
        "Get instant insights with our powerful analytics dashboard.",
      icon: Activity,
      color: "purple",
      gradient: "from-purple-600 to-purple-400",
    },
    {
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security to keep your data safe and protected.",
      icon: Shield,
      color: "blue",
      gradient: "from-blue-600 to-blue-400",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO at TechCorp",
      content:
        "This platform has transformed how we manage our projects. Highly recommended!",
      rating: 5,
      bgColor: "bg-indigo-500",
      initials: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      content:
        "The best solution we've found for our team's collaboration needs.",
      rating: 5,
      bgColor: "bg-purple-500",
      initials: "MC",
    },
    {
      name: "Emma Davis",
      role: "Team Lead",
      content:
        "Incredibly intuitive and powerful. It's been a game-changer for us.",
      rating: 5,
      bgColor: "bg-blue-500",
      initials: "ED",
    },
  ];

  const AvatarComponent = ({ initials, bgColor }: any) => (
    <div
      className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center text-white font-bold text-lg`}
    >
      {initials}
    </div>
  );

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-indigo-50">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Build Better{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Empower your team with the tools they need to succeed. Streamline
              workflows, boost productivity, and achieve better results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/signup"
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200 inline-flex items-center justify-center gap-2 text-lg font-medium"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="text-gray-900 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-indigo-600 hover:bg-white hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2 text-lg font-medium"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you take control of your projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r ${feature.gradient}`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 relative">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Trusted by teams everywhere
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <AvatarComponent
                    initials={testimonial.initials}
                    bgColor={testimonial.bgColor}
                  />
                  <div>
                    <p className="font-bold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-20 transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
              Join thousands of satisfied customers and take your business to
              new heights
            </p>
            <Link
              href="/signup"
              className="group bg-white text-indigo-600 px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-indigo-700/20 transition-all duration-200 inline-flex items-center gap-2 text-lg font-medium"
            >
              Get Started Now
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

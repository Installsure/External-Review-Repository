import React, { useState } from 'react';
import { Shield, Heart, Scale, Sparkles, ChevronRight, UserPlus, LogIn } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const values = [
    {
      icon: Heart,
      title: 'Consent',
      description:
        'Every interaction built on clear, enthusiastic consent with multi-layer approval workflows.',
    },
    {
      icon: Shield,
      title: 'Safety',
      description:
        'Advanced safety monitoring and emergency protocols to protect all platform members.',
    },
    {
      icon: Scale,
      title: 'Legal',
      description:
        'Full compliance with regulations, proper documentation, and transparent practices.',
    },
    {
      icon: Sparkles,
      title: 'Empowerment',
      description:
        'Creators maintain full control over their content, pricing, and business decisions.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-inter">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Compliance Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-inter text-sm text-amber-800">
            Demo Platform • Non-explicit placeholder • Integrate KYC/age verification + Stripe in
            production
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="w-full bg-white border-b border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-playfair font-bold text-2xl text-black">FF4U</div>
          <div className="flex items-center space-x-4">
            <a
              href="/auth/login"
              className="font-inter text-sm text-black hover:text-gray-600 transition-colors flex items-center"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </a>
            <a
              href="/auth/register"
              className="bg-black text-white font-inter font-semibold text-sm px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors flex items-center"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-playfair font-medium text-4xl md:text-6xl lg:text-7xl text-black leading-tight mb-6">
            Fantasy Films For You
          </h1>
          <p className="font-inter text-lg md:text-xl text-[#4D4D4D] leading-7 mb-8 max-w-2xl mx-auto">
            A safety-first adult entertainment platform built on consent, empowerment, and legal
            compliance. Where creators control their content and clients experience ethical fantasy
            fulfillment.
          </p>

          {/* Newsletter Signup */}
          <div className="flex flex-col sm:flex-row max-w-md mx-auto mb-8 space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
            />
            <button className="bg-black text-white font-inter font-semibold text-sm px-6 py-3 rounded-sm hover:bg-gray-800 transition-colors whitespace-nowrap">
              Stay Updated
            </button>
          </div>

          <p className="font-inter text-xs text-[#4D4D4D]">
            Join our waitlist to be notified when we launch
          </p>
        </div>
      </section>

      {/* Platform Values */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair font-medium text-3xl md:text-4xl text-black mb-4">
              Our Core Values
            </h2>
            <div className="w-20 h-px bg-black mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                    <IconComponent className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="font-inter font-semibold text-lg text-black mb-3">
                    {value.title}
                  </h3>
                  <p className="font-inter text-sm text-[#4D4D4D] leading-6">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair font-medium text-3xl md:text-4xl text-black mb-4">
              Safety-First Process
            </h2>
            <div className="w-20 h-px bg-black mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-inter font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="font-inter font-semibold text-lg text-black mb-3">
                Consent & Verification
              </h3>
              <p className="font-inter text-sm text-[#4D4D4D] leading-6">
                All content requires multi-layer consent approval from creators, safety officers,
                and moderators before publication.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-inter font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="font-inter font-semibold text-lg text-black mb-3">
                Safety Monitoring
              </h3>
              <p className="font-inter text-sm text-[#4D4D4D] leading-6">
                Advanced monitoring systems and emergency protocols ensure all interactions remain
                safe and consensual.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-inter font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="font-inter font-semibold text-lg text-black mb-3">
                Ethical Transactions
              </h3>
              <p className="font-inter text-sm text-[#4D4D4D] leading-6">
                Transparent pricing, secure payments, and fair revenue sharing with full creator
                control over their business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-playfair font-medium text-3xl md:text-4xl mb-6">
            Ready to Join FF4U?
          </h2>
          <p className="font-inter text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're a creator looking for a safe platform or a client seeking ethical
            entertainment, we're building something better together.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/auth/register?role=performer"
              className="bg-white text-black font-inter font-semibold text-sm px-8 py-4 rounded-sm hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Join as Creator
              <ChevronRight className="w-4 h-4 ml-2" />
            </a>
            <a
              href="/auth/register?role=client"
              className="border border-white text-white font-inter font-semibold text-sm px-8 py-4 rounded-sm hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center"
            >
              Join as Client
              <ChevronRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8E8E8] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-playfair font-bold text-xl text-black mb-4 md:mb-0">FF4U</div>
            <div className="flex space-x-6">
              <a
                href="/legal"
                className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
              >
                Legal
              </a>
              <a
                href="/safety"
                className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
              >
                Safety
              </a>
              <a
                href="/contact"
                className="font-inter text-sm text-[#4D4D4D] hover:text-black transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#E8E8E8] text-center">
            <p className="font-inter text-xs text-[#4D4D4D]">
              © 2025 Fantasy Films For You. Safety-first adult entertainment platform.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .font-inter {
          font-family:
            'Inter',
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            'Roboto',
            sans-serif;
        }
        .font-playfair {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>
    </div>
  );
}

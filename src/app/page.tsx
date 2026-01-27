"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Bot,
  Camera,
  Globe,
  HeartHandshake,
  CreditCard,
  Award,
  Palette,
  HandHeart,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Play,
} from "lucide-react";

const heroImages = [
  "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1920&q=80",
  "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=1920&q=80",
  "https://images.unsplash.com/photo-1528396518501-b53b655eb9b3?w=1920&q=80",
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100/50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-emerald-700 transition">
              A
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              AIx<span className="text-emerald-600">Artisans</span>
            </span>
          </Link>
          <nav className="flex items-center gap-8">
            <Link
              href="/marketplace"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition hidden sm:block"
            >
              Marketplace
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero with Slideshow */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {heroImages.map((img, idx) => (
            <div
              key={img}
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform scale-105"
              style={{
                backgroundImage: `url('${img}')`,
                opacity: idx === currentSlide ? 1 : 0,
                zIndex: idx === currentSlide ? 1 : 0,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80 z-10" />

          <div className="relative z-20 text-center text-white px-6 max-w-5xl mx-auto mt-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-emerald-50">
                Empowering 10,000+ Artisans Worldwide
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
              Where Craft Meets
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300 block mt-2">
                Digital Innovation
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
              Bridge the gap between skilled artisans and the global
              marketplace. Powered by AI, driven by community, and built to
              preserve heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="group bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition shadow-xl shadow-emerald-900/20 flex items-center gap-2"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/marketplace"
                className="group bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition flex items-center gap-2"
              >
                Browse Creations
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? "w-8 bg-emerald-500"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Problem Statement - Refined */}
        <section className="py-24 px-6 bg-gray-50/50">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-3">
              The Challenge
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
              Bridging the Digital Divide
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed font-light">
              Talented craftspeople around the world possess incredible skills
              passed down through generations. Yet, limited digital literacy and
              access to markets threaten these art forms.
              <span className="block mt-4 font-medium text-gray-900">
                We&apos;re here to change that narrative.
              </span>
            </p>
          </div>
        </section>

        {/* Features Grid - Grid Layout with Cards */}
        <section className="py-24 px-6 bg-white relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-50/50 rounded-bl-full z-0 opacity-50" />

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-3">
                Platform Features
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h3>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Powerful tools designed specifically for the unique needs of
                artisanal businesses.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Bot className="w-6 h-6" />}
                title="Smart Content Assistant"
                description="Generate compelling product descriptions, social captions, and pricing suggestions with AI."
                color="bg-blue-50 text-blue-600"
              />
              <FeatureCard
                icon={<Camera className="w-6 h-6" />}
                title="Visual Studio"
                description="Turn basic product photos into professional catalog-ready images with intelligent editing."
                color="bg-purple-50 text-purple-600"
              />
              <FeatureCard
                icon={<Globe className="w-6 h-6" />}
                title="Global Marketplace"
                description="List your products on a curated platform designed specifically for handmade goods."
                color="bg-emerald-50 text-emerald-600"
              />
              <FeatureCard
                icon={<HeartHandshake className="w-6 h-6" />}
                title="Skill-Sharing Network"
                description="Connect with volunteers who offer photography, design, and marketing expertise."
                color="bg-rose-50 text-rose-600"
              />
              <FeatureCard
                icon={<CreditCard className="w-6 h-6" />}
                title="Funding Support"
                description="Access crowdfunding tools to finance materials, equipment, or workshop expansion."
                color="bg-amber-50 text-amber-600"
              />
              <FeatureCard
                icon={<Award className="w-6 h-6" />}
                title="Verified Authenticity"
                description="Issue digital certificates proving the origin and authenticity of your handcrafted pieces."
                color="bg-indigo-50 text-indigo-600"
              />
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-24 px-6 bg-emerald-900 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          ></div>

          <div className="container mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block px-4 py-1 rounded-full bg-emerald-800 border border-emerald-700 text-emerald-300 text-sm font-medium mb-6">
                  Community Powered
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Volunteers Making a <br />
                  Real Difference
                </h2>
                <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
                  Connect with a passionate community of skilled professionals
                  volunteering their expertise. From photographers to marketers,
                  we work together to preserve cultural heritage.
                </p>
                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-300">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Professional Photography
                      </h4>
                      <p className="text-sm text-emerald-200/80">
                        Capture the details that matter
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-300">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Marketing Support
                      </h4>
                      <p className="text-sm text-emerald-200/80">
                        Tell your story to the world
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-300">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Business Mentorship
                      </h4>
                      <p className="text-sm text-emerald-200/80">
                        Grow with expert guidance
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/signup?role=volunteer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-900 px-8 py-4 rounded-full font-bold hover:bg-emerald-50 transition shadow-lg"
                >
                  Join as a Volunteer
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500/20 rounded-3xl blur-2xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&h=500&fit=crop&q=80"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-2xl relative z-10 w-full object-cover"
                />
                <div className="absolute -bottom-8 -left-8 bg-white text-gray-900 p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4 animate-bounce-subtle">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">500+</p>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                      Active Volunteers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Redesigned Cards */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-3">
                Getting Started
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Your Path to Impact
              </h3>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Whether you create, volunteer, or shop — getting started takes
                just minutes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Artisans Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Palette className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  For Creators
                </h3>
                <ol className="space-y-4">
                  <StepItem num={1}>Create your profile & share story</StepItem>
                  <StepItem num={2}>Upload AI-enhanced products</StepItem>
                  <StepItem num={3}>Connect with volunteer pros</StepItem>
                  <StepItem num={4}>Sell to a global audience</StepItem>
                </ol>
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <Link
                    href="/signup?role=artisan"
                    className="flex items-center text-rose-600 font-semibold hover:gap-2 transition-all"
                  >
                    Start Creating <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Volunteers Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <HandHeart className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  For Volunteers
                </h3>
                <ol className="space-y-4">
                  <StepItem num={1}>List your professional skills</StepItem>
                  <StepItem num={2}>Explore matching projects</StepItem>
                  <StepItem num={3}>
                    Collaborate directly with artisans
                  </StepItem>
                  <StepItem num={4}>Make a cultural impact</StepItem>
                </ol>
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <Link
                    href="/signup?role=volunteer"
                    className="flex items-center text-teal-600 font-semibold hover:gap-2 transition-all"
                  >
                    Start Volunteering <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Customers Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  For Shoppers
                </h3>
                <ol className="space-y-4">
                  <StepItem num={1}>Discover unique handicrafts</StepItem>
                  <StepItem num={2}>Learn the maker's story</StepItem>
                  <StepItem num={3}>Buy with verified authenticity</StepItem>
                  <StepItem num={4}>Preserve global traditions</StepItem>
                </ol>
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <Link
                    href="/marketplace"
                    className="flex items-center text-indigo-600 font-semibold hover:gap-2 transition-all"
                  >
                    Start Shopping <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pt-16 pb-10 px-6 bg-gray-900 text-white text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to Make an Impact?
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Join thousands of artisans, volunteers, and conscious shoppers
              building a more connected creative economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-lg"
              >
                Join the Community
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 text-gray-600">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 block">
                  AIxArtisans
                </span>
                <p className="text-xs text-gray-500">
                  Empowering creators globally
                </p>
              </div>
            </div>
            <div className="flex gap-8 text-sm font-medium">
              <Link
                href="/marketplace"
                className="hover:text-emerald-600 transition"
              >
                Marketplace
              </Link>
              <Link href="/about" className="hover:text-emerald-600 transition">
                About
              </Link>
              <Link href="/login" className="hover:text-emerald-600 transition">
                Sign In
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} AIxArtisans. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-gray-100 group">
      <div
        className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function StepItem({
  num,
  children,
}: {
  num: number;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4 items-start">
      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mt-0.5 shrink-0">
        {num}
      </div>
      <span className="text-gray-600 text-sm font-medium leading-relaxed">
        {children}
      </span>
    </li>
  );
}

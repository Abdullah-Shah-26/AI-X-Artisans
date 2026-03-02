"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Palette,
  HandHeart,
  ShoppingBag,
  ArrowRight,
  Camera,
  Globe,
  HeartHandshake,
} from "lucide-react";

// Professional custom icons
const SparklesIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
  </svg>
);

const ImageIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const WalletIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const heroImages = [
  "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1920&q=80",
  "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=1920&q=80",
  "https://images.unsplash.com/photo-1528396518501-b53b655eb9b3?w=1920&q=80",
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Scroll listener to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      // Hero section is roughly viewport height, after that we're on light backgrounds
      const heroHeight = window.innerHeight;
      setIsScrolled(window.scrollY > heroHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    const elementsToAnimate = document.querySelectorAll(".scroll-animate");
    elementsToAnimate.forEach((el) => observer.observe(el));

    return () => {
      elementsToAnimate.forEach((el) => el.classList.remove("animate-in"));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <header className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-[1400px] transition-all duration-300">
        <div
          className={`backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-xl px-4 md:px-6 py-3 md:py-4 transition-all duration-300 ${
            isScrolled
              ? "bg-white/70 border border-gray-900/20"
              : "bg-white/10 border border-white/40"
          }`}
        >
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center group-hover:opacity-80 transition">
                <img
                  src="/image.png"
                  alt="AIxArtisans Logo"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <span
                className={`text-base md:text-xl font-bold tracking-tight drop-shadow-lg transition-colors duration-300 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                AIx
                <span
                  className={
                    isScrolled ? "text-emerald-600" : "text-emerald-400"
                  }
                >
                  Artisans
                </span>
              </span>
            </Link>
            <nav className="flex items-center gap-3 md:gap-6">
              <Link
                href="/marketplace"
                className={`text-sm font-medium transition hidden sm:block drop-shadow-md ${
                  isScrolled
                    ? "text-gray-700 hover:text-emerald-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                Marketplace
              </Link>
              <Link
                href="/login"
                className={`text-sm font-medium transition hidden sm:block drop-shadow-md ${
                  isScrolled
                    ? "text-gray-700 hover:text-emerald-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 border border-white/20"
              >
                Get Started
              </Link>
            </nav>
          </div>
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs md:text-sm font-medium text-emerald-50">
                Empowering 10,000+ Artisans Worldwide
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Where Craft Meets
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300 block mt-2">
                Digital Innovation
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Bridge the gap between skilled artisans and the global
              marketplace. Powered by AI, driven by community, and built to
              preserve heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/signup"
                className="bg-emerald-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-emerald-700 transition-colors duration-300 shadow-xl shadow-emerald-900/20 flex items-center gap-2"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/marketplace"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-white/20 transition-colors duration-300 flex items-center gap-2"
              >
                Browse Creations
                <ShoppingBag className="w-4 h-4" />
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
        <section className="py-12 md:py-16 px-6 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto max-w-4xl text-center scroll-animate">
            <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-2">
              The Challenge
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              Bridging the Digital Divide
            </h3>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Talented craftspeople around the world possess incredible skills
              passed down through generations. Yet, limited digital literacy and
              access to markets threaten these art forms.
              <span className="block mt-3 font-semibold text-gray-900">
                We&apos;re here to change that narrative.
              </span>
            </p>
          </div>
        </section>

        {/* Features Grid - Grid Layout with Cards */}
        <section className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-10 md:mb-12 scroll-animate">
              <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-2">
                Platform Features
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Everything You Need to Succeed
              </h3>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Powerful tools designed specifically for the unique needs of
                artisanal businesses.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              <div
                className="scroll-animate"
                style={{ transitionDelay: "100ms" }}
              >
                <FeatureCard
                  icon={<SparklesIcon />}
                  title="Smart Content Assistant"
                  description="Generate compelling product descriptions, social captions, and pricing suggestions with AI."
                  color="bg-blue-50 text-blue-600"
                />
              </div>
              <div
                className="scroll-animate"
                style={{ transitionDelay: "200ms" }}
              >
                <FeatureCard
                  icon={<ImageIcon />}
                  title="Visual Studio"
                  description="Turn basic product photos into professional catalog-ready images with intelligent editing."
                  color="bg-purple-50 text-purple-600"
                />
              </div>
              <div
                className="scroll-animate"
                style={{ transitionDelay: "300ms" }}
              >
                <FeatureCard
                  icon={<GlobeIcon />}
                  title="Global Marketplace"
                  description="List your products on a curated platform designed specifically for handmade goods."
                  color="bg-emerald-50 text-emerald-600"
                />
              </div>
              <div
                className="scroll-animate"
                style={{ transitionDelay: "400ms" }}
              >
                <FeatureCard
                  icon={<UsersIcon />}
                  title="Skill-Sharing Network"
                  description="Connect with volunteers who offer photography, design, and marketing expertise."
                  color="bg-rose-50 text-rose-600"
                />
              </div>
              <div
                className="scroll-animate"
                style={{ transitionDelay: "500ms" }}
              >
                <FeatureCard
                  icon={<WalletIcon />}
                  title="Funding Support"
                  description="Access crowdfunding tools to finance materials, equipment, or workshop expansion."
                  color="bg-amber-50 text-amber-600"
                />
              </div>
              <div
                className="scroll-animate"
                style={{ transitionDelay: "600ms" }}
              >
                <FeatureCard
                  icon={<ShieldCheckIcon />}
                  title="Verified Authenticity"
                  description="Issue digital certificates proving the origin and authenticity of your handcrafted pieces."
                  color="bg-indigo-50 text-indigo-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-12 md:py-16 px-6 bg-emerald-900 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          ></div>

          <div className="container mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
              <div className="scroll-animate">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-800 border border-emerald-700 text-emerald-300 text-xs font-medium mb-3">
                  Community Powered
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  Volunteers Making a <br />
                  Real Difference
                </h2>
                <p className="text-sm md:text-base text-emerald-100 mb-5 leading-relaxed">
                  Connect with a passionate community of skilled professionals
                  volunteering their expertise. From photographers to marketers,
                  we work together to preserve cultural heritage.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-300">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">
                        Professional Photography
                      </h4>
                      <p className="text-xs text-emerald-200/80">
                        Capture the details that matter
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-300">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">
                        Marketing Support
                      </h4>
                      <p className="text-xs text-emerald-200/80">
                        Tell your story to the world
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-300">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">
                        Business Mentorship
                      </h4>
                      <p className="text-xs text-emerald-200/80">
                        Grow with expert guidance
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/signup?role=volunteer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-900 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-emerald-50 transition shadow-lg"
                >
                  Join as a Volunteer
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div
                className="relative scroll-animate"
                style={{ transitionDelay: "200ms" }}
              >
                <div className="absolute -inset-4 bg-emerald-500/20 rounded-3xl blur-2xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&h=500&fit=crop&q=80"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-2xl relative z-10 w-full object-cover"
                />
                <div className="absolute -bottom-5 -left-5 bg-white text-gray-900 p-3 rounded-xl shadow-xl z-20 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-600">500+</p>
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
        <section className="py-12 md:py-16 px-6 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto">
            <div className="text-center mb-10 md:mb-12 scroll-animate">
              <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-2">
                Getting Started
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Your Path to Impact
              </h3>
              <p className="text-gray-700 text-sm md:text-base max-w-2xl mx-auto">
                Whether you create, volunteer, or shop — getting started takes
                just minutes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 md:gap-6">
              {/* Artisans Card */}
              <div
                className="bg-white rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-rose-100 scroll-animate"
                style={{ transitionDelay: "100ms" }}
              >
                <div className="w-11 h-11 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  For Creators
                </h3>
                <ol className="space-y-2.5">
                  <StepItem num={1}>Create your profile & share story</StepItem>
                  <StepItem num={2}>Upload AI-enhanced products</StepItem>
                  <StepItem num={3}>Connect with volunteer pros</StepItem>
                  <StepItem num={4}>Sell to a global audience</StepItem>
                </ol>
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <Link
                    href="/signup?role=artisan"
                    className="flex items-center gap-1 text-rose-600 font-semibold text-sm hover:text-rose-700 transition-colors"
                  >
                    Start Creating <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Volunteers Card */}
              <div
                className="bg-white rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-teal-100 scroll-animate"
                style={{ transitionDelay: "200ms" }}
              >
                <div className="w-11 h-11 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                  <HandHeart className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  For Volunteers
                </h3>
                <ol className="space-y-2.5">
                  <StepItem num={1}>List your professional skills</StepItem>
                  <StepItem num={2}>Explore matching projects</StepItem>
                  <StepItem num={3}>
                    Collaborate directly with artisans
                  </StepItem>
                  <StepItem num={4}>Make a cultural impact</StepItem>
                </ol>
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <Link
                    href="/signup?role=volunteer"
                    className="flex items-center gap-1 text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors"
                  >
                    Start Volunteering <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Customers Card */}
              <div
                className="bg-white rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-indigo-100 scroll-animate"
                style={{ transitionDelay: "300ms" }}
              >
                <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  For Shoppers
                </h3>
                <ol className="space-y-2.5">
                  <StepItem num={1}>Discover unique handicrafts</StepItem>
                  <StepItem num={2}>Learn the maker's story</StepItem>
                  <StepItem num={3}>Buy with verified authenticity</StepItem>
                  <StepItem num={4}>Preserve global traditions</StepItem>
                </ol>
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <Link
                    href="/marketplace"
                    className="flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors"
                  >
                    Start Shopping <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 md:py-12 px-6 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-center relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="container mx-auto max-w-3xl relative z-10 scroll-animate">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
              Ready to Make an Impact?
            </h2>
            <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
              Join thousands of artisans, volunteers, and conscious shoppers
              building a more connected creative economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="bg-white text-gray-900 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Join the Community
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-4 md:py-5 text-gray-600">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shadow-md">
                <img
                  src="/image.png"
                  alt="AIxArtisans Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-sm md:text-base font-bold text-gray-900 block">
                  AIxArtisans
                </span>
                <p className="text-xs text-gray-500 hidden md:block">
                  Empowering creators globally
                </p>
              </div>
            </div>
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm font-medium">
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
            <div className="text-xs md:text-sm text-gray-400">
              © {new Date().getFullYear()} AIxArtisans
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll Animation Styles */}
      <style jsx>{`
        .scroll-animate {
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 0.5s ease,
            transform 0.5s ease;
        }
        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
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
    <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div
        className={`w-11 h-11 ${color} rounded-lg flex items-center justify-center mb-4 shadow-sm`}
      >
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
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
    <li className="flex gap-3 items-start">
      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mt-0.5 shrink-0">
        {num}
      </div>
      <span className="text-gray-600 text-sm leading-relaxed">{children}</span>
    </li>
  );
}

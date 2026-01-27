"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/common/ImageUpload";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Clock,
  User as UserIcon,
  Quote,
  Package,
  Award,
  PenSquare,
  CheckCircle2,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "ARTISAN" | "VOLUNTEER" | "CUSTOMER";
  artisanProfile: {
    bio: string | null;
    location: string | null;
    craftTypes: string[];
    story: string | null;
    yearsOfExperience: number | null;
  } | null;
  volunteerProfile: {
    skills: string[];
    bio: string | null;
    projectsCompleted: number;
  } | null;
  customerProfile?: {
    address: string | null;
    city: string | null;
    pincode: string | null;
    phone: string | null;
  } | null;
  products: {
    id: string;
    name: string;
    price: number;
    image: string | null;
  }[];
}

// Demo data
const demoArtisan = {
  bio: "Master artisan specializing in traditional handcrafted goods.",
  location: "Jaipur, Rajasthan",
  craftTypes: ["Pottery", "Ceramics"],
  story: "My journey began in my grandfather's workshop.",
  yearsOfExperience: 12,
};

const demoVolunteer = {
  bio: "Passionate about empowering artisans through technology and digital marketing.",
  skills: [
    "Digital Marketing",
    "Photography",
    "Web Development",
    "Social Media",
  ],
  projectsCompleted: 8,
};

const demoProjects = [
  {
    id: "p1",
    name: "E-commerce Setup",
    artisan: "Lakshmi Devi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
  },
  {
    id: "p2",
    name: "Product Photography",
    artisan: "Ramesh Kumar",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  },
  {
    id: "p3",
    name: "Social Media Campaign",
    artisan: "Anita Sharma",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  },
];

const demoTestimonials = [
  {
    quote: "My products are now selling online. Income doubled!",
    artisan: "Lakshmi Devi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
  },
  {
    quote: "The photos made my pottery look professional!",
    artisan: "Ramesh Kumar",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  },
];

const demoProducts = [
  {
    id: "d1",
    name: "Handwoven Silk Saree",
    price: 15000,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300",
  },
];

export function ProfileClient({
  user,
  isDemo,
}: {
  user: User;
  isDemo?: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "favorites" | "settings"
  >("profile");

  const isVolunteer = user.role === "VOLUNTEER";
  const isCustomer = user.role === "CUSTOMER";
  const isArtisan = user.role === "ARTISAN";

  // Form state
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [bio, setBio] = useState(
    isVolunteer
      ? user.volunteerProfile?.bio || ""
      : user.artisanProfile?.bio || "",
  );
  const [location, setLocation] = useState(user.artisanProfile?.location || "");
  const [story, setStory] = useState(user.artisanProfile?.story || "");
  const [yearsExp, setYearsExp] = useState(
    user.artisanProfile?.yearsOfExperience?.toString() || "",
  );
  const [craftTypes, setCraftTypes] = useState(
    user.artisanProfile?.craftTypes?.join(", ") || "",
  );
  const [skills, setSkills] = useState(
    user.volunteerProfile?.skills?.join(", ") || "",
  );

  // Customer form state
  const [address, setAddress] = useState(user.customerProfile?.address || "");
  const [city, setCity] = useState(user.customerProfile?.city || "");
  const [pincode, setPincode] = useState(user.customerProfile?.pincode || "");
  const [phone, setPhone] = useState(user.customerProfile?.phone || "");

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          avatar: avatar || null,
          bio,
          location,
          story,
          yearsOfExperience: yearsExp ? parseInt(yearsExp) : null,
          craftTypes: craftTypes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || "Failed");
      }
    } catch {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  // Get profile data with demo fallbacks
  const volProfile = user.volunteerProfile || demoVolunteer;
  const artProfile = user.artisanProfile
    ? {
        bio: user.artisanProfile.bio || demoArtisan.bio,
        location: user.artisanProfile.location || demoArtisan.location,
        craftTypes: user.artisanProfile.craftTypes?.length
          ? user.artisanProfile.craftTypes
          : demoArtisan.craftTypes,
        story: user.artisanProfile.story || demoArtisan.story,
        yearsOfExperience:
          user.artisanProfile.yearsOfExperience ||
          demoArtisan.yearsOfExperience,
      }
    : demoArtisan;

  const products = user.products.length > 0 ? user.products : demoProducts;
  const showDemoProducts = user.products.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Profile
        </h1>
        {!isCustomer &&
          (!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          ))}
      </div>

      {/* Unified Professional Profile - Artisan & Volunteer */}
      {!isCustomer && (
        <div className="space-y-6">
          {/* Aesthetic Header */}
          {/* Aesthetic Header */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-800">
            <div className="p-8 relative">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-zinc-800 ring-4 ring-white dark:ring-zinc-800/50 overflow-hidden shadow-2xl">
                    {isEditing ? (
                      <ImageUpload
                        onUpload={setAvatar}
                        currentImage={avatar}
                        bucket="images"
                        folder="avatars"
                      />
                    ) : user.avatar ? (
                      <img
                        src={user.avatar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-4xl font-bold text-emerald-500">
                        {user.name[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left space-y-2">
                  {isEditing ? (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-4xl font-bold bg-transparent text-gray-900 dark:text-white border-b border-emerald-500 focus:outline-none w-full"
                    />
                  ) : (
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                      {user.name}
                      {isVolunteer && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      )}
                    </h1>
                  )}

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 dark:text-zinc-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      {user.email}
                    </span>
                    {isVolunteer && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-0.5 rounded-full text-xs border border-emerald-200 dark:border-emerald-500/20">
                        Verified Volunteer
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats Box */}
                <div className="flex items-center gap-8 bg-gray-50 dark:bg-zinc-800/30 px-6 py-4 rounded-2xl border border-gray-200 dark:border-zinc-800">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isVolunteer
                        ? volProfile.projectsCompleted
                        : products.length}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-semibold">
                      {isVolunteer ? "Projects" : "Products"}
                    </p>
                  </div>
                  {isArtisan && (
                    <>
                      <div className="w-px h-8 bg-gray-300 dark:bg-zinc-700"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {artProfile.yearsOfExperience}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-semibold">
                          Years
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-4 space-y-6">
              {/* About Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-4">
                  About
                </h3>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white p-3 text-sm"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-zinc-300 text-sm leading-relaxed">
                    {isVolunteer ? volProfile.bio : artProfile.bio}
                  </p>
                )}
              </div>

              {/* Attributes Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-5">
                {isArtisan && (
                  <>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Location
                      </h4>
                      {isEditing ? (
                        <input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-lg w-full text-gray-900 dark:text-white px-3 py-2 text-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-300 text-sm">
                          <MapPin className="w-4 h-4 text-emerald-500" />{" "}
                          {artProfile.location}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Specializations
                      </h4>
                      {isEditing ? (
                        <input
                          value={craftTypes}
                          onChange={(e) => setCraftTypes(e.target.value)}
                          className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-lg w-full text-gray-900 dark:text-white px-3 py-2 text-sm"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {artProfile.craftTypes.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-xs border border-emerald-200 dark:border-emerald-500/20"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Experience
                      </h4>
                      {isEditing ? (
                        <input
                          value={yearsExp}
                          onChange={(e) => setYearsExp(e.target.value)}
                          className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-lg w-full text-gray-900 dark:text-white px-3 py-2 text-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white text-sm font-medium">
                          <Clock className="w-4 h-4 text-emerald-500" />{" "}
                          {artProfile.yearsOfExperience} Years
                        </div>
                      )}
                    </div>
                  </>
                )}
                {isVolunteer && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                      Skills
                    </h4>
                    {isEditing ? (
                      <input
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-lg w-full text-gray-900 dark:text-white px-3 py-2 text-sm"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {volProfile.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs border border-blue-200 dark:border-blue-500/20"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* My Story (Artisan Only) */}
              {isArtisan && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-4">
                    My Story
                  </h3>
                  {isEditing ? (
                    <textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      rows={4}
                      className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white p-3 text-sm"
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-zinc-300 text-sm leading-relaxed italic border-l-2 border-emerald-500 pl-4">
                      {artProfile.story}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Products/Projects */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm min-h-[500px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
                    {isVolunteer ? "Completed Projects" : "Products"}
                  </h3>
                  <Link
                    href="#"
                    className="text-emerald-500 text-xs font-medium hover:text-emerald-400 transition"
                  >
                    View All →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isVolunteer
                    ? demoProjects.map((p) => (
                        <div
                          key={p.id}
                          className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-gray-200 dark:border-zinc-700/50 flex items-center gap-4"
                        >
                          <img
                            src={p.avatar}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium text-sm">
                              {p.name}
                            </p>
                            <p className="text-gray-500 dark:text-zinc-500 text-xs">
                              {p.artisan}
                            </p>
                          </div>
                        </div>
                      ))
                    : products.map((p) => (
                        <Link
                          key={p.id}
                          href={isDemo ? "#" : `/marketplace/${p.id}`}
                          className="group bg-gray-50 dark:bg-zinc-800/30 rounded-xl p-3 border border-gray-200 dark:border-zinc-800 hover:border-emerald-500/30 transition-all hover:bg-gray-100 dark:hover:bg-zinc-800/80"
                        >
                          <div className="aspect-square rounded-lg bg-gray-200 dark:bg-zinc-800 mb-3 overflow-hidden">
                            <img
                              src={p.image || "/placeholder.jpg"}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                          </div>
                          <h4 className="text-gray-900 dark:text-white font-medium text-sm mb-1 truncate">
                            {p.name}
                          </h4>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                            {formatPrice(p.price)}
                          </p>
                        </Link>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Professional Profile - Customer */}
      {isCustomer && (
        <div className="space-y-6">
          {/* Aesthetic Header */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-800">
            <div className="p-8 relative">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-zinc-800 ring-4 ring-white dark:ring-zinc-800/50 overflow-hidden shadow-xl">
                    {isEditing ? (
                      <ImageUpload
                        onUpload={setAvatar}
                        currentImage={avatar}
                        bucket="images"
                        folder="avatars"
                      />
                    ) : user.avatar ? (
                      <img
                        src={user.avatar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-3xl font-bold text-blue-500">
                        {user.name[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                  {isEditing ? (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-3xl font-bold bg-transparent text-gray-900 dark:text-white border-b border-blue-500 focus:outline-none w-full"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {user.name}
                    </h1>
                  )}
                  <p className="text-gray-500 dark:text-zinc-400 font-medium flex items-center justify-center md:justify-start gap-2">
                    {user.email}{" "}
                    <span className="text-blue-600 dark:text-blue-500 text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-500/10 rounded-full border border-blue-200 dark:border-blue-500/20">
                      Valued Customer
                    </span>
                  </p>
                </div>

                <div className="flex bg-gray-100 dark:bg-zinc-800/30 rounded-xl p-1 border border-gray-200 dark:border-zinc-800">
                  {[
                    { id: "profile", icon: UserIcon, label: "Profile" },
                    { id: "orders", icon: Package, label: "Orders" },
                    { id: "favorites", icon: Award, label: "Favorites" }, // Using Award as Heart equivalent or similar
                    { id: "settings", icon: PenSquare, label: "Settings" }, // Using PenSquare for settings momentarily or import Settings icon
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                          : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {activeTab === "profile" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
                      Personal Details
                    </h3>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-500 text-xs font-medium hover:text-blue-400"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-zinc-500 block mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-gray-900 dark:text-white text-sm"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-zinc-300 font-medium">
                          {user.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-zinc-500 block mb-1">
                        Email
                      </label>
                      <p className="text-gray-900 dark:text-zinc-300 font-medium">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-zinc-500 block mb-1">
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-gray-900 dark:text-white text-sm"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-zinc-300 font-medium">
                          {phone || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                    Shipping Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-zinc-500 block mb-1">
                        Address
                      </label>
                      {isEditing ? (
                        <input
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-gray-900 dark:text-white text-sm"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-zinc-300 font-medium">
                          {address || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-zinc-500 block mb-1">
                          City
                        </label>
                        {isEditing ? (
                          <input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-gray-900 dark:text-white text-sm"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-zinc-300 font-medium">
                            {city || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-zinc-500 block mb-1">
                          Pincode
                        </label>
                        {isEditing ? (
                          <input
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-gray-900 dark:text-white text-sm"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-zinc-300 font-medium">
                            {pincode || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-700 dark:text-zinc-300 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-500"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Recent Orders
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {[
                    {
                      id: "ORD-001",
                      product: "Handwoven Silk Saree",
                      price: 12500,
                      status: "Delivered",
                      date: "Dec 15, 2024",
                      image:
                        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100",
                    },
                    {
                      id: "ORD-002",
                      product: "Blue Pottery Vase",
                      price: 2800,
                      status: "In Transit",
                      date: "Dec 12, 2024",
                      image:
                        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=100",
                    },
                    {
                      id: "ORD-003",
                      product: "Brass Dhokra Elephant",
                      price: 3500,
                      status: "Processing",
                      date: "Dec 10, 2024",
                      image:
                        "https://coshal.com/cdn/shop/files/Dhokra_Brass_Elephant_With_Bells_CD88_4.png?v=1701164800&width=100",
                    },
                  ].map((order) => (
                    <div
                      key={order.id}
                      className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition"
                    >
                      <img
                        src={order.image}
                        className="w-16 h-16 rounded-xl object-cover bg-gray-100 dark:bg-zinc-800"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.product}
                        </p>
                        <p className="text-gray-500 dark:text-zinc-500 text-xs">
                          {order.id} • {order.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {formatPrice(order.price)}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${order.status === "Delivered" ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20" : "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/30 text-center">
                  <Link
                    href="/orders"
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View All Orders →
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "favorites" && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                  My Favorites
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      id: "1",
                      name: "Madhubani Painting",
                      price: 4500,
                      image:
                        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300",
                    },
                    {
                      id: "2",
                      name: "Silver Filigree Earrings",
                      price: 2200,
                      image:
                        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300",
                    },
                    {
                      id: "3",
                      name: "Wooden Carved Box",
                      price: 1500,
                      image:
                        "https://m.media-amazon.com/images/I/91rJ0saK2QL.jpg",
                    },
                    {
                      id: "4",
                      name: "Ceramic Vase",
                      price: 2500,
                      image:
                        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300",
                    },
                  ].map((item) => (
                    <Link
                      key={item.id}
                      href={`/marketplace/${item.id}`}
                      className="group block"
                    >
                      <div className="aspect-square bg-gray-100 dark:bg-zinc-800 rounded-xl overflow-hidden mb-2 relative">
                        <img
                          src={item.image}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <button className="absolute top-2 right-2 p-1.5 bg-white dark:bg-zinc-900 rounded-full text-red-500 shadow-sm">
                          <Award className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <p className="text-gray-900 dark:text-white text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        {formatPrice(item.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                    Account Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium text-sm">
                          Email Notifications
                        </p>
                        <p className="text-gray-500 dark:text-zinc-500 text-xs">
                          Receive order updates
                        </p>
                      </div>
                      <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium text-sm">
                          SMS Notifications
                        </p>
                        <p className="text-gray-500 dark:text-zinc-500 text-xs">
                          Receive delivery updates
                        </p>
                      </div>
                      <div className="w-10 h-6 bg-gray-200 dark:bg-zinc-700 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                  <h3 className="text-red-600 dark:text-red-400 font-bold text-sm mb-2">
                    Danger Zone
                  </h3>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

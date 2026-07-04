import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import AboutView from "./components/AboutView";
import ServicesView from "./components/ServicesView";
import PricingView from "./components/PricingView";
import ReviewsView from "./components/ReviewsView";
import FaqView from "./components/FaqView";
import LoginView from "./components/LoginView";
import SignupView from "./components/SignupView";
import ReservationView from "./components/ReservationView";
import MyPageView from "./components/MyPageView";
import AdminView from "./components/AdminView";
import { ActiveTab, User, Review, Booking } from "./types";
import { Sparkles, ShieldCheck, User as UserIcon } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("Basic Cleaning");
  const [reviews, setReviews] = useState<Review[]>([]);

  // Check if session exists in localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem("cleanexpert_session");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setCurrentUser(u);
        // If they were in admin tab and still admin, keep it
        if (u.role === "admin") {
          setActiveTab("admin");
        }
      } catch (err) {
        console.error("Error parsing saved session:", err);
      }
    }

    // Fetch initial reviews from server
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.reviews) {
            setReviews(data.reviews);
          }
        }
      } catch (err) {
        console.error("Error reading reviews from API:", err);
      }
    }
    fetchReviews();
  }, []);

  // Sync scroll on tab transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Handle Login API call
  const handleLogin = async (credentials: { email: string; password: string }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "로그인 처리에 실패했습니다.");
    }

    const userObj = data.user;
    setCurrentUser(userObj);
    localStorage.setItem("cleanexpert_session", JSON.stringify(userObj));

    // Redirect
    if (userObj.role === "admin") {
      setActiveTab("admin");
    } else {
      setActiveTab("home");
    }

    return userObj;
  };

  // Handle Signup API call
  const handleSignup = async (userData: any) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "회원가입 중 요류가 발생했습니다.");
    }

    const userObj = data.user;
    setCurrentUser(userObj);
    localStorage.setItem("cleanexpert_session", JSON.stringify(userObj));
    setActiveTab("home");

    return userObj;
  };

  // Handle Profile update
  const handleUpdateProfile = async (updatedData: any) => {
    if (!currentUser) throw new Error("로그인 세션이 만료되었습니다.");

    // Simulate updating session and sync
    const updatedUser: User = {
      ...currentUser,
      ...updatedData,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem("cleanexpert_session", JSON.stringify(updatedUser));
    return updatedUser;
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cleanexpert_session");
    setActiveTab("home");
  };

  // Handle Review posting
  const handleAddReview = async (reviewData: { userName: string; rating: number; comment: string }) => {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "리뷰 등록 도중 서버 에러가 발생했습니다.");
    }

    // Prepend to local reviews state
    setReviews((prev) => [data.review, ...prev]);
  };

  // Handle Booking creation API
  const handleBook = async (bookingData: any) => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "예약 접수 중 에러가 발생했습니다.");
    }

    return data.booking;
  };

  // Quick Switch Account Helper at the bottom right corner
  const handleQuickSwap = async (roleType: "user" | "admin") => {
    try {
      if (roleType === "user") {
        await handleLogin({ email: "user@cleanexpert.com", password: "user123" });
      } else {
        await handleLogin({ email: "admin@cleanexpert.com", password: "admin123" });
      }
    } catch (err) {
      console.error("Demo swap failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-primary/20 selection:text-primary">
      {/* Translucent Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main viewport with smooth layouts */}
      <main className="flex-grow">
        {activeTab === "home" && (
          <HomeView
            setActiveTab={setActiveTab}
            reviews={reviews}
            onSelectServiceType={setSelectedServiceType}
          />
        )}
        {activeTab === "about" && <AboutView />}
        {activeTab === "services" && (
          <ServicesView
            setActiveTab={setActiveTab}
            onSelectServiceType={setSelectedServiceType}
          />
        )}
        {activeTab === "pricing" && <PricingView setActiveTab={setActiveTab} />}
        {activeTab === "reservation" && (
          <ReservationView
            currentUser={currentUser}
            setActiveTab={setActiveTab}
            selectedServiceType={selectedServiceType}
            setSelectedServiceType={setSelectedServiceType}
            onBook={handleBook}
          />
        )}
        {activeTab === "reviews" && (
          <ReviewsView reviews={reviews} onAddReview={handleAddReview} />
        )}
        {activeTab === "faq" && <FaqView />}
        {activeTab === "login" && <LoginView setActiveTab={setActiveTab} onLogin={handleLogin} />}
        {activeTab === "signup" && (
          <SignupView setActiveTab={setActiveTab} onSignup={handleSignup} />
        )}
        {activeTab === "mypage" && (
          <MyPageView currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />
        )}
        {activeTab === "admin" && currentUser?.role === "admin" && <AdminView />}
      </main>

      {/* Elegant Floating Demo Account Switcher on Left Side (Unobtrusive) */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full border border-slate-200/80 shadow-lg group hover:bg-white transition-all duration-300">
        <div className="bg-primary/10 text-primary p-1.5 rounded-full">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
        </div>
        <div className="flex items-center space-x-1.5 text-[10px]">
          <span className="font-bold text-slate-500">체험 계정 전환:</span>
          <button
            onClick={() => handleQuickSwap("user")}
            className="px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
          >
            일반고객
          </button>
          <button
            onClick={() => handleQuickSwap("admin")}
            className="px-2 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold transition-colors"
          >
            최고관리자
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

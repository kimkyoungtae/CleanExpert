import React from "react";
import { Sparkles, User, LogOut, Menu, X, ShieldAlert } from "lucide-react";
import { ActiveTab, User as UserType } from "../types";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserType | null;
  onLogout: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: "home", label: "홈" },
    { id: "about", label: "소개" },
    { id: "services", label: "서비스" },
    { id: "pricing", label: "요금제" },
    { id: "reviews", label: "고객 후기" },
    { id: "faq", label: "FAQ" },
  ] as const;

  const navigateTo = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-slate-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigateTo("home")}
            id="header-logo"
          >
            <div className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-xl transition-all duration-300 shadow-md group-hover:scale-105">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-slate-900">
                Clean<span className="text-primary">Expert</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase -mt-1">
                Premium Cleaning
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => navigateTo(item.id)}
                className={`relative py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? "text-primary font-semibold"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Right Side (Auth / MyPage / Admin) */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                {currentUser.role === "admin" ? (
                  <button
                    id="nav-admin-dashboard"
                    onClick={() => navigateTo("admin")}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-all ${
                      activeTab === "admin" ? "ring-2 ring-rose-500 ring-offset-1" : ""
                    }`}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>관리 대시보드</span>
                  </button>
                ) : (
                  <button
                    id="nav-mypage"
                    onClick={() => navigateTo("mypage")}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all ${
                      activeTab === "mypage" ? "ring-2 ring-primary/40" : ""
                    }`}
                  >
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    <span>마이페이지</span>
                  </button>
                )}

                <div className="h-4 w-[1px] bg-slate-200" />

                <span className="text-sm font-medium text-slate-700">
                  <span className="font-semibold text-slate-900">{currentUser.name}</span>님
                </span>

                <button
                  id="nav-logout"
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="h-4 w-4" />
                </button>

                <button
                  id="nav-cta-booking"
                  onClick={() => navigateTo("reservation")}
                  className="ml-2 bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 active:scale-98"
                >
                  예약하기
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  id="nav-login"
                  onClick={() => navigateTo("login")}
                  className="text-slate-600 hover:text-primary text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  로그인
                </button>
                <button
                  id="nav-register"
                  onClick={() => navigateTo("signup")}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4.5 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  회원가입
                </button>
                <button
                  id="nav-cta-booking-unauth"
                  onClick={() => navigateTo("reservation")}
                  className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/10"
                >
                  예약하기
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {currentUser && currentUser.role === "admin" && (
              <button
                onClick={() => navigateTo("admin")}
                className="p-2 text-rose-600 bg-rose-50 rounded-xl"
              >
                <ShieldAlert className="h-4 w-4" />
              </button>
            )}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-700 bg-slate-100/80 rounded-xl hover:bg-slate-200/80 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-effect border-b border-slate-200/60 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-item-${item.id}`}
                onClick={() => navigateTo(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="h-[1px] bg-slate-200/60 my-3" />

            {currentUser ? (
              <div className="space-y-2 pt-1">
                <div className="px-4 py-2 flex justify-between items-center">
                  <span className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-800">{currentUser.name}</span>님 안녕하세요
                  </span>
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-1 text-xs text-rose-500 font-medium"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>로그아웃</span>
                  </button>
                </div>
                {currentUser.role === "admin" ? (
                  <button
                    id="mobile-nav-admin"
                    onClick={() => navigateTo("admin")}
                    className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-rose-50 text-rose-600 border border-rose-100"
                  >
                    관리 대시보드 이동
                  </button>
                ) : (
                  <button
                    id="mobile-nav-mypage"
                    onClick={() => navigateTo("mypage")}
                    className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700"
                  >
                    마이페이지 이동
                  </button>
                )}
                <button
                  id="mobile-nav-cta"
                  onClick={() => navigateTo("reservation")}
                  className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-primary text-white shadow-md"
                >
                  예약하기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  id="mobile-nav-login"
                  onClick={() => navigateTo("login")}
                  className="text-center py-3 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 bg-white"
                >
                  로그인
                </button>
                <button
                  id="mobile-nav-signup"
                  onClick={() => navigateTo("signup")}
                  className="text-center py-3 rounded-xl text-sm font-medium bg-slate-900 text-white"
                >
                  회원가입
                </button>
                <button
                  id="mobile-nav-cta-unauth"
                  onClick={() => navigateTo("reservation")}
                  className="col-span-2 text-center py-3.5 rounded-xl text-sm font-semibold bg-primary text-white shadow-md"
                >
                  지금 예약하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

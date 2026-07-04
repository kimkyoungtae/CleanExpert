import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  CalendarRange,
  CreditCard,
  Check,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  HelpCircle,
} from "lucide-react";
import { WHY_ITEMS, SERVICES_DATA, FAQ_ITEMS } from "../data";
import { ActiveTab, Review } from "../types";

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  reviews: Review[];
  onSelectServiceType: (type: string) => void;
}

export default function HomeView({
  setActiveTab,
  reviews,
  onSelectServiceType,
}: HomeViewProps) {
  // Reviews slider state
  const [reviewIndex, setReviewIndex] = useState(0);

  // FAQ expanded state
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Real-time counter to boost conversion rates
  const [waitingCount, setWaitingCount] = useState(3);

  useEffect(() => {
    // Dynamic countdown/up behavior to simulate live visitor queue
    const interval = setInterval(() => {
      setWaitingCount((prev) => {
        const isUp = Math.random() > 0.45; // slightly skewed to stay around 3-4
        let next = prev + (isUp ? 1 : -1);
        if (next < 2) next = 2;
        if (next > 5) next = 5;
        return next;
      });
    }, 14000);

    return () => clearInterval(interval);
  }, []);

  const nextReview = () => {
    setReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleBookService = (serviceTitle: string) => {
    onSelectServiceType(serviceTitle);
    setActiveTab("reservation");
  };

  // Why icons helper
  const getWhyIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="h-6 w-6 text-primary" />;
      case "CalendarRange":
        return <CalendarRange className="h-6 w-6 text-primary" />;
      case "CreditCard":
        return <CreditCard className="h-6 w-6 text-primary" />;
      default:
        return <Sparkles className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="w-full bg-slate-50 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-slate-900 overflow-hidden py-16">
        {/* Background Image with sophisticated dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?q=80&w=1600&auto=format&fit=crop"
            alt="Pristine bright living room cleaned by professional service"
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-[pulse_10s_infinite]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-white space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-primary animate-spin-slow" />
              <span className="text-xs font-semibold text-primary tracking-wide">
                Professional Home Cleaning
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              당신이 쉬는 동안,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                CleanExpert
              </span>
              가 집을 새것처럼.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              부드럽고 꼼꼼한 청소 전문가의 안심 가사 방문 서비스. 원하는 날짜와 시간을 선택하시면 100% 품질 보장형 맞춤 케어가 시작됩니다.
            </p>

            {/* Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
              {[
                "부드럽고 꼼꼼한 전문가의 방문 청소",
                "원하는 날짜와 시간 예약 가능",
                "100% 만족 품질 보장형 청소",
                "신속하고 간편한 예약 및 방문",
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-center space-x-2.5">
                  <div className="p-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">{bullet}</span>
                </div>
              ))}
            </div>

            {/* Real-time waiting badge */}
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-full w-fit animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-300">
                실시간 현황: 현재 <span className="font-bold text-emerald-400">{waitingCount}명</span>이 예약 신청 대기 중입니다
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <button
                id="hero-booking-btn"
                onClick={() => setActiveTab("reservation")}
                className="bg-primary hover:bg-primary/95 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-center flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>지금 예약하기</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="hero-services-btn"
                onClick={() => setActiveTab("services")}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base border border-white/20 backdrop-blur-sm transition-all text-center hover:border-white/30"
              >
                서비스 전체 보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why CleanExpert Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Why CleanExpert
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            왜 CleanExpert 인가요?
          </h2>
          <p className="text-slate-500 font-light text-sm sm:text-base">
            클린엑스퍼트만의 비교 불가능한 프리미엄 차별화 강점을 소개해드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-5"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                {getWhyIcon(item.iconName)}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800 text-base">{item.title}</h3>
                <p className="text-slate-500 font-light text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Services Catalog Slider/Grid */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Our Services
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                맞춤형 프리미엄 클리닝 서비스
              </h2>
              <p className="text-slate-500 font-light text-sm">
                공간의 성격과 관리 수준에 따라 최적의 청소 공법을 설계합니다.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("services")}
              className="text-primary hover:text-primary/90 text-sm font-semibold flex items-center space-x-1 hover:underline"
            >
              <span>모든 서비스 설명 보기</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES_DATA.map((service) => (
              <div
                key={service.id}
                className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex flex-col h-full group"
              >
                {/* Image panel */}
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    {service.price}
                  </div>
                </div>

                {/* Body panel */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900">
                        {service.title}
                      </h3>
                      <p className="text-xs text-primary font-medium mt-0.5">
                        {service.subtitle}
                      </p>
                    </div>
                    <p className="text-slate-500 font-light text-xs leading-relaxed line-clamp-3">
                      {service.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleBookService(service.title)}
                    className="w-full bg-white hover:bg-primary hover:text-white text-slate-700 text-xs font-bold py-3 px-4 rounded-xl border border-slate-200 hover:border-primary transition-all text-center flex items-center justify-center space-x-1"
                  >
                    <span>예약 접수하기</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. blue background Reservation Callout Section */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        {/* Background visual circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            오늘 예약하시면 가장 빠른 일정으로 방문 가능합니다.
          </h2>
          <p className="text-slate-100 font-light text-sm sm:text-base max-w-xl mx-auto">
            원하시는 일정의 예약이 가득 차기 전에 스마트하게 예약 프로세스를 완성해보세요. 예약 접수는 단 1분이면 편리하게 끝납니다.
          </p>
          <div className="pt-4 flex flex-col items-center space-y-3.5">
            {/* Live conversion nudge badge */}
            <div className="inline-flex items-center space-x-2 bg-white/15 border border-white/25 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>실시간: 현재 <strong className="text-white font-bold">{waitingCount}명</strong>의 고객이 예약을 준비하고 있습니다</span>
            </div>

            <button
              onClick={() => setActiveTab("reservation")}
              className="bg-white text-primary hover:bg-slate-50 font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-black/10 transition-transform active:scale-98"
            >
              간편 예약하러 가기
            </button>
          </div>
        </div>
      </section>

      {/* 5. Clean STEP Guide */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Process
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            이용 가이드 및 절차
          </h2>
          <p className="text-slate-500 font-light text-xs sm:text-sm">
            CleanExpert의 체계적인 청소 관리 절차를 순서대로 확인해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
          {[
            { step: "STEP 1", title: "예약 신청", desc: "원하는 서비스 및 일정을 스마트폰이나 PC로 단 1분 만에 접수합니다." },
            { step: "STEP 2", title: "예약 확정 및 배정", desc: "선택해주신 일정을 분석하여 당사의 엄선된 매칭 전담 전문가를 배정합니다." },
            { step: "STEP 3", title: "전문가 방문 청소", desc: "약속 드린 날짜와 정각 시간에 맞춤 도구를 지참한 클리너 마스터가 방문합니다." },
            { step: "STEP 4", title: "청소 완료 및 만족 체크", desc: "전체 구역 꼼꼼 청소 후 고객님의 검수를 통해 보완할 구역을 최종 완료합니다." },
            { step: "STEP 5", title: "힐링 라이프 시작", desc: "새집처럼 반짝거리는 쾌적한 보금자리에서 편안한 웰니스 휴식을 즐기세요." },
          ].map((item, idx) => (
            <div key={idx} className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-primary/70 bg-primary/5 px-2.5 py-1 rounded-full">
                  {item.step}
                </span>
                {idx < 4 && (
                  <span className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 text-slate-300 font-bold text-xl">
                    →
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                <p className="text-slate-500 font-light text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Customer Reviews Slider */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Testimonials
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              CleanExpert 리얼 고객 후기
            </h2>
          </div>

          <div className="relative bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm min-h-[220px] flex flex-col justify-between">
            <div className="space-y-6">
              {/* Star review icons */}
              <div className="flex items-center space-x-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 fill-current ${
                      i < (reviews[reviewIndex]?.rating || 5) ? "text-amber-400" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* Review Text comment */}
              <blockquote className="text-lg sm:text-xl text-slate-700 italic font-medium leading-relaxed">
                "{reviews[reviewIndex]?.comment}"
              </blockquote>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200/50">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 text-primary h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm">
                  {reviews[reviewIndex]?.userName.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">
                    {reviews[reviewIndex]?.userName} 고객님
                  </div>
                  <div className="text-[11px] text-slate-400">
                    실제 예약 이용자 후기
                  </div>
                </div>
              </div>

              {/* Slider Arrows */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevReview}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextReview}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Brief Section */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            자주 묻는 질문
          </h2>
          <p className="text-slate-500 font-light text-xs sm:text-sm">
            방문 청소 서비스를 이용하시기 전 가장 궁금해하시는 사항을 미리 정리해 두었습니다.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.slice(0, 3).map((item) => {
            const isExpanded = expandedFaq === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="font-semibold text-slate-800 text-sm sm:text-base flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>{item.question}</span>
                  </span>
                  {isExpanded ? (
                    <Minus className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <Plus className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-1 text-slate-500 text-xs sm:text-sm leading-relaxed border-t border-slate-50 font-light">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => setActiveTab("faq")}
            className="text-primary hover:text-primary/95 text-xs font-semibold inline-flex items-center space-x-1"
          >
            <span>자주 묻는 질문 전체 보기</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </section>

      {/* 8. Extra Premium Call-to-Action */}
      <section className="bg-slate-950 text-white py-24 relative overflow-hidden border-t border-slate-900">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1200&auto=format&fit=crop"
            alt="Sparkling clean interior decoration styling"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-10">
          <div className="space-y-4">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-display font-bold text-2xl tracking-tight uppercase">
              집안일은 끝이 없습니다.
            </h3>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              당신의 소중한 시간은 휴식에 쓰세요.
              <br />
              청소는 CleanExpert가 책임집니다.
            </h2>
          </div>

          <p className="text-slate-400 font-light text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            전문 장비와 숙련된 전문가가 만드는 완벽한 청결 지수 차이. 눈에 보이는 쾌적함을 넘어, 미세 유해 오염 물질까지 완전히 리프레쉬하여 온 가족이 안심하고 머무를 수 있는 청정 공간을 확보합니다.
          </p>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl max-w-md mx-auto space-y-3">
            <div className="text-xs font-mono font-semibold text-primary tracking-widest uppercase">
              예약은 단 1분
            </div>
            <p className="text-xs text-slate-300 font-light">
              원하는 날짜와 시간을 클릭으로 간편하게 지정하면 정해진 일정에 전문 마스터 클리너 매칭 매니저가 정확하게 찾아뵙습니다.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-300 font-semibold tracking-wide">
              깨끗한 집, 여유롭고 화창한 하루. 지금 바로 그 기쁨을 누리세요!
            </p>

            <div className="flex justify-center pb-2">
              <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-full text-xs font-semibold text-slate-300 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>실시간 현황: 현재 <strong className="text-emerald-400 font-bold">{waitingCount}명</strong> 예약 매칭 대기 중</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("reservation")}
              className="bg-primary hover:bg-primary/95 text-white font-bold px-10 py-4.5 rounded-xl text-base shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              지금 예약 신청하기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

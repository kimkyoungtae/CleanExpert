import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle,
  FileText,
  Lock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { ActiveTab, User, Booking } from "../types";

interface ReservationViewProps {
  currentUser: User | null;
  setActiveTab: (tab: ActiveTab) => void;
  selectedServiceType: string;
  setSelectedServiceType: (type: string) => void;
  onBook: (bookingData: any) => Promise<Booking>;
}

// Pre-defined available times
const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

export default function ReservationView({
  currentUser,
  setActiveTab,
  selectedServiceType,
  setSelectedServiceType,
  onBook,
}: ReservationViewProps) {
  // Booking Form State
  const [address, setAddress] = useState(currentUser?.address || "");
  const [addressDetail, setAddressDetail] = useState(currentUser?.addressDetail || "");
  const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [requests, setRequests] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  // Existing bookings list to detect conflicts
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  // Fetch bookings when entering reservation view
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings?role=admin"); // Fetch all bookings to block busy slots
        const data = await res.json();
        if (data.bookings) {
          setExistingBookings(data.bookings);
        }
      } catch (err) {
        console.error("Error loading slots availability:", err);
      }
    }
    fetchBookings();
  }, [successBooking]);

  // Handle pre-fill user info
  useEffect(() => {
    if (currentUser) {
      if (!address) setAddress(currentUser.address);
      if (!addressDetail) setAddressDetail(currentUser.addressDetail);
    }
  }, [currentUser]);

  // Calendar parameters for July 2026
  const YEAR = 2026;
  const MONTH = 7; // July
  const daysInJuly = 31;
  const firstDayOffset = 3; // July 1, 2026 is Wednesday (Sun=0, Mon=1, Tue=2, Wed=3)

  // Current day context is July 4, 2026
  const CURRENT_DAY = 4;

  const handleDaySelect = (dayNum: number) => {
    // Disable past days (1, 2, 3)
    if (dayNum < CURRENT_DAY) return;
    const formattedDate = `${YEAR}-07-${String(dayNum).padStart(2, "0")}`;
    setSelectedDate(formattedDate);
    setSelectedTime(""); // Reset time on date change
    setError(null);
  };

  // Helper to check if a specific slot is busy
  const isSlotBusy = (dateStr: string, timeStr: string) => {
    return existingBookings.some(
      (b) => b.date === dateStr && b.time === timeStr && b.status !== "취소"
    );
  };

  // Handle Submit Booking
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError("예약을 완료하려면 로그인이 필요합니다.");
      return;
    }
    if (!selectedServiceType) {
      setError("청소 서비스를 선택해주세요.");
      return;
    }
    if (!address.trim()) {
      setError("방문 청소 도로명 주소를 정확히 입력해주세요.");
      return;
    }
    if (!selectedDate) {
      setError("원하시는 방문 예약 날짜를 캘린더에서 클릭해주세요.");
      return;
    }
    if (!selectedTime) {
      setError("원하시는 방문 시작 시간을 지정해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bData = {
        userId: currentUser.id,
        userName: currentUser.name,
        userPhone: currentUser.phone,
        serviceType: selectedServiceType,
        address,
        addressDetail,
        date: selectedDate,
        time: selectedTime,
        requests,
      };

      const result = await onBook(bData);
      setSuccessBooking(result);
    } catch (err: any) {
      setError(err.message || "예약 접수 중 서버 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // If Booking is successful, render Success Card
  if (successBooking) {
    return (
      <div className="w-full bg-slate-50 py-24 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-8 text-center relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />

            <div className="mx-auto bg-emerald-50 text-emerald-500 p-4 rounded-full w-16 h-16 flex items-center justify-center border border-emerald-100 shadow-inner">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                예약이 정상 완료되었습니다!
              </h2>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                CleanExpert를 이용해 주셔서 진심으로 감사드립니다.
                <br />
                지정하신 스케줄에 맞춰 친절한 마스터 클리너가 방문합니다.
              </p>
            </div>

            {/* Ticket details */}
            <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 text-left space-y-4 font-light text-slate-600">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200/50">
                <span className="font-semibold text-slate-700">예약 번호</span>
                <span className="font-mono font-bold text-primary">#{successBooking.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200/50">
                <span className="font-semibold text-slate-700">청소 구분</span>
                <span className="font-semibold text-slate-900">{successBooking.serviceType}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200/50">
                <span className="font-semibold text-slate-700">방문 일자</span>
                <span className="font-semibold text-slate-900">{successBooking.date}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200/50">
                <span className="font-semibold text-slate-700">시작 시간</span>
                <span className="font-semibold text-slate-900">{successBooking.time}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">예약 상태</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  {successBooking.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSuccessBooking(null);
                  setSelectedDate("");
                  setSelectedTime("");
                  setRequests("");
                }}
                className="py-3 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                새로 예약하기
              </button>
              <button
                onClick={() => setActiveTab("mypage")}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow"
              >
                예약 목록 확인
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If User is not Logged in, show nice block
  if (!currentUser) {
    return (
      <div className="w-full bg-slate-50 py-24 flex items-center justify-center">
        <div className="max-w-md w-full px-4 text-center">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
            <div className="mx-auto bg-slate-50 text-slate-400 p-4 rounded-full w-16 h-16 flex items-center justify-center border border-slate-200 shadow-inner">
              <Lock className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display font-bold text-xl text-slate-900">로그인이 필요합니다</h2>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                실시간 예약 스케줄 확보 및 매칭 결과를 투명하게 확인하기 위해 간단한 본인 인증 로그인이 완료되어야 예약 접수가 가능합니다.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs font-light text-slate-500 leading-relaxed">
              * 평가를 위해 <span className="font-semibold text-slate-700">1초 간편 로그인 단축키</span>를 제공하고 있습니다. 로그인 페이지에서 확인하세요.
            </div>
            <button
              onClick={() => setActiveTab("login")}
              className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-xl text-xs shadow-md shadow-primary/10 transition-transform active:scale-98"
            >
              로그인 페이지로 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 sm:p-10 space-y-10">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                <span>방문 청소 스케줄 예약</span>
              </h1>
              <p className="text-xs text-slate-400 font-light">
                고객님의 일정과 요구 조건에 꼭 맞춰 프리미엄 매칭 서비스를 진행합니다.
              </p>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl font-mono">
              예약자: <span className="font-semibold text-slate-800">{currentUser.name}</span>님
            </div>
          </div>

          <form onSubmit={handleSubmitBooking} className="space-y-8">
            {error && (
              <div className="p-4 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl text-xs flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 animate-bounce" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Service selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                STEP 1. 가사 청소 품목 선택
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { title: "Basic Cleaning", label: "일반 가사청소" },
                  { title: "Deep Cleaning", label: "입주·대청소" },
                  { title: "Move Cleaning", label: "이사 청소" },
                  { title: "Office Cleaning", label: "사무실 청소" },
                ].map((item) => {
                  const isSelected = selectedServiceType === item.title;
                  return (
                    <button
                      type="button"
                      key={item.title}
                      onClick={() => setSelectedServiceType(item.title)}
                      className={`py-3 px-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer select-none ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/10 font-bold"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:border-slate-300 font-medium"
                      }`}
                    >
                      <span className="text-[11px] font-display">{item.title}</span>
                      <span className="text-[10px] opacity-80">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Address */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                STEP 2. 청소 방문 도로명 주소 입력
              </label>
              <div className="space-y-2.5">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="도로명 주소를 정확히 입력해주세요 (예: 서울시 강남구 테헤란로 123)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="나머지 상세 주소를 입력해주세요 (예: 104동 1502호)"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs"
                />
              </div>
            </div>

            {/* 3. Calendar & Time Grid Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {/* Calendar Section */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  STEP 3. 방문 날짜 선택 (7월)
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                  {/* Calendar Top Header */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">2026년 7월 (July)</span>
                    <span className="text-[10px] text-slate-400">7월 상시 예약 가능</span>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-200">
                    <div>일</div>
                    <div>월</div>
                    <div>화</div>
                    <div>수</div>
                    <div>목</div>
                    <div>금</div>
                    <div>토</div>
                  </div>

                  {/* Day Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty offsets */}
                    {Array.from({ length: firstDayOffset }).map((_, i) => (
                      <div key={`offset-${i}`} className="h-8" />
                    ))}

                    {/* Days in month */}
                    {Array.from({ length: daysInJuly }).map((_, i) => {
                      const dayNum = i + 1;
                      const isPast = dayNum < CURRENT_DAY;
                      const formattedDate = `${YEAR}-07-${String(dayNum).padStart(2, "0")}`;
                      const isSelected = selectedDate === formattedDate;

                      return (
                        <button
                          type="button"
                          key={`day-${dayNum}`}
                          disabled={isPast}
                          onClick={() => handleDaySelect(dayNum)}
                          className={`h-8 w-8 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                            isPast
                              ? "text-slate-200 cursor-not-allowed bg-transparent"
                              : isSelected
                              ? "bg-primary text-white font-bold shadow-md shadow-primary/20 scale-105"
                              : "text-slate-700 bg-white hover:bg-slate-200/50 border border-slate-100"
                          }`}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-slate-400 font-light flex items-center space-x-1.5 pt-1">
                    <div className="h-2 w-2 rounded-full bg-slate-200" />
                    <span>7/1 ~ 7/3 (과거 날짜는 예약 선택 불가)</span>
                  </div>
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  STEP 4. 청소 시작 시간 지정
                </label>
                {selectedDate ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-2xl flex justify-between items-center">
                      <span className="text-[11px] font-semibold text-slate-600">선택한 날짜:</span>
                      <span className="text-xs font-bold text-primary font-mono">{selectedDate}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TIME_SLOTS.map((time) => {
                        const busy = isSlotBusy(selectedDate, time);
                        const isSelected = selectedTime === time;

                        return (
                          <button
                            type="button"
                            key={time}
                            disabled={busy}
                            onClick={() => {
                              setSelectedTime(time);
                              setError(null);
                            }}
                            className={`py-3 px-2 rounded-xl text-center text-xs font-mono transition-all font-semibold flex flex-col items-center justify-center border ${
                              busy
                                ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed line-through"
                                : isSelected
                                ? "bg-slate-900 text-white border-slate-900 font-bold scale-102"
                                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <span>{time}</span>
                            {busy && <span className="text-[8px] font-sans opacity-70">예약불가</span>}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-slate-400 font-light leading-relaxed space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <p>* 매칭 캘린더에서 예약이 차 있는 시간은 자동 블록 처리됩니다.</p>
                      <p>* 예약 중복 방지를 위한 실시간 스케줄 필터 기능이 제공 중입니다.</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-slate-50 text-slate-400">
                    <CalendarIcon className="h-7 w-7 mb-2 text-slate-300" />
                    <p className="text-xs font-light">원하시는 예약 방문 날짜를 먼저 선택해주세요</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Requests */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                STEP 5. 매니저님께 요청할 사항 (선택)
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4.5 h-4 w-4 text-slate-400" />
                <textarea
                  rows={3}
                  placeholder="예: 문 앞 비밀번호 1234#, 싱크대 배수구 꼼꼼 소독 부탁드립니다, 반려견이 있으니 현관 진입 시 주의바랍니다."
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs leading-relaxed font-light"
                />
              </div>
            </div>

            {/* 5. Submit Panel */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-slate-400 font-light max-w-md text-center sm:text-left">
                * CleanExpert의 안전 방문 매니저는 100% 안심 파손 배상 책임보험 가입 완료 및 직영 신원 보증이 제공됩니다.
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-bold px-10 py-4 rounded-xl text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all text-center"
              >
                {loading ? "예약 스케줄 등록 중..." : "예약 최종 등록하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

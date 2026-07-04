import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Search,
  FileDown,
  User,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Save,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Booking, BookingStatus } from "../types";

export default function AdminView() {
  // Database bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    weekCount: 0,
    monthCount: 0,
    completedCount: 0,
    pendingCount: 0,
  });

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Selected Detail Booking for drawer
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Memo and status state for details panel
  const [adminMemo, setAdminMemo] = useState("");
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("예약완료");
  const [memoSaving, setMemoSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active highlighted calendar date
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<string>("");

  // Fetch Stats and Bookings
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch bookings list
      let url = "/api/bookings?role=admin";
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (selectedDateFilter) url += `&date=${selectedDateFilter}`;

      const bRes = await fetch(url);
      const bData = await bRes.json();
      if (bData.bookings) {
        setBookings(bData.bookings);
      }

      // Fetch Stats
      const sRes = await fetch("/api/stats");
      const sData = await sRes.json();
      if (sData) {
        setStats(sData);
      }
    } catch (err) {
      console.error("Error fetching admin metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [searchQuery, selectedDateFilter]);

  // Handle excel CSV download
  const handleExportCSV = () => {
    window.open("/api/bookings/export", "_blank");
  };

  // Select booking in list
  const handleSelectBooking = (b: Booking) => {
    setSelectedBooking(b);
    setAdminMemo(b.memo || "");
    setBookingStatus(b.status);
    setSaveSuccess(false);
  };

  // Save Memo and Status Updates to Server
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setMemoSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: bookingStatus,
          memo: adminMemo,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "수정 사항 저장에 실패했습니다.");
      }

      const updated = await res.json();
      // Update local state
      setBookings((prev) =>
        prev.map((item) => (item.id === selectedBooking.id ? updated.booking : item))
      );
      setSelectedBooking(updated.booking);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);

      // Refresh Stats
      const sRes = await fetch("/api/stats");
      const sData = await sRes.json();
      if (sData) setStats(sData);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setMemoSaving(false);
    }
  };

  // Calendar Highlight Setup for July 2026
  const YEAR = 2026;
  const MONTH = 7;
  const daysInJuly = 31;
  const firstDayOffset = 3; // Wednesday start

  // Count bookings on specific day helper
  const getBookingsOnDay = (dayNum: number) => {
    const formattedDate = `${YEAR}-07-${String(dayNum).padStart(2, "0")}`;
    return bookings.filter((b) => b.date === formattedDate);
  };

  // Click on Calendar Day
  const handleCalendarDayClick = (dayNum: number) => {
    const formattedDate = `${YEAR}-07-${String(dayNum).padStart(2, "0")}`;
    if (calendarSelectedDate === formattedDate) {
      setCalendarSelectedDate(""); // toggle off
      setSelectedDateFilter("");
    } else {
      setCalendarSelectedDate(formattedDate);
      setSelectedDateFilter(formattedDate); // filter list by date
    }
  };

  return (
    <div className="w-full bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top title and CSV button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <Sparkles className="h-7 w-7 text-primary animate-pulse" />
              <span>CleanExpert 통합 관리자 어드민</span>
            </h1>
            <p className="text-slate-500 font-light text-xs sm:text-sm">
              방문 청소 스케줄 매칭 현황, 실시간 예약 스케줄 승인, 고객 연락처 확보, 통계 및 캘린더를 정밀 통합 제어합니다.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4.5 py-3 rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <FileDown className="h-4 w-4 text-slate-300" />
            <span>Excel로 전체 내보내기 (CSV)</span>
          </button>
        </div>

        {/* 1. Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Today Bookings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">오늘 배정 건수</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-slate-900">{stats.todayCount}</span>
              <span className="text-xs text-slate-400">건</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">2026-07-04 기준</span>
          </div>

          {/* This Week Bookings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">이번 주 건수</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-slate-900">{stats.weekCount}</span>
              <span className="text-xs text-slate-400">건</span>
            </div>
            <span className="text-[9px] text-primary flex items-center space-x-0.5 font-semibold">
              <TrendingUp className="h-3 w-3" />
              <span>실시간 스케줄</span>
            </span>
          </div>

          {/* This Month Bookings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">이번 달 예약</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-slate-900">{stats.monthCount}</span>
              <span className="text-xs text-slate-400">건</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">7월 전체</span>
          </div>

          {/* Completed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">청소 완료 건</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-emerald-600">{stats.completedCount}</span>
              <span className="text-xs text-slate-400">건</span>
            </div>
            <span className="text-[9px] text-emerald-500 font-semibold">품질 보장 완결</span>
          </div>

          {/* Waiting/Pending */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-2 md:col-span-1 flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-semibold">대기 및 방문중</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-blue-600">{stats.pendingCount}</span>
              <span className="text-xs text-slate-400">건</span>
            </div>
            <span className="text-[9px] text-blue-500 font-semibold">배정 승인 대기 포함</span>
          </div>
        </div>

        {/* 2. Interactive Admin Calendar & List Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Monthly Highlights Calendar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                <Calendar className="h-4.5 w-4.5 text-primary" />
                <span>관리자 월간 캘린더 (7월)</span>
              </h3>
              {calendarSelectedDate && (
                <button
                  onClick={() => {
                    setCalendarSelectedDate("");
                    setSelectedDateFilter("");
                  }}
                  className="text-[10px] text-primary hover:underline font-bold"
                >
                  필터 해제
                </button>
              )}
            </div>

            <div className="text-center font-bold text-xs text-slate-700 py-1">2026년 7월 (July)</div>

            {/* Week names */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase">
              <div>일</div>
              <div>월</div>
              <div>화</div>
              <div>수</div>
              <div>목</div>
              <div>금</div>
              <div>토</div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOffset }).map((_, i) => (
                <div key={`offset-${i}`} className="h-10" />
              ))}

              {Array.from({ length: daysInJuly }).map((_, i) => {
                const dayNum = i + 1;
                const formattedDate = `${YEAR}-07-${String(dayNum).padStart(2, "0")}`;
                const dayBookings = getBookingsOnDay(dayNum);
                const hasBookings = dayBookings.length > 0;
                const isSelected = calendarSelectedDate === formattedDate;

                return (
                  <button
                    type="button"
                    key={`admin-day-${dayNum}`}
                    onClick={() => handleCalendarDayClick(dayNum)}
                    className={`h-11 rounded-xl flex flex-col justify-between p-1 transition-all relative border ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-102"
                        : "border-slate-100 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className={`text-[10px] font-bold ${dayBookings.some(b => b.status === '예약완료') ? 'text-blue-600' : 'text-slate-700'}`}>
                      {dayNum}
                    </span>
                    {hasBookings && (
                      <div className="w-full flex flex-col space-y-0.5 mt-0.5">
                        {dayBookings.slice(0, 2).map((b) => (
                          <div
                            key={b.id}
                            className={`text-[8px] font-sans truncate px-1 rounded-sm text-center leading-normal ${
                              b.status === "예약완료"
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : b.status === "완료"
                                ? "bg-emerald-50 text-emerald-600"
                                : b.status === "방문중"
                                ? "bg-amber-50 text-amber-600 font-semibold"
                                : "bg-slate-100 text-slate-400 line-through"
                            }`}
                          >
                            {b.time}
                          </div>
                        ))}
                        {dayBookings.length > 2 && (
                          <div className="text-[7px] text-slate-400 text-center font-mono -mt-0.5">
                            +{dayBookings.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-[10px] text-slate-400 font-light leading-relaxed space-y-1 pt-1 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
              <p>💡 날짜 타일을 누르면 해당 일정만 리스트에 필터링됩니다.</p>
              <p>🔵 7월 12일 등 예약 스케줄이 집중되는 날이 한눈에 표시됩니다.</p>
            </div>
          </div>

          {/* List and Details section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              {/* Header Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                  <Filter className="h-4.5 w-4.5 text-primary" />
                  <span>실시간 청소 예약 목록 ({bookings.length}건)</span>
                </h3>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {/* Search query input */}
                  <div className="relative flex-grow sm:flex-grow-0 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                    <input
                      type="text"
                      placeholder="고객명, 번호, 예약번호..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary text-[11px] w-full"
                    />
                  </div>

                  {/* Date Filter selector */}
                  <input
                    type="date"
                    value={selectedDateFilter}
                    onChange={(e) => setSelectedDateFilter(e.target.value)}
                    className="py-1.5 px-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 focus:outline-none"
                  />

                  {(searchQuery || selectedDateFilter) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedDateFilter("");
                        setCalendarSelectedDate("");
                      }}
                      className="text-[10px] text-rose-500 hover:underline font-bold"
                    >
                      초기화
                    </button>
                  )}
                </div>
              </div>

              {/* Main Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-light">
                  <thead>
                    <tr className="border-b border-slate-150 text-slate-400 font-semibold bg-slate-50">
                      <th className="py-2.5 px-3">예약번호</th>
                      <th className="py-2.5 px-3">고객 정보</th>
                      <th className="py-2.5 px-3">청소 구분</th>
                      <th className="py-2.5 px-3">예약 일자</th>
                      <th className="py-2.5 px-3">예약 시간</th>
                      <th className="py-2.5 px-3 text-right">진행 상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                          스케줄 로딩 중입니다...
                        </td>
                      </tr>
                    ) : bookings.length > 0 ? (
                      bookings.map((b) => (
                        <tr
                          key={b.id}
                          onClick={() => handleSelectBooking(b)}
                          className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-all ${
                            selectedBooking?.id === b.id ? "bg-primary/5 hover:bg-primary/5" : ""
                          }`}
                        >
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                            {b.id}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-semibold text-slate-800">{b.userName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{b.userPhone}</div>
                          </td>
                          <td className="py-3.5 px-3 text-slate-600 font-medium">{b.serviceType}</td>
                          <td className="py-3.5 px-3 font-mono text-slate-600">{b.date}</td>
                          <td className="py-3.5 px-3 font-mono font-semibold text-slate-800">{b.time}</td>
                          <td className="py-3.5 px-3 text-right">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                b.status === "예약완료"
                                  ? "bg-blue-50 text-blue-600 border-blue-100"
                                  : b.status === "방문중"
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : b.status === "완료"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-slate-100 text-slate-400 border-slate-200 line-through"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-slate-400">
                          검색 조건에 맞는 청소 예약 건이 발견되지 않았습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Details Panel & Memo Writer (opens underneath list) */}
            {selectedBooking && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-primary/20 shadow-lg space-y-6 animate-fade-in relative">
                {/* Close handle */}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  닫기 ✕
                </button>

                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1 text-xs text-primary font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Selected Schedule Details</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    예약번호 #{selectedBooking.id} 상세 관리 카드
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600 font-light bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  {/* Left segment */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>
                        고객명: <span className="font-bold text-slate-900">{selectedBooking.userName}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>
                        연락처:{" "}
                        <a href={`tel:${selectedBooking.userPhone}`} className="text-primary hover:underline font-mono font-semibold">
                          {selectedBooking.userPhone}
                        </a>
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        방문 주소:{" "}
                        <span className="font-semibold text-slate-900">
                          {selectedBooking.address} {selectedBooking.addressDetail}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Right segment */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>
                        예약 일정: <span className="font-mono font-semibold text-slate-900">{selectedBooking.date}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>
                        방문 시간: <span className="font-mono font-semibold text-slate-900">{selectedBooking.time}</span>
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <span className="font-semibold text-slate-700">고객 요청사항:</span>{" "}
                        {selectedBooking.requests || "(없음)"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSaveDetails} className="space-y-4">
                  {saveSuccess && (
                    <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>스케줄 상태 및 배정 관리 메모가 실시간 서버 데이터에 저장되었습니다.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Status selection */}
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">진행 배정 상태 변경</label>
                      <select
                        value={bookingStatus}
                        onChange={(e) => setBookingStatus(e.target.value as BookingStatus)}
                        className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none text-xs font-semibold text-slate-800"
                      >
                        <option value="예약완료">예약완료</option>
                        <option value="방문중">방문중</option>
                        <option value="완료">완료</option>
                        <option value="취소">취소</option>
                      </select>
                    </div>

                    {/* Admin Memo field */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">관리자 점검 및 특이사항 메모 작성</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="매칭된 매니저 이름, 도구 소독 여부, 현장 추가 공임 정산 사항 등을 작성하세요."
                          value={adminMemo}
                          onChange={(e) => setAdminMemo(e.target.value)}
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none text-xs text-slate-800 font-light"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-600"
                    >
                      창 닫기
                    </button>
                    <button
                      type="submit"
                      disabled={memoSaving}
                      className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                    >
                      <Save className="h-4.5 w-4.5" />
                      <span>{memoSaving ? "저장 중..." : "서버에 최종 업데이트 적용"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

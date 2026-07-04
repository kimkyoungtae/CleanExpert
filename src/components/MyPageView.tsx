import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { User, Booking, BookingStatus } from "../types";

interface MyPageViewProps {
  currentUser: User | null;
  onUpdateProfile: (updatedData: any) => Promise<User>;
}

export default function MyPageView({ currentUser, onUpdateProfile }: MyPageViewProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Profile Edit State
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [addressDetail, setAddressDetail] = useState(currentUser?.addressDetail || "");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Edit Reschedule State
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Fetch bookings for logged-in user
  const fetchMyBookings = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?userId=${currentUser.id}&role=user`);
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      setError("예약 내역을 가져오는 도중 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [currentUser]);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      setError("이름과 휴대폰 번호는 필수 입력입니다.");
      return;
    }

    setProfileLoading(true);
    setProfileSuccess(false);
    setError(null);

    try {
      await onUpdateProfile({
        name,
        phone,
        address,
        addressDetail,
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "프로필 정보 업데이트에 실패했습니다.");
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Cancel Booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("정말 예약을 취소하시겠습니까?\n방문 하루 전 취소 시 취소 위약금이 발생할 수 있습니다.")) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "취소" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "취소 요청에 실패했습니다.");
      }

      alert("예약이 안전하게 취소되었습니다.");
      fetchMyBookings();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Open Reschedule Dialog
  const openReschedule = (booking: Booking) => {
    setEditingBooking(booking);
    setNewDate(booking.date);
    setNewTime(booking.time);
    setEditError(null);
    setEditSuccess(false);
  };

  // Handle Reschedule Submit
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    try {
      const res = await fetch(`/api/bookings/${editingBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, time: newTime }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "일정 변경에 실패했습니다.");
      }

      setEditSuccess(true);
      setTimeout(() => {
        setEditingBooking(null);
        fetchMyBookings();
      }, 1500);
    } catch (err: any) {
      setEditError(err.message || "일정 변경 도중 충돌이 발생했습니다.");
    }
  };

  return (
    <div className="w-full bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title row */}
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            마이페이지 (My Page)
          </h1>
          <p className="text-slate-500 font-light text-sm">
            소중한 내 방문 예약 일정과 가사 케어 상태, 결제 내역을 투명하게 확인하고 프로필 정보를 변경할 수 있습니다.
          </p>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Col 1 & 2: Bookings List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>방문 청소 예약 내역 및 현황</span>
              </h2>

              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs font-light">
                  예약 현황 목록을 로드하는 중입니다...
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-slate-200/60 rounded-2xl p-5 hover:bg-slate-50/50 transition-colors space-y-4"
                    >
                      {/* Ticket top header */}
                      <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-semibold text-primary bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-full">
                            예약번호 #{booking.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {booking.serviceType}
                          </span>
                        </div>

                        {/* Booking Status badges */}
                        <div>
                          <span
                            className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                              booking.status === "예약완료"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : booking.status === "방문중"
                                ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse"
                                : booking.status === "완료"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-slate-150 text-slate-400 border-slate-200"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      {/* Ticket Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500 font-light">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>방문일: <span className="font-semibold text-slate-800">{booking.date}</span></span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>시작: <span className="font-semibold text-slate-800">{booking.time}</span></span>
                        </div>
                        <div className="flex items-center space-x-1.5 sm:col-span-3">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="truncate">
                            주소: <span className="font-semibold text-slate-800">{booking.address} {booking.addressDetail}</span>
                          </span>
                        </div>
                        {booking.requests && (
                          <div className="flex items-start space-x-1.5 sm:col-span-3 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                            <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              <span className="font-semibold text-slate-600">요청사항:</span> {booking.requests}
                            </p>
                          </div>
                        )}
                        {booking.memo && (
                          <div className="flex items-start space-x-1.5 sm:col-span-3 bg-amber-50/40 p-3 rounded-xl border border-amber-100">
                            <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="leading-relaxed text-slate-600">
                              <span className="font-bold text-amber-700">관리자 알림 메모:</span> {booking.memo}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action buttons (only for active appointments) */}
                      {booking.status === "예약완료" && (
                        <div className="flex justify-end space-x-2 pt-1">
                          <button
                            onClick={() => openReschedule(booking)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center space-x-1"
                          >
                            <Edit className="h-3 w-3" />
                            <span>예약 시간 변경</span>
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center space-x-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>예약 취소</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                  <p className="text-sm font-light">등록된 예약 내역이 존재하지 않습니다.</p>
                </div>
              )}
            </div>

            {/* Simulated Payment details log */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>결제 및 정산 내역</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-light">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="py-3 px-2">결제일</th>
                      <th className="py-3 px-2">예약번호</th>
                      <th className="py-3 px-2">서비스 명칭</th>
                      <th className="py-3 px-2">결제수단</th>
                      <th className="py-3 px-2 text-right">결제금액</th>
                      <th className="py-3 px-2 text-right">결제상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length > 0 ? (
                      bookings.map((b) => (
                        <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-4 px-2 font-mono text-[11px] text-slate-400">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-2 font-mono">#{b.id}</td>
                          <td className="py-4 px-2 font-semibold text-slate-700">{b.serviceType}</td>
                          <td className="py-4 px-2 text-slate-500">신용카드 (가상결제)</td>
                          <td className="py-4 px-2 text-right font-bold text-slate-800">
                            {b.serviceType.includes("Basic")
                              ? "85,000원"
                              : b.serviceType.includes("Deep")
                              ? "180,000원"
                              : b.serviceType.includes("Move")
                              ? "240,000원"
                              : "150,000원"}
                          </td>
                          <td className="py-4 px-2 text-right">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                              결제완료
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          정산 데이터가 존재하지 않습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Col 3: Profile edit panel */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Edit className="h-5 w-5 text-primary" />
              <span>내 프로필 및 안심 주소 수정</span>
            </h2>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {profileSuccess && (
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>정보가 정상적으로 업데이트되었습니다.</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">고객명</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs font-semibold text-slate-800"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">연락처</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs font-semibold text-slate-800"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">기본 청소 도로명 주소</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs mb-2 text-slate-800"
                  placeholder="예: 서울시 강남구 테헤란로 123"
                />
                <input
                  type="text"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs text-slate-800"
                  placeholder="상세 호실 주소"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
              >
                {profileLoading ? "정보 저장 중..." : "회원 프로필 정보 저장"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Reschedule Modal/Dialog Overlay */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full border border-slate-100 shadow-2xl relative animate-fade-in space-y-5">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">방문 예약 일정 및 시간 변경</h3>
              <p className="text-xs text-slate-400 font-light">
                예약번호 #{editingBooking.id} 스케줄을 새로 설정합니다.
              </p>
            </div>

            {editError && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl text-[11px] flex items-start space-x-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{editError}</span>
              </div>
            )}

            {editSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-[11px] flex items-center space-x-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>일정이 안전하게 변경 완료되었습니다.</span>
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              {/* Reschedule Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">방문 날짜 변경 (7월)</label>
                <input
                  type="date"
                  min="2026-07-04"
                  max="2026-07-31"
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(e.target.value);
                    setEditError(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none text-xs"
                  required
                />
              </div>

              {/* Reschedule Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">시작 시간 선택</label>
                <select
                  value={newTime}
                  onChange={(e) => {
                    setNewTime(e.target.value);
                    setEditError(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none text-xs font-mono font-semibold"
                  required
                >
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow"
                >
                  스케줄 확정
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

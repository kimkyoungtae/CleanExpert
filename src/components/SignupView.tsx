import React, { useState } from "react";
import { Sparkles, Mail, Lock, User, Phone, MapPin, AlertCircle, ArrowRight } from "lucide-react";
import { ActiveTab, User as UserType } from "../types";

interface SignupViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSignup: (userData: any) => Promise<UserType>;
}

export default function SignupView({ setActiveTab, onSignup }: SignupViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !phone) {
      setError("필수 항목(이름, 휴대폰, 이메일, 비밀번호)을 모두 작성해주세요.");
      return;
    }
    if (!agreeTerms) {
      setError("이용약관 및 개인정보 처리방침에 동의하셔야 가입이 가능합니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSignup({
        email,
        password,
        name,
        phone,
        address,
        addressDetail,
      });
      // App.tsx handles successful session and redirect
    } catch (err: any) {
      setError(err.message || "회원가입 중 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 py-20 flex items-center justify-center">
      <div className="max-w-lg w-full px-4 sm:px-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto bg-primary text-white p-3 rounded-2xl w-12 h-12 flex items-center justify-center shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
              신규 회원가입
            </h2>
            <p className="text-xs text-slate-400 font-light">
              무료 가입 후 편리한 프리미엄 케어를 직접 설계해보세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl text-xs flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  이름 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  휴대폰 번호 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                이메일 주소 <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                비밀번호 <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="영문, 숫자 포함 6자리 이상"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                기본 청소 도로명 주소 (선택)
              </label>
              <div className="relative mb-2">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="도로명 주소를 입력하세요 (예: 서울시 강남구 테헤란로 123)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs"
                />
              </div>
              <input
                type="text"
                placeholder="상세 주소 (예: 102동 405호)"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs"
              />
            </div>

            {/* Agree checkbox */}
            <div className="flex items-start space-x-2 bg-slate-50 p-4 rounded-2xl border border-slate-150">
              <input
                type="checkbox"
                id="agree-checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4.5 w-4.5 rounded text-primary focus:ring-primary/20 border-slate-300 mt-0.5 shrink-0"
              />
              <label htmlFor="agree-checkbox" className="text-[11px] text-slate-500 leading-normal">
                본인은 <span className="font-semibold text-slate-700 underline">이용약관</span> 및{" "}
                <span className="font-semibold text-slate-700 underline">개인정보 수집 및 동의</span> 요령을 완전히 읽었으며 이에 전적으로 동의합니다. (필수)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all disabled:opacity-50"
            >
              {loading ? "회원가입 처리 중..." : "동의하고 가입하기"}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400">이미 CleanExpert 계정이 있으신가요? </span>
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className="text-xs font-bold text-primary hover:underline inline-flex items-center space-x-0.5"
            >
              <span>이메일 로그인</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

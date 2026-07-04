import React, { useState } from "react";
import { Star, MessageSquare, ShieldCheck, AlertCircle } from "lucide-react";
import { Review } from "../types";

interface ReviewsViewProps {
  reviews: Review[];
  onAddReview: (review: { userName: string; rating: number; comment: string }) => Promise<void>;
}

export default function ReviewsView({ reviews, onAddReview }: ReviewsViewProps) {
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      setMessage({ type: "error", text: "고객명과 소중한 한 줄 리뷰를 모두 적어주세요." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await onAddReview({ userName, rating, comment });
      setMessage({ type: "success", text: "후기가 안전하게 등록되었습니다. 감사합니다!" });
      setUserName("");
      setComment("");
      setRating(5);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "리뷰 등록 중 에러가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/5 px-3 py-1.5 rounded-full">
            Customer Reviews
          </span>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">
            사용해 보신 고객님들의 솔직한 후기
          </h1>
          <p className="text-slate-500 font-light text-sm sm:text-base">
            클린엑스퍼트 서비스를 직접 예약하고 경험해 보신 실제 이용자분들의 평점입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Form Side */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-1.5">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>이용 후기 작성하기</span>
              </h3>
              <p className="text-xs text-slate-400 font-light">
                방문 청소 만족도는 어떠셨나요? 소중한 평점과 의견을 남겨주시면 품질 향상에 적극 반영하겠습니다.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4.5">
              {message && (
                <div
                  className={`p-4 rounded-xl text-xs flex items-start space-x-2 border ${
                    message.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                      : "bg-rose-50 text-rose-800 border-rose-100"
                  }`}
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{message.text}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  고객명
                </label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs"
                />
              </div>

              {/* Rating Star Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  서비스 만족도 평점
                </label>
                <div className="flex items-center space-x-1.5 text-amber-400 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const value = i + 1;
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setRating(value)}
                        className="hover:scale-110 transition-transform p-0.5"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            value <= rating ? "fill-current text-amber-400" : "text-slate-200"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-slate-500 text-xs font-semibold ml-2">{rating}점 / 5점</span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  상세 솔직 후기 내용
                </label>
                <textarea
                  rows={4}
                  placeholder="청소 상태, 친절함, 약속 시간 준수 여부 등에 관한 솔직한 후기를 최소 10자 이상 적어주세요."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-xs leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-md shadow-primary/10 transition-all disabled:opacity-50"
              >
                {loading ? "등록 처리 중..." : "후기 등록하기"}
              </button>
            </form>
          </div>

          {/* List Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="text-slate-800 text-xs sm:text-sm font-semibold">
                  인증된 이용자 평점만 투명하게 제공합니다.
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-xs">리뷰 개수 </span>
                <span className="font-bold text-slate-900">{reviews.length}개</span>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-9 w-9 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-xs uppercase border border-primary/10">
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-slate-900 font-semibold text-xs">
                          {rev.userName} 고객님
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center space-x-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          className={`h-3.5 w-3.5 fill-current ${
                            sIdx < rev.rating ? "text-amber-400" : "text-slate-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-600 font-light text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Plus, Minus, HelpCircle, Search } from "lucide-react";
import { FAQ_ITEMS } from "../data";

export default function FaqView() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/5 px-3 py-1.5 rounded-full">
            Help Center
          </span>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">
            자주 묻는 질문 (FAQ)
          </h1>
          <p className="text-slate-500 font-light text-sm sm:text-base">
            클린엑스퍼트 이용 전 궁금한 부분을 직접 검색하거나 아래 목록에서 쉽게 확인해보세요.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10 max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="궁금하신 점을 검색해보세요 (예: 준비물, 취소)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm font-light"
          />
        </div>

        {/* FAQ list */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full flex justify-between items-center p-6 text-left"
                  >
                    <span className="font-semibold text-slate-800 text-sm sm:text-base flex items-center space-x-2.5">
                      <HelpCircle className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span>{item.question}</span>
                    </span>
                    {isExpanded ? (
                      <Minus className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <Plus className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 text-slate-500 text-xs sm:text-sm leading-relaxed border-t border-slate-50 font-light">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-400">
            <p className="text-sm font-light">"{searchQuery}"에 해당하는 검색 결과가 존재하지 않습니다.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-primary text-xs font-semibold mt-2 hover:underline"
            >
              검색 초기화
            </button>
          </div>
        )}

        {/* Contact box */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-xs text-slate-400 font-light">원하시는 답변을 찾지 못하셨나요?</p>
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 bg-white px-8 py-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-left">
              <div className="text-xs text-slate-400">전화 연결 및 빠른 상담</div>
              <div className="text-lg font-bold text-slate-800">1577-7976</div>
            </div>
            <div className="hidden sm:block h-8 w-[1px] bg-slate-200" />
            <div className="text-left">
              <div className="text-xs text-slate-400 font-light">이메일 기술 지원 서비스</div>
              <div className="text-sm font-semibold text-primary">support@cleanexpert.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

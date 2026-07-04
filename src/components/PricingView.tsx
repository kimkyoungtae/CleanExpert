import React from "react";
import { Check, Sparkles, AlertCircle } from "lucide-react";
import { PRICING_PLANS } from "../data";
import { ActiveTab } from "../types";

interface PricingViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function PricingView({ setActiveTab }: PricingViewProps) {
  return (
    <div className="w-full bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/5 px-3 py-1.5 rounded-full">
            Standard Pricing Guide
          </span>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">
            합리적이고 투명한 정액제 요금 정책
          </h1>
          <p className="text-slate-500 font-light text-sm sm:text-base">
            평수나 관리 강도에 알맞은 요금을 사전에 명시하여 추가금 스트레스가 없습니다.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-8 border relative flex flex-col justify-between h-full transition-all duration-300 ${
                plan.popular
                  ? "border-primary shadow-xl scale-102 ring-4 ring-primary/5"
                  : "border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-md flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  <span>가장 많이 이용하는 상품</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-900 font-bold text-lg">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-slate-400 text-xs font-medium mr-1">₩</span>
                    <span className="text-slate-900 font-display font-extrabold text-4xl tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-slate-400 text-xs font-medium ml-1">
                      / {plan.frequency}
                    </span>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-100" />

                {/* Features list */}
                <ul className="space-y-3.5">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2.5">
                      <div className="bg-primary/5 text-primary rounded-full p-0.5 shrink-0 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-600 font-light">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setActiveTab("reservation")}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all text-center ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/10"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200"
                  }`}
                >
                  해당 요금제로 간편 상담·예약
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Note block */}
        <div className="bg-slate-100/60 border border-slate-200/50 rounded-2xl p-6 flex items-start space-x-3 max-w-3xl mx-auto">
          <AlertCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-500 font-light leading-relaxed">
            <h5 className="font-semibold text-slate-700">기타 요금 정책 유의사항</h5>
            <p>
              * 위의 단가는 표준 평수 및 일반 오염도 기준이며, 폐기물 방치, 화재 오염, 과도한 곰팡이 등 특수한 경우에는 현장에서 사전에 정밀 실측 후 추가 공임비가 조율될 수 있습니다.
            </p>
            <p>
              * 정기 예약 패키지(예: 주 1회 혹은 격주 1회 방문 신청)를 선택하실 경우, 최대 15%의 패키지 즉시 할인 혜택이 장기적으로 제공됩니다. 상세 가입 문의는 고객센터(1577-7976)로 주시면 친절하게 지원해 드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

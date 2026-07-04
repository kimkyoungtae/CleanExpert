import React from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { SERVICES_DATA } from "../data";
import { ActiveTab } from "../types";

interface ServicesViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectServiceType: (type: string) => void;
}

export default function ServicesView({
  setActiveTab,
  onSelectServiceType,
}: ServicesViewProps) {
  const handleBook = (serviceTitle: string) => {
    onSelectServiceType(serviceTitle);
    setActiveTab("reservation");
  };

  return (
    <div className="w-full bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/5 px-3 py-1.5 rounded-full">
            Our Services Menu
          </span>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">
            클린엑스퍼트 프리미엄 서비스 안내
          </h1>
          <p className="text-slate-500 font-light text-sm sm:text-base">
            공간의 유형과 라이프스타일에 맞춘 품격 있는 클리닝 솔루션을 만나보세요.
          </p>
        </div>

        {/* Detailed Catalog rows */}
        <div className="space-y-16">
          {SERVICES_DATA.map((service, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={service.id}
                className={`flex flex-col lg:flex-row items-stretch gap-12 bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-6 sm:p-8 ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Visual Image */}
                <div className="lg:w-1/2 h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 relative shrink-0 shadow-inner">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    기본 단가 : {service.price}
                  </div>
                </div>

                {/* Content Panel */}
                <div className="lg:w-1/2 flex flex-col justify-between py-4 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-1.5 text-xs text-primary font-semibold">
                        <Sparkles className="h-3 w-3" />
                        <span>{service.subtitle}</span>
                      </div>
                      <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                        {service.title}
                      </h2>
                    </div>

                    <p className="text-slate-500 text-sm font-light leading-relaxed">
                      {service.desc}
                    </p>

                    {/* Features checklist */}
                    <div className="pt-2">
                      <h4 className="text-xs font-semibold text-slate-800 tracking-wider uppercase mb-3">
                        핵심 포함 품목 및 점검 목록
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {service.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-start space-x-2">
                            <div className="bg-emerald-50 text-emerald-600 rounded-full p-0.5 shrink-0 mt-0.5 border border-emerald-100">
                              <Check className="h-3 w-3" />
                            </div>
                            <span className="text-xs text-slate-600 font-light">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA button */}
                  <div>
                    <button
                      onClick={() => handleBook(service.title)}
                      className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>{service.title} 간편 예약하기</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

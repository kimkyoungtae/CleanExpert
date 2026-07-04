import React from "react";
import { Sparkles, Heart, Award, ShieldCheck, Users } from "lucide-react";

export default function AboutView() {
  return (
    <div className="w-full bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/5 px-3 py-1.5 rounded-full">
            Our Story & Values
          </span>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">
            깨끗함을 디자인하다, CleanExpert
          </h1>
          <p className="text-slate-500 font-light text-base max-w-xl mx-auto">
            단순히 바닥을 닦고 먼지를 터는 행위를 넘어, 고객의 소중한 주거 공간에 새로운 휴식 가치를 선사하고자 합니다.
          </p>
        </div>

        {/* Photo / Intro Segment */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm mb-16">
          <div className="h-80 relative">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop"
              alt="Professional expert cleaner holding eco-friendly products with a bright smile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <h3 className="font-display font-bold text-xl">안심하고 머물 수 있는 가장 완벽한 공간</h3>
              <p className="text-xs text-slate-300 font-light">
                클린엑스퍼트는 정기 교육을 거친 가사 청소 마스터들만이 방문하여 한 차원 높은 품질을 유지합니다.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">
              CleanExpert의 3대 핵심 철학 (Premium · Trust · Clean)
            </h3>
            <p className="text-slate-600 font-light text-sm sm:text-base leading-relaxed">
              우리는 공간이 사람에게 주는 심리적 정서적 치유력을 믿습니다. 퇴근하고 복잡하고 지저분한 집에 들어섰을 때의 피로와, 완전히 소독되어 햇살이 들고 먼지가 없는 깨끗한 집에 들어섰을 때의 평안은 다릅니다. 당사가 대행하는 것은 청소가 아니라, 고객님이 편안하게 호흡하고 재충전할 수 있는 시간 그 자체입니다.
            </p>
          </div>
        </div>

        {/* Philosophy Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col space-y-4">
            <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <Award className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Premium Quality</h4>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              독일 친환경 소독 및 특수 먼지 흡입 장비를 사용하여 일반 가사 도구로 지우기 어려운 찌든때와 오염 물질을 원천 제거합니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col space-y-4">
            <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Absolute Trust</h4>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              모든 매니저의 철저한 신원 보증과 배상 책임 보험 100% 가입을 통해 혹시 모를 안전 및 기물 손상 리스크에도 철저히 대응합니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col space-y-4">
            <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Expert Cleaners</h4>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              단순 아르바이트가 아닌 직영 마스터 아카데미 청소 교육 수료 과정을 완료한 꼼꼼한 클리너 분들로 엄격하게 운용합니다.
            </p>
          </div>
        </div>

        {/* Message Callout */}
        <div className="bg-primary/5 border border-primary/10 p-8 rounded-3xl text-center space-y-4">
          <Heart className="h-8 w-8 text-primary mx-auto animate-pulse" />
          <h3 className="font-bold text-slate-900 text-lg">"소중한 사람의 집을 관리하는 온화함으로"</h3>
          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-xl mx-auto leading-relaxed">
            CleanExpert는 서비스 품질 관리를 최우선으로 합니다. 만일 불만족 사항이 존재한다면, 24시간 내 요청 시 매니저 재배정을 통한 전면 재보완 청소를 무상 제공합니다. 신뢰와 정직함이 우리의 무기입니다.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Sparkles, Phone, Mail, MapPin } from "lucide-react";
import { ActiveTab } from "../types";

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Col 1: Brand details */}
          <div className="space-y-4">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setActiveTab("home")}
            >
              <div className="bg-primary text-white p-2 rounded-lg">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                Clean<span className="text-primary">Expert</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              CleanExpert는 대한민국 최고의 기술력과 엄선된 가사 전문가 인력을 통해 프리미엄 호텔식 홈 클리닝 서비스를 선사합니다.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              © 2026 CleanExpert. All Rights Reserved.
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab("about")}
                  className="hover:text-white transition-colors"
                >
                  회사 소개
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("services")}
                  className="hover:text-white transition-colors"
                >
                  서비스 품목
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("pricing")}
                  className="hover:text-white transition-colors"
                >
                  표준 가격 정책
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("faq")}
                  className="hover:text-white transition-colors"
                >
                  자주 묻는 질문 (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Policy Links */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">
              Policy & Terms
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  이용 약관 (Terms of Service)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  개인정보 처리방침 (Privacy Policy)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  서비스 배상책임 보장 범위
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Center */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">
              Customer Center
            </h4>
            <div className="flex items-start space-x-2">
              <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-semibold">1577-7976</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  평일 09:00 - 18:00 / 주말 및 공휴일 휴무
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span>support@cleanexpert.com</span>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>서울특별시 강남구 테헤란로 123 CleanExpert 빌딩 4층</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-600 gap-4">
          <div>
            주식회사 클린엑스퍼트 | 대표이사 김정글 | 사업자등록번호 120-00-00000 | 서울시 강남구 테헤란로 123
          </div>
          <div>
            Designed in Premium Style with Apple, Airbnb, Dyson inspired elegance.
          </div>
        </div>
      </div>
    </footer>
  );
}

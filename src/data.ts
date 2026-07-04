import { CheckCircle, ShieldCheck, CalendarRange, CreditCard, Sparkles } from "lucide-react";

export const WHY_ITEMS = [
  {
    id: "why1",
    iconName: "ShieldCheck",
    title: "전문 교육을 받은 청소 전문가",
    desc: "엄격한 신원 검증과 체계적인 청소 교육 과정을 수료한 전문가들만이 안심 서비스를 제공합니다.",
  },
  {
    id: "why2",
    iconName: "CalendarRange",
    title: "원하는 날짜와 시간 선택",
    desc: "고객님의 라이프스타일에 맞추어 원하시는 요일과 시간대를 직접 실시간으로 지정하여 간편하게 예약하세요.",
  },
  {
    id: "why3",
    iconName: "CreditCard",
    title: "정직하고 투명한 가격",
    desc: "숨겨진 추가 금액 없이 면적과 서비스 유형에 따른 명확한 표준 요금제만을 적용하여 신뢰를 높입니다.",
  },
  {
    id: "why4",
    iconName: "Sparkles",
    title: "100% 품질 책임 및 만족 보장",
    desc: "서비스 완료 후 불만족 사항이 있을 시 24시간 내 재방문 케어를 보장하는 책임감 있는 서비스를 약속합니다.",
  },
];

export const SERVICES_DATA = [
  {
    id: "s1",
    title: "Basic Cleaning",
    subtitle: "일반 가정 정기·일회성 청소",
    price: "85,000원 ~",
    desc: "거실, 주방, 안방, 욕실 등 손길이 닿기 어려운 구석구석을 꼼꼼하게 관리하는 표준 일상 케어입니다.",
    features: ["거실 가구 먼지 제거 및 바닥 청소", "각 침실 침구 정돈 및 정리정돈", "욕실 세면대·변기·샤워실 물때 소독", "주방 가스레인지 외부 표면 세척"],
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "s2",
    title: "Deep Cleaning",
    subtitle: "입주·정밀 대청소",
    price: "180,000원 ~",
    desc: "오랫동안 누적된 찌든 때, 가스레인지 기름때, 화장실 깊숙한 곰팡이와 보이지 않는 먼지까지 정밀 세척합니다.",
    features: ["가스레인지 후드 및 오븐 필터 찌든 때 제거", "화장실 타일 사이 곰팡이 정밀 박멸", "창틀, 방충망 및 문틀 먼지 습식 제거", "베란다 타일 고압 물청소"],
    imageUrl: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "s3",
    title: "Move Cleaning",
    subtitle: "이사 청소 (입주 전·후 전문)",
    price: "240,000원 ~",
    desc: "이전 거주자의 흔적을 100% 지우고, 안심하고 입주하실 수 있도록 공간 전체를 살균 소독하는 특수 클리닝입니다.",
    features: ["벽지 먼지 털기 및 미세 가루 청소", "수납장 내부, 빌트인 가구 안쪽 전수 세척", "전체 공간 피톤치드 친환경 살균 연무", "배수구 및 하수구 고온 스팀 살균"],
    imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "s4",
    title: "Office Cleaning",
    subtitle: "소형 사무실 및 상업 공간 청소",
    price: "150,000원 ~",
    desc: "직원들의 업무 생산성을 극대화하기 위해 회의실, 개인 데스크, 탕비실 등을 쾌적하고 청결하게 가꿉니다.",
    features: ["유리 칸막이, 출입문 지문 및 오염 제거", "사무용 기기 정밀 먼지 제거", "분리수거 쓰레기통 비우기 및 대행", "공용 바닥 기계 세척 및 왁싱 (옵션)"],
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
  },
];

export const PRICING_PLANS = [
  {
    id: "p1",
    name: "원룸 / 미니 (10평 이하)",
    price: "59,000",
    frequency: "회당",
    popular: false,
    features: [
      "방 1, 거실 겸 주방, 화장실 1 기준",
      "바닥 진공 청소 및 물걸레질",
      "화장실 물때 및 곰팡이 제거",
      "간단한 주방 싱크대 세정",
      "쓰레기 분리배출 서비스 제공"
    ]
  },
  {
    id: "p2",
    name: "투룸 / 중형 (11~25평)",
    price: "99,000",
    frequency: "회당",
    popular: true,
    features: [
      "방 2~3, 거실, 주방, 화장실 1~2 기준",
      "실내 전체 창틀 먼지 클리닝",
      "주방 기름때 및 욕실 소독 안심 케어",
      "가구 표면 정밀 먼지 흡착 청소",
      "100% 친환경 세제 및 소독 전수 적용"
    ]
  },
  {
    id: "p3",
    name: "쓰리룸 / 대형 (26~40평 이상)",
    price: "149,000",
    frequency: "회당",
    popular: false,
    features: [
      "대형 아파트, 빌라 전용",
      "베란다 습식 청소 포함",
      "배수구 고온 살균 및 가전 외부 클리닝",
      "전문 마스터 클리너 2인 이상 배정",
      "피톤치드 연무 서비스 무료 추가"
    ]
  }
];

export const FAQ_ITEMS = [
  {
    id: "f1",
    question: "예약 변경이나 취소는 언제든지 가능한가요?",
    answer: "예약 변경 및 취소는 마이페이지를 통해 방문일 기준 최소 24시간 전까지 직접 무료로 진행하실 수 있습니다. 당일 취소 시에는 매니저 이동 및 일정 차질로 인해 50%의 위약금이 발생할 수 있으니 양해 부탁드립니다.",
  },
  {
    id: "f2",
    question: "청소 시간은 평균적으로 얼마나 걸리나요?",
    answer: "평수와 오염도에 따라 다릅니다. 일반 일상 청소(Basic)의 경우 원룸 기준 2시간, 중대형 아파트 기준 3~4시간 정도 소요됩니다. 입주청소(Deep/Move)는 살균 및 찌든때 제거가 포함되어 평균 5~7시간이 걸립니다.",
  },
  {
    id: "f3",
    question: "청소 도구나 세제는 제가 따로 준비해야 하나요?",
    answer: "아닙니다. CleanExpert의 모든 전문 클리너는 독일 친환경 안심 세제 및 고성능 무선 청소기, 부위별 맞춤 타월 등을 지참하여 직접 방문합니다. 안심하고 휴식을 취하시면 됩니다.",
  },
  {
    id: "f4",
    question: "결제는 언제 어떻게 이루어지나요?",
    answer: "예약 접수 후 방문 확정 시 마이페이지에서 가상 계좌 이체 또는 신용카드 결제를 진행해주시면 됩니다. 법인이나 사무실 청소의 경우 세금계산서 발행 및 후불 정산도 지원합니다.",
  },
  {
    id: "f5",
    question: "만약 청소 상태가 만족스럽지 않다면 어떻게 하나요?",
    answer: "CleanExpert는 100% 고객 만족 보장 제도를 운영합니다. 서비스 완료 후 미흡한 점이 발견되면 고객센터 혹은 마이페이지의 서비스 만족 체크를 통해 24시간 내 무상 재방문 보정 청소를 요청하실 수 있습니다.",
  }
];

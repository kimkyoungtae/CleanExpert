export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  addressDetail: string;
  role: "user" | "admin";
}

export type BookingStatus = "예약완료" | "방문중" | "완료" | "취소";

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  serviceType: string;
  address: string;
  addressDetail: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  requests?: string;
  status: BookingStatus;
  memo?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type ActiveTab =
  | "home"
  | "about"
  | "services"
  | "pricing"
  | "reservation"
  | "reviews"
  | "faq"
  | "login"
  | "signup"
  | "mypage"
  | "admin";

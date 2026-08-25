import {
  ShoppingCart,
  Utensils,
  Home,
  Zap,
  Fuel,
  HeartPulse,
  Shield,
  ShoppingBag,
  Tv,
  GraduationCap,
  TrendingUp,
  Gift,
  Plane,
  Wrench,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface CategoryMeta {
  icon: LucideIcon;
  color: string; // Tailwind background/text color classes
}

export const categoryMetadataMap: Record<string, CategoryMeta> = {
  "Groceries": {
    icon: ShoppingCart,
    color: "bg-emerald-900/20 text-emerald-600",
  },
  "Dining Out": {
    icon: Utensils,
    color: "bg-amber-900/20 text-amber-600",
  },
  "Rent/EMI": {
    icon: Home,
    color: "bg-blue-900/20 text-blue-600",
  },
  "Utilities (Electricity/Water)": {
    icon: Zap,
    color: "bg-yellow-900/20 text-yellow-600",
  },
  "Fuel/Transportation": {
    icon: Fuel,
    color: "bg-orange-900/20 text-orange-600",
  },
  "Health & Medical": {
    icon: HeartPulse,
    color: "bg-rose-900/20 text-rose-600",
  },
  "Insurance": {
    icon: Shield,
    color: "bg-indigo-900/20 text-indigo-600",
  },
  "Shopping (Clothing/Electronics)": {
    icon: ShoppingBag,
    color: "bg-purple-900/20 text-purple-600",
  },
  "Entertainment & OTT": {
    icon: Tv,
    color: "bg-pink-900/20 text-pink-600",
  },
  "Education": {
    icon: GraduationCap,
    color: "bg-cyan-900/20 text-cyan-600",
  },
  "Investments (SIP/Stocks)": {
    icon: TrendingUp,
    color: "bg-teal-900/20 text-teal-600",
  },
  "Gifts & Donations": {
    icon: Gift,
    color: "bg-fuchsia-900/20 text-fuchsia-600",
  },
  "Travel & Vacation": {
    icon: Plane,
    color: "bg-sky-900/20 text-sky-600",
  },
  "Maintenance & Repairs": {
    icon: Wrench,
    color: "bg-stone-900/20 text-stone-600",
  },
  "Miscellaneous": {
    icon: HelpCircle,
    color: "bg-slate-900/20 text-slate-600",
  },
};
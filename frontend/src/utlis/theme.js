// src/utils/theme.js

export const COLORS = {
  primary: "#2563EB",   // Vivid Royal Blue
  secondary: "#7C3AED", // Modern Purple
  accent: "#06B6D4",    // Cyan
  success: "#22C55E",   // Emerald Green
  warning: "#F59E0B",   // Amber
  danger: "#EF4444",    // Crimson Red
  dark: "#0F172A",      // Slate 900
  gray: "#64748B",      // Slate 500
  light: "#F8FAFC",     // Off-white / Canvas
};

export const SPACING = {
  section: "py-24 lg:py-28",
  container: "container-custom",
};

export const SHADOWS = {
  primary: "shadow-primary",
  hover: "hover:shadow-2xl transition-shadow duration-300",
};

export const BORDER_RADIUS = {
  card: "rounded-3xl",
  button: "rounded-xl",
  badge: "rounded-full",
};

export const DESIGN_SYSTEM = {
  buttonBase: "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-md hover:shadow-lg",
  cardBase: "bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-primary p-8 transition-all duration-300 hover:-translate-y-1.5",
};
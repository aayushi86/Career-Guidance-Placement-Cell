import React from "react";

function Badge({
  children,
  variant = "blue", // blue | green | purple | orange | cyan
  className = "",
}) {
  const variants = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    orange: "bg-amber-100 text-amber-700 border-amber-200",
    cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
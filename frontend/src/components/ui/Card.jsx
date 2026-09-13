import React from "react";

function Card({
  children,
  hover = false,
  glass = false,
  className = "",
  ...props
}) {
  const glassStyles = glass
    ? "bg-white/80 backdrop-blur-md border border-white/20"
    : "bg-white border border-slate-100";

  const hoverStyles = hover
    ? "hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer"
    : "";

  return (
    <div
      className={`rounded-2xl shadow-lg p-6 ${glassStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
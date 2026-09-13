import React from "react";

function SectionTitle({ tag, title, subtitle, className = "" }) {
  return (
    <div className={`text-center max-w-3xl mx-auto mb-16 ${className}`}>
      {tag && (
        <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
          {tag}
        </span>
      )}

      <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
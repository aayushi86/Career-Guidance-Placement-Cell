import React from "react";

function Input({
  label,
  error,
  type = "text",
  placeholder,
  className = "",
  icon,
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          className={`w-full border rounded-xl py-3 text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 transition duration-200 ${
            icon ? "pl-11 pr-4" : "px-4"
          } ${
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-slate-300 focus:border-blue-600 focus:ring-blue-500/20"
          } ${className}`}
          {...props}
        />
      </div>

      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}

export default Input;
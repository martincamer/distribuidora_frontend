import React, { useState, forwardRef } from "react";

export const PasswordInput = forwardRef(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        type={showPassword ? "text" : "password"}
        className={`text-sm w-full bg-white placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 rounded-md outline-none transition-all ${className} border border-gray-300`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex items-center px-3"
      >
        {showPassword ? (
          <span role="img" aria-label="Hide password">
            🙈
          </span>
        ) : (
          <span role="img" aria-label="Show password">
            👁️
          </span>
        )}
      </button>
    </div>
  );
});

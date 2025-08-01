import React from "react";
import eyeOpen from "../../../assets/icons/login/eye-open.svg";
import eyeClosed from "../../../assets/icons/login/eye-closed.svg";

interface LoginInputFieldProps {
  id: string;
  label: string;
  type: "text" | "email" | "password" | "number";
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showPasswordToggle?: boolean;
  onPasswordToggle?: () => void;
  isPasswordVisible?: boolean;
  className?: string;
}

const LoginInputField: React.FC<LoginInputFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  showPasswordToggle = false,
  onPasswordToggle,
  isPasswordVisible = false,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm text-[#E9E9E9]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPasswordToggle ? (isPasswordVisible ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full h-[49px] bg-[#292929] text-white placeholder-[#959595] rounded-[9px] px-4 py-[13px] pr-12 focus:outline-none"
        />
        {showPasswordToggle && value && (
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={onPasswordToggle}
          >
            <img
              src={isPasswordVisible ? eyeOpen : eyeClosed}
              alt="toggle visibility"
              className="w-5 h-5 opacity-70"
            />
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default LoginInputField; 
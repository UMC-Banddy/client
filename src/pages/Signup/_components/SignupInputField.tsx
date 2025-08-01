import React from "react";
import eyeOpen from "../../../assets/icons/login/eye-open.svg";
import eyeClosed from "../../../assets/icons/login/eye-closed.svg";

interface SignupInputFieldProps {
  id?: string;
  type: "text" | "email" | "password" | "number";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
  onPasswordToggle?: () => void;
  isPasswordVisible?: boolean;
  className?: string;
  inputMode?: "text" | "email" | "numeric" | "tel";
  maxLength?: number;
  min?: string | number;
  max?: string | number;
}

const SignupInputField: React.FC<SignupInputFieldProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  showPasswordToggle = false,
  onPasswordToggle,
  isPasswordVisible = false,
  className = "",
  inputMode,
  maxLength,
  min,
  max,
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={showPasswordToggle ? (isPasswordVisible ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        maxLength={maxLength}
        min={min}
        max={max}
        className="w-full border-b border-[#959595] bg-transparent py-2 pr-12 focus:outline-none text-white placeholder-[#959595]"
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onPasswordToggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <img
            src={isPasswordVisible ? eyeOpen : eyeClosed}
            alt="toggle visibility"
            className="w-5 h-5 opacity-70"
          />
        </button>
      )}
    </div>
  );
};

export default SignupInputField; 
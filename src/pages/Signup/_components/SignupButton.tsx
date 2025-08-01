import React from "react";

interface SignupButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "popup";
}

const SignupButton: React.FC<SignupButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = "",
  variant = "primary",
}) => {
  const baseClasses = "py-3 rounded-[24px] font-semibold transition";
  
  const variantClasses = {
    primary: disabled
      ? "w-full bg-[#959595] text-[#555555] cursor-default"
      : "w-full bg-[#C7242D] text-black hover:bg-[#b51f27]",
    secondary: disabled
      ? "w-full bg-[#959595] text-[#555555] cursor-default"
      : "w-full bg-[#555555] text-[#CACACA] hover:bg-[#444444]",
    popup: disabled
      ? "w-[100px] bg-[#959595] text-[#555555] cursor-default"
      : "w-[100px] bg-[#C7242D] text-white hover:bg-[#b51f27]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default SignupButton; 
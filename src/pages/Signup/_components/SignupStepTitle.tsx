import React from "react";

interface SignupStepTitleProps {
  step: number;
  title: string;
  subtitle?: string;
  className?: string;
}

const SignupStepTitle: React.FC<SignupStepTitleProps> = ({ 
  step, 
  title, 
  subtitle, 
  className = "" 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm text-[#959595] mb-1">Step. {step}</p>
      <h1 className="text-lg font-semibold mb-8">{title}</h1>
      {subtitle && (
        <p className="text-xs text-[#959595] mb-6">{subtitle}</p>
      )}
    </div>
  );
};

export default SignupStepTitle; 
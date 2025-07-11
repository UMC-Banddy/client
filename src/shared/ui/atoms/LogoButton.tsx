import React from 'react';

interface LogoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
}

const LogoButton: React.FC<LogoButtonProps> = ({ icon, label, ...props }) => {
  return (
    <button
      {...props}
      className="flex items-center gap-2 px-6 py-4 bg-red-600 text-white rounded-full font-semibold text-lg hover:bg-red-500 transition"
    >
      <img src={icon} alt="icon" className="w-10 h-10" />
      {label}
    </button>
  );
};

export default LogoButton;

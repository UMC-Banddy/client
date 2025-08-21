import React from "react";

interface ProfileTagProps {
  text: string;
  icon?: string;
  variant?: "genre" | "keyword";
  className?: string;
}

const ProfileTag: React.FC<ProfileTagProps> = ({
  text,
  icon,
  variant = "keyword",
  className = "",
}) => {
  const baseClasses =
    "flex items-center gap-1 sm:gap-2 px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 xl:px-10 xl:py-6 2xl:px-12 2xl:py-7 rounded-full text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl";

  const variantClasses =
    variant === "genre" ? "bg-black text-white" : "bg-black text-white";

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </div>
  );
};

export default ProfileTag;

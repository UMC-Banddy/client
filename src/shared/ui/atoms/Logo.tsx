import React from "react";
import whiteStar from "@/assets/logos/white-star.svg";

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo = ({ className = "", size = 32 }: LogoProps) => (
  <img
    src={whiteStar}
    alt="Banddy Logo"
    width={size}
    height={size}
    className={className}
    draggable={false}
  />
);

export default Logo;

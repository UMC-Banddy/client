import clsx from "clsx";
import type { PropsWithChildren } from "react";

interface ImgCircleProps {
  size?: number;
  color: "red" | "gray";
}

const ImgCircle = ({
  size = 68,
  color,
  ...props
}: PropsWithChildren<ImgCircleProps>) => {
  return (
    <div
      className={clsx("flex items-center justify-center rounded-full", {
        "bg-[#CACACA]": color === "gray",
        "bg-[#B42127]": color === "red",
      })}
      style={{ width: size, height: size }}
      {...props}
    ></div>
  );
};

export default ImgCircle;

import clsx from "clsx";
import type { PropsWithChildren } from "react";

interface ImgCircleProps {
  size?: number;
  color: "red" | "gray" | "red-400" | "gray-700" | "gray-200";
}

const ImgCircle = ({
  size = 68,
  color,
  ...props
}: PropsWithChildren<ImgCircleProps>) => {
  // 색상 매핑
  const bgColor =
    color === "red" || color === "red-400"
      ? "#B42127"
      : color === "gray" || color === "gray-700"
      ? "#292929"
      : color === "gray-200"
      ? "#CACACA"
      : undefined;

  return (
    <div
      className={clsx("flex items-center justify-center rounded-full")}
      style={{ width: size, height: size, backgroundColor: bgColor }}
      {...props}
    ></div>
  );
};

export default ImgCircle;

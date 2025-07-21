import clsx from "clsx";
import type { PropsWithChildren } from "react";
import React from "react";

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
      className={clsx(
        "flex items-center justify-center rounded-full relative overflow-hidden"
      )}
      style={{ width: size, height: size, backgroundColor: bgColor }}
      {...props}
    >
      {React.Children.map(props.children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ style?: React.CSSProperties }>,
              {
                style: {
                  width: "70%",
                  height: "70%",
                  maxWidth: "70%",
                  maxHeight: "70%",
                  display: "block",
                  margin: "auto",
                  aspectRatio: "1/1",
                  ...((child.props as { style?: React.CSSProperties }).style ||
                    {}),
                },
              }
            )
          : child
      )}
    </div>
  );
};

export default ImgCircle;

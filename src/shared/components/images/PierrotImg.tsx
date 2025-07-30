import type { SVGProps } from "react";
import ImgCircle from "./ImgCircle";
import pierrotImg from "@/assets/images/pierrot.png";
import type { ImgSrcProps } from "./types/imgSrc";

const PierrotImg = ({ size = 90, color = "gray" }: ImgSrcProps) => (
  <ImgCircle size={size} color={color}>
    <img
      src={pierrotImg}
      alt="쏜애플"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </ImgCircle>
);

export default PierrotImg;

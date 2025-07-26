import React from "react";
import ImgCircle from "./ImgCircle";
import oasisImg from "@/assets/images/oasis.png";
import type { ImgSrcProps } from "./types/imgSrc";

const OasisImg = ({ size = 90, color = "gray" }: ImgSrcProps) => (
  <ImgCircle size={size} color={color}>
    <img
      src={oasisImg}
      alt="Oasis"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </ImgCircle>
);

export default OasisImg;

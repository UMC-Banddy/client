import ImgCircle from "./ImgCircle";
import type { ImgSrcProps } from "./types/imgSrc";
import violinGray from "@/assets/icons/ic_violin_gray.png";
import violinWhite from "@/assets/icons/ic_violin_white.png";

const ViolinImg = ({ size = 68, color }: ImgSrcProps) => {
  return (
    <ImgCircle size={size} color={color}>
      <img
        src={color === "gray" ? violinGray : violinWhite}
        alt=""
        width={49 * (size / 68)}
        height={48 * (size / 68)}
      />
    </ImgCircle>
  );
};

export default ViolinImg;

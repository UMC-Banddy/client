import ImgCircle from "./ImgCircle";
import type { ImgSrcProps } from "./types/imgSrc";

interface MicImgProps extends ImgSrcProps {
  color: "red" | "gray" | "red-400" | "gray-700" | "gray-200";
}

const MicImg = ({ size = 68, color }: MicImgProps) => {
  return (
    <ImgCircle size={size} color={color}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={49 * (size / 68)}
        height={48 * (size / 68)}
        viewBox="0 0 49 48"
        fill="none"
      >
        <path
          d="M30.5001 25.8001C32.6062 26.2287 34.7944 25.9674 36.7404 25.0547C38.6863 24.142 40.2865 22.6267 41.3036 20.7333C42.3207 18.8398 42.7007 16.6691 42.3873 14.5427C42.0738 12.4163 41.0836 10.4475 39.5634 8.92811C38.0432 7.40869 36.0739 6.41949 33.9474 6.10715C31.8209 5.7948 29.6503 6.17591 27.7574 7.19401C25.8645 8.21211 24.35 9.813 23.4383 11.7594C22.5266 13.7058 22.2664 15.8942 22.6961 18.0001M30.5001 25.8001L22.6961 18.0021L7.67005 35.1701C6.91949 35.9199 6.49751 36.9371 6.49695 37.998C6.49667 38.5233 6.59986 39.0435 6.80063 39.529C7.00139 40.0144 7.2958 40.4555 7.66705 40.8271C8.0383 41.1988 8.47911 41.4937 8.96432 41.6949C9.44953 41.8962 9.96963 42 10.4949 42.0002C11.5558 42.0008 12.5735 41.5799 13.3241 40.8301L30.5001 25.8001Z"
          stroke={
            color === "gray" || color === "gray-200" ? "#555555" : "#ffffff"
          }
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </ImgCircle>
  );
};

export default MicImg;

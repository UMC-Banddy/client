import ImgCircle from "./ImgCircle";
import type { ImgSrcProps } from "./types/imgSrc";

const DrumImg = ({ size = 68, color }: ImgSrcProps) => {
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
          d="M4.5 4L20.5 20M44.5 4L28.5 20"
          stroke={
            color === "gray" || color === "gray-700" ? "#555555" : "#ffffff"
          }
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24.5 28C35.5457 28 44.5 23.5228 44.5 18C44.5 12.4772 35.5457 8 24.5 8C13.4543 8 4.5 12.4772 4.5 18C4.5 23.5228 13.4543 28 24.5 28Z"
          stroke={color === "gray" ? "#555555" : "#ffffff"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 26.8V42.6M24.5 28V44M24.5 44C19.1957 44 14.1086 42.9464 10.3579 41.0711C6.60714 39.1957 4.5 36.6522 4.5 34V18M24.5 44C29.8043 44 34.8914 42.9464 38.6421 41.0711C42.3929 39.1957 44.5 36.6522 44.5 34V18M34.5 26.8V42.6"
          stroke={color === "gray" ? "#555555" : "#ffffff"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </ImgCircle>
  );
};

export default DrumImg;

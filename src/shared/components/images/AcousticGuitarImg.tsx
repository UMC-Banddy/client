import ImgCircle from "./ImgCircle";
import type { ImgSrcProps } from "./types/imgSrc";

const AcousticGuitarImg = ({ size = 68, color }: ImgSrcProps) => {
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
          d="M24.5 2C11.5 2 1 12.5 1 25.5C1 38.5 11.5 49 24.5 49C37.5 49 48 38.5 48 25.5C48 12.5 37.5 2 24.5 2ZM24.5 45C13.5 45 4.5 36 4.5 25C4.5 14 13.5 5 24.5 5C35.5 5 44.5 14 44.5 25C44.5 36 35.5 45 24.5 45Z"
          fill={
            color === "gray" || color === "gray-200" ? "#555555" : "#ffffff"
          }
        />
        <path
          d="M24.5 8C16.5 8 10 14.5 10 22.5C10 30.5 16.5 37 24.5 37C32.5 37 39 30.5 39 22.5C39 14.5 32.5 8 24.5 8ZM24.5 33C19 33 14.5 28.5 14.5 23C14.5 17.5 19 13 24.5 13C30 13 34.5 17.5 34.5 23C34.5 28.5 30 33 24.5 33Z"
          fill={
            color === "gray" || color === "gray-200" ? "#555555" : "#ffffff"
          }
        />
        <path
          d="M24.5 16C21.5 16 19 18.5 19 21.5C19 24.5 21.5 27 24.5 27C27.5 27 30 24.5 30 21.5C30 18.5 27.5 16 24.5 16ZM24.5 25C22.5 25 21 23.5 21 21.5C21 19.5 22.5 18 24.5 18C26.5 18 28 19.5 28 21.5C28 23.5 26.5 25 24.5 25Z"
          fill={
            color === "gray" || color === "gray-200" ? "#555555" : "#ffffff"
          }
        />
        <path
          d="M24.5 42C23.5 42 22.5 41 22.5 40V11C22.5 10 23.5 9 24.5 9C25.5 9 26.5 10 26.5 11V40C26.5 41 25.5 42 24.5 42Z"
          fill={
            color === "gray" || color === "gray-200" ? "#555555" : "#ffffff"
          }
        />
      </svg>
    </ImgCircle>
  );
};

export default AcousticGuitarImg;

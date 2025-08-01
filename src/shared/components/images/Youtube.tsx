// ... existing code ...
import ImgCircle from "./ImgCircle";
import type { ImgLinksProps } from "./types/imgSrc";

const Youtube = ({ size = 40, color }: ImgLinksProps) => (
  <ImgCircle size={size} color={color}>
    <svg
      width={size * 0.7}
      height={size * 0.7}
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 5C1 3.93913 1.42143 2.92172 2.17157 2.17157C2.92172 1.42143 3.93913 1 5 1H17C18.0609 1 19.0783 1.42143 19.8284 2.17157C20.5786 2.92172 21 3.93913 21 5V13C21 14.0609 20.5786 15.0783 19.8284 15.8284C19.0783 16.5786 18.0609 17 17 17H5C3.93913 17 2.92172 16.5786 2.17157 15.8284C1.42143 15.0783 1 14.0609 1 13V5Z"
        stroke="#E9E9E9"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 6L14 9L9 12V6Z"
        stroke="#E9E9E9"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </ImgCircle>
);

export default Youtube;

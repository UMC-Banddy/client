// ... existing code ...
import ImgCircle from "./ImgCircle";
import type { ImgLinksProps } from "./types/imgSrc";

const Instagram = ({ size = 40, color }: ImgLinksProps) => (
  <ImgCircle size={size} color={color}>
    <svg
      width={size * 0.7}
      height={size * 0.7}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 5C1 3.93913 1.42143 2.92172 2.17157 2.17157C2.92172 1.42143 3.93913 1 5 1H13C14.0609 1 15.0783 1.42143 15.8284 2.17157C16.5786 2.92172 17 3.93913 17 5V13C17 14.0609 16.5786 15.0783 15.8284 15.8284C15.0783 16.5786 14.0609 17 13 17H5C3.93913 17 2.92172 16.5786 2.17157 15.8284C1.42143 15.0783 1 14.0609 1 13V5Z"
        stroke="#E9E9E9"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 4.5V4.51M6 9C6 9.79565 6.31607 10.5587 6.87868 11.1213C7.44129 11.6839 8.20435 12 9 12C9.79565 12 10.5587 11.6839 11.1213 11.1213C11.6839 10.5587 12 9.79565 12 9C12 8.20435 11.6839 7.44129 11.1213 6.87868C10.5587 6.31607 9.79565 6 9 6C8.20435 6 7.44129 6.31607 6.87868 6.87868C6.31607 7.44129 6 8.20435 6 9Z"
        stroke="#E9E9E9"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </ImgCircle>
);

export default Instagram;

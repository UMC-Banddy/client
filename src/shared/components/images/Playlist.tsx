import ImgCircle from "./ImgCircle";
import type { ImgLinksProps } from "./types/imgSrc";

const Playlist = ({ size = 40, color }: ImgLinksProps) => (
  <ImgCircle size={size} color={color}>
    <svg
      width={size * 0.7}
      height={size * 0.7}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 14C1 14.7956 1.31607 15.5587 1.87868 16.1213C2.44129 16.6839 3.20435 17 4 17C4.79565 17 5.55871 16.6839 6.12132 16.1213C6.68393 15.5587 7 14.7956 7 14C7 13.2044 6.68393 12.4413 6.12132 11.8787C5.55871 11.3161 4.79565 11 4 11C3.20435 11 2.44129 11.3161 1.87868 11.8787C1.31607 12.4413 1 13.2044 1 14ZM11 14C11 14.7956 11.3161 15.5587 11.8787 16.1213C12.4413 16.6839 13.2044 17 14 17C14.7956 17 15.5587 16.6839 16.1213 16.1213C16.6839 15.5587 17 14.7956 17 14C17 13.2044 16.6839 12.4413 16.1213 11.8787C15.5587 11.3161 14.7956 11 14 11C13.2044 11 12.4413 11.3161 11.8787 11.8787C11.3161 12.4413 11 13.2044 11 14Z"
        stroke="#E9E9E9"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 14V1H17V14M7 5H17"
        stroke="#E9E9E9"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </ImgCircle>
);

export default Playlist;

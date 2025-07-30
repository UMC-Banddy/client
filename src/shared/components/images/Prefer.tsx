// ... existing code ...
import ImgCircle from "./ImgCircle";
import type { ImgLinksProps } from "./types/imgSrc";

const Prefer = ({ size = 40, color }: ImgLinksProps) => (
  <ImgCircle size={size} color={color}>
    <svg
      width={size * 0.7}
      height={size * 0.7}
      viewBox="0 0 17 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6429 1V5.28571C10.6429 5.56987 10.7558 5.8424 10.9567 6.04333C11.1576 6.24426 11.4301 6.35714 11.7143 6.35714H16"
        stroke="#E9E9E9"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8571 20.2857H3.14286C2.57454 20.2857 2.02949 20.06 1.62763 19.6581C1.22576 19.2562 1 18.7112 1 18.1429V3.14286C1 2.57454 1.22576 2.02949 1.62763 1.62763C2.02949 1.22576 2.57454 1 3.14286 1H10.6429L16 6.35714V18.1429C16 18.7112 15.7742 19.2562 15.3724 19.6581C14.9705 20.06 14.4255 20.2857 13.8571 20.2857Z"
        stroke="#E9E9E9"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.49998 14.9284C8.49998 15.2126 8.3871 15.4851 8.18617 15.686C7.98524 15.887 7.71272 15.9999 7.42856 15.9999C7.1444 15.9999 6.87187 15.887 6.67094 15.686C6.47001 15.4851 6.35713 15.2126 6.35713 14.9284C6.35713 14.6443 6.47001 14.3717 6.67094 14.1708C6.87187 13.9699 7.1444 13.857 7.42856 13.857C7.71272 13.857 7.98524 13.9699 8.18617 14.1708C8.3871 14.3717 8.49998 14.6443 8.49998 14.9284ZM8.49998 14.9284V9.57129L10.6428 10.6427"
        stroke="#E9E9E9"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </ImgCircle>
);

export default Prefer;

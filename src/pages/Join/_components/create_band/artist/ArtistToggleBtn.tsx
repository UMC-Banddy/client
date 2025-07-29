import type { ButtonHTMLAttributes } from "react";
import checkIcon from "@/assets/icons/join/ic_check.svg";

interface ArtistToggleBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  thumbnail: string;
  toggled: boolean;
}

const ArtistToggleBtn = ({
  children,
  thumbnail,
  toggled,
  ...props
}: ArtistToggleBtnProps) => {
  return (
    <div className="flex flex-col items-center gap-[8px]">
      <button
        className="relative size-[107px] rounded-full bg-[#959595] bg-cover bg-no-repeat cursor-pointer"
        style={{ backgroundImage: `url(${thumbnail})` }}
        {...props}
      >
        {toggled && (
          <>
            <div
              className="absolute top-[0] left-[0] size-full z-10"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))",
              }}
            ></div>
            <img
              className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-20"
              src={checkIcon}
              alt=""
            />
          </>
        )}
      </button>
      <p className="w-full text-hakgyo-r-14 text-[#fff] text-center">
        {children}
      </p>
    </div>
  );
};

export default ArtistToggleBtn;

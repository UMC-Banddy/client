import clsx from "clsx";

interface ToggleBtnProps {
  children: React.ReactNode;
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleBtn = ({ children, toggle, setToggle }: ToggleBtnProps) => {
  return (
    <div className="flex items-center gap-[8px]">
      <button
        className={clsx(
          "flex justify-center items-center size-[22px] rounded-full cursor-pointer",
          toggle ? "bg-[#E9E9E9]" : "bg-[#959595] "
        )}
        onClick={() => setToggle(!toggle)}
      >
        {toggle && (
          <div className="size-[12px] rounded-full bg-[#D13D55]"></div>
        )}
      </button>
      <p
        className={clsx(
          "text-wanted-sb-13",
          toggle ? "text-[#E9E9E9]" : "text-[#959595]"
        )}
      >
        {children}
      </p>
    </div>
  );
};

export default ToggleBtn;

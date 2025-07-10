import check from "@/assets/icons/join/ic_check.svg";

interface CheckBoxProps {
  checked: boolean;
  onClick: () => void;
  checkboxColor?: string;
}

const CheckBox = ({
  checked,
  onClick,
  checkboxColor = "#E9E9E9",
}: CheckBoxProps) => {
  return checked ? (
    <button
      className="p-[0] bg-transparent border-none cursor-pointer"
      onClick={onClick}
    >
      <img src={check} alt="check" />
    </button>
  ) : (
    <button
      className="p-[0] bg-transparent border-none cursor-pointer"
      onClick={onClick}
    >
      <div
        className="size-[30px] rounded-full"
        style={{ backgroundColor: checkboxColor }}
      ></div>
    </button>
  );
};

export default CheckBox;

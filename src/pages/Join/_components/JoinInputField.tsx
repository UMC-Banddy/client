import type { InputHTMLAttributes } from "react";

interface JoinInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  isNecessary?: boolean;
}

const JoinInputField = ({ isNecessary, ...props }: JoinInputFieldProps) => {
  return (
    <div className="relative flex justify-between py-[12px] w-full border-b-[0.75px] border-[#959595]">
      <input
        type="text"
        placeholder="밴드 이름을 입력하세요."
        className="w-full h-full bg-transparent border-none text-hakgyo-r-16 text-[#959595] focus:outline-none"
        {...props}
      />
      {isNecessary && (
        <p className="absolute right-[0] text-hakgyo-r-16 text-[#C7242D]">*</p>
      )}
    </div>
  );
};

export default JoinInputField;

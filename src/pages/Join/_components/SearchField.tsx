import clsx from "clsx";
import search from "@/assets/icons/join/ic_search.svg";

interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SearchField = ({ className, ...props }: SearchFieldProps) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-[10px] px-[16px] w-full h-[42px] rounded-[10px] bg-[#E9E9E9]",
        className
      )}
    >
      <img className="size-[24px]" src={search} alt="search" />
      <input
        type="text"
        className="w-full h-full bg-transparent border-none text-hakgyo-r-14 focus:outline-none"
        {...props}
      />
    </div>
  );
};

export default SearchField;

import host from "@/assets/icons/join/ic_host.svg";

interface BandChatProps {
  isHost?: boolean;
}

const BandChat = ({ isHost = false }: BandChatProps) => {
  return (
    <button className="flex justify-between items-center w-full bg-transparent border-none cursor-pointer">
      <div className="flex items-center gap-[12px]">
        <div className="bg-[#777] size-[50px]"></div>
        <div className="flex flex-col gap-[4px] text-start">
          <p className="flex items-center gap-[4px] text-hakgyo-r-16 text-[#fff]">
            {isHost && <img className="size-[18px]" src={host} alt="" />}
            저희왜색짙어요
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center size-[22px] rounded-full bg-[#C7242D] text-[#fff] text-wanted-sb-10">
        11
      </div>
    </button>
  );
};

export default BandChat;

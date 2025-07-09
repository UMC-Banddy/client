const NormalChat = () => {
  return (
    <button className="flex justify-between items-center w-full bg-transparent border-none cursor-pointer">
      <div className="flex items-center gap-[12px]">
        <div className="rounded-full bg-[#777] size-[50px]"></div>
        <div className="flex flex-col gap-[4px] text-start">
          <p className="text-hakgyo-r-16 text-[#fff]">저희왜색짙어요</p>
          <p className="text-hakgyo-r-14 text-[#959595]">
            애국자, 트로피칼나이트, 너울 외 3명
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center size-[22px] rounded-full bg-[#C7242D] text-[#fff] text-wanted-sb-10">
        11
      </div>
    </button>
  );
};

export default NormalChat;

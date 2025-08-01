import downArrow from "@/assets/icons/join/ic_down_arrow.svg";
import guitar from "@/assets/icons/join/ic_guitar.svg";
import moodHeart from "@/assets/icons/join/ic_mood_heart.svg";
import NormalChat from "./_components/chat/NormalChat";
import BandChat from "./_components/chat/BandChat";
import { useEffect, useState } from "react";
import CategoryContentBtn from "./_components/chat/CategoryContentBtn";
import chatPlus from "@/assets/icons/join/ic_chat_plus.svg";
import handRock from "@/assets/icons/join/ic_hand_rock.svg";
import plus from "@/assets/icons/join/ic_plus.svg";
import { API } from "@/api/API";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const [openChatCategory, setOpenChatCategory] = useState(false);
  const [category, setCategory] = useState("전체 채팅방");
  const [openFloatingBtn, setOpenFloatingBtn] = useState(false);

  const [chatRooms, setChatRooms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await API.get("/api/chat/rooms");
      setChatRooms(data);
      console.log(data);
      console.log(chatRooms);
    };
    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen w-[393px] mx-auto px-[24px] pt-[12px]">
      <h1 className="text-hel-26 text-[#fff]">JOIN</h1>
      <div className="flex justify-between mt-[24px] w-full relative">
        <button
          className="flex justify-center items-center gap-[4px] w-[142px] h-[48px] bg-transparent border-[1.5px] border-[#E9E9E9] rounded-[5px] text-hakgyo-b-17 whitespace-nowrap cursor-pointer text-[#fff]"
          onClick={() => setOpenChatCategory(!openChatCategory)}
        >
          {category} <img src={downArrow} alt="" />
        </button>
        {openChatCategory && (
          <div className="flex flex-col absolute top-[5.5px] translate-y-[33.3%] border-[1.5px] border-[#E9E9E9] rounded-[5px] bg-[#292929]">
            <CategoryContentBtn
              onClick={() => {
                setCategory("전체 채팅방");
                setOpenChatCategory(!openChatCategory);
              }}
            >
              전체 채팅방
            </CategoryContentBtn>
            <CategoryContentBtn
              onClick={() => {
                setCategory("일반 채팅방");
                setOpenChatCategory(!openChatCategory);
              }}
            >
              일반 채팅방
            </CategoryContentBtn>
            <CategoryContentBtn
              onClick={() => {
                setCategory("밴드 채팅방");
                setOpenChatCategory(!openChatCategory);
              }}
            >
              밴드 채팅방
            </CategoryContentBtn>
          </div>
        )}
        <div className="flex">
          <button
            className="p-[0] bg-transparent border-none cursor-pointer"
            onClick={() => navigate("/join/saved-band")}
          >
            <img src={guitar} alt="" />
          </button>
          <button className="p-[0] bg-transparent border-none cursor-pointer">
            <img src={moodHeart} alt="" />
          </button>
        </div>
      </div>
      <section className="flex flex-col gap-[19px] mt-[48px] w-full">
        {/* 출력 부분 API 연결 */}
        {(category === "전체 채팅방" || category === "일반 채팅방") && (
          <NormalChat />
        )}
        {(category === "전체 채팅방" || category === "밴드 채팅방") && (
          <BandChat isHost={true} />
        )}
        {(category === "전체 채팅방" || category === "밴드 채팅방") && (
          <BandChat />
        )}
      </section>

      {/* floating btn */}
      <div className="fixed bottom-[116px] right-[16px] z-[60]">
        {openFloatingBtn && (
          <div className="flex flex-col gap-[16px] mb-[16px]">
            <button
              className="flex justify-center items-center size-[61px] border-none rounded-full bg-[#fff] cursor-pointer"
              onClick={() => navigate("/join/create-chat")}
            >
              <img src={chatPlus} alt="+"></img>
            </button>
            <button
              className="flex justify-center items-center size-[61px] border-none rounded-full bg-[#fff] cursor-pointer"
              onClick={() => {
                navigate("/join/create-band");
              }}
            >
              <img src={handRock} alt="+"></img>
            </button>
          </div>
        )}
        <button
          onClick={() => setOpenFloatingBtn(!openFloatingBtn)}
          className="flex justify-center items-center size-[61px] border-none rounded-full bg-[#B42127] cursor-pointer"
        >
          <img src={plus} alt="+"></img>
        </button>
      </div>
    </main>
  );
};

export default Join;

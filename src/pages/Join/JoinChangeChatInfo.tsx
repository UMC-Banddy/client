import { useEffect, useRef, useState } from "react";
import happy from "@/assets/icons/join/ic_mood_happy.svg";
import cameraBtn from "@/assets/icons/join/ic_camera_btn.svg";
import MuiDialog from "@/shared/components/MuiDialog";
import CommonBtn from "@/shared/components/CommonBtn";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "@/api/API";
import JoinHeader from "./_components/JoinHeader";
import clsx from "clsx";

const JoinChangeChatInfo = () => {
  const [name, setName] = useState("");
  const [enableConfirmBtn, setEnableConfirmBtn] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { roomId } = useLocation().state;
  const navigate = useNavigate();

  useEffect(() => {
    setEnableConfirmBtn(name.length > 0);
  }, [name]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    setImgSrc(url);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleCreateChat = async () => {
    const formData = new FormData();
    const payload = {
      roomId,
      roomName: name,
    };
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json; charset=UTF-8",
      })
    );

    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    await API.patch("/api/chat/rooms", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    navigate("/join");
  };

  return (
    <main className="flex flex-col items-center relative p-[16px] min-h-screen w-[393px] mx-auto">
      <JoinHeader
        enableConfirmBtn={enableConfirmBtn}
        onClick={handleCreateChat}
      />

      <div
        className="relative mt-[30px] mb-[40px] size-[162px] rounded-full bg-[#CACACA] flex items-center justify-center"
        style={{
          backgroundImage: imgSrc ? `url(${imgSrc})` : "",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={happy}
          alt="happy mood"
          className={clsx("size-[112px]", imgSrc ? "hidden" : "")}
        />
        <button
          className="absolute right-[0] bottom-[0] p-[0] size-[39px] bg-transparent border-none cursor-pointer"
          onClick={() => setOpenDialog(true)}
        >
          <img className="size-full" src={cameraBtn} alt="camera" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />

      <div className="mx-[8px] flex justify-between py-[12px] w-full border-b-[0.75px] border-[#959595]">
        <input
          type="text"
          placeholder="그룹 이름을 입력해주세요."
          className="w-full h-full bg-transparent border-none text-hakgyo-r-16 text-[#fff] focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-hakgyo-r-14 text-[#959595]">{name.length}/10</p>
      </div>

      <div className="mt-[16px] w-full">
        <p className="text-hakgyo-r-14 text-[#959595]">
          한 번 설정한 프로필 사진과 이름은 바꿀 수 없습니다. <br />
          신중하게 결정해주세요.
        </p>
      </div>

      <MuiDialog open={openDialog} setOpen={setOpenDialog}>
        <div className="flex flex-col items-center justify-between pt-[62px] pb-[28px] px-[26px] w-[336px] h-[229px]">
          <div className="flex flex-col items-center gap-[12px]">
            <p className="text-hakgyo-b-24">채팅방 사진 등록</p>
            <p className="text-hakgyo-r-14 text-[#555]">
              앨범에서 사진을 등록하시겠습니까?
            </p>
          </div>
          <div className="flex gap-[8px]">
            <CommonBtn color="gray" onClick={() => setOpenDialog(false)}>
              아니오
            </CommonBtn>
            <CommonBtn
              color="red"
              onClick={() => {
                setOpenDialog(false);
                openFileSelector();
              }}
            >
              예
            </CommonBtn>
          </div>
        </div>
      </MuiDialog>
    </main>
  );
};

export default JoinChangeChatInfo;

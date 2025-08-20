import guitarActivated from "@/assets/icons/join/ic_guitar_activated.svg";
// import moodHeart from "@/assets/icons/join/ic_mood_heart.svg";
import volumeOff from "@/assets/icons/join/ic_volume_off.svg";
import volumeOn from "@/assets/icons/join/ic_volume_on.svg";
import star from "@/assets/icons/join/ic_star.svg";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@mui/material";
import closeBtn from "@/assets/icons/join/ic_close_btn.svg";
import StatusIndicator from "../_components/saved_band/StatusIndicator";
import fileMusic from "@/assets/icons/join/saved_band/ic_file_music.svg";
import music from "@/assets/icons/join/saved_band/ic_music_white.svg";
import users from "@/assets/icons/join/saved_band/ic_users.svg";
import youtubeOutlined from "@/assets/icons/join/saved_band/ic_youtube_outlined.svg";
import instagramOutlined from "@/assets/icons/join/saved_band/ic_instagram_outlined.svg";
import tiktokOutlined from "@/assets/icons/join/saved_band/ic_tiktok_outlined.svg";
import polygon from "@/assets/icons/join/saved_band/ic_polygon7.svg";
import { useLocation, useParams } from "react-router-dom";
import { API } from "@/api/API";
import type { BandDetail } from "@/types/band";
import MuiDialog from "@/shared/components/MuiDialog";
import CommonBtn from "@/shared/components/CommonBtn";
import star3 from "@/assets/icons/join/saved_band/ic_star_3.svg";
import { useNavigate } from "react-router-dom";
// import { showMembers } from "../_utils/showMembers";

const SavedBandDetail = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const [data, setData] = useState<BandDetail>();

  const navigate = useNavigate();
  const { memberSummary, soundUrl } = useLocation().state;

  const { id } = useParams();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await API.get(`/api/band/${id}/detail`);
      setData(data);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [isPlaying, soundUrl]);

  const handleDeleteSaving = async () => {
    try {
      await API.delete(`/api/bands/${id}/bookmark`);
      navigate("/join/saved-band");
      setShowDeleteDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleJoinBand = async () => {
  //   // 채팅으로 이동
  // };

  return (
    <main className="relative min-h-screen w-[393px] mx-auto px-[24px] pt-[12px]">
      <div className="flex justify-end w-full mb-[24px]">
        <button
          className="p-[0] bg-transparent border-none cursor-pointer"
          onClick={() => navigate("/join")}
        >
          <img src={guitarActivated} alt="" className="size-[48px]" />
        </button>
        {/* <button className="p-[0] bg-transparent border-none cursor-pointer">
          <img src={moodHeart} alt="" className="size-[48px]" />
        </button> */}
      </div>

      <section className="flex flex-col items-center">
        <div className="relative size-[337px] bg-[#777]">
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${data?.profileImageUrl})`,
            }}
          ></div>
          <div
            className="absolute top-0 left-0 w-full h-full z-10"
            onClick={() => setShowDetail(!showDetail)}
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%)",
            }}
          ></div>
          <img
            src={isPlaying ? volumeOn : volumeOff}
            alt=""
            className="absolute bottom-[4px] right-[4px] size-[48px] cursor-pointer z-20"
            onClick={() => setIsPlaying((prev) => !prev)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-[8px] mt-[24px] mb-[44px]">
        <p className="text-hakgyo-b-24 text-[#fff]">{data?.bandName}</p>
        <p className="text-hakgyo-r-14 text-[#CACACA]">{memberSummary}</p>
      </section>

      <section className="flex justify-between">
        <button
          className="w-[164px] h-[50px] rounded-[61px] bg-[#CACACA] text-ibm-sb-16 text-[#B42127]"
          onClick={() => setShowDeleteDialog(true)}
        >
          삭제
        </button>
        <button
          className="flex justify-center items-center gap-[4px] w-[164px] h-[50px] rounded-[61px] bg-[#B42127] text-ibm-sb-16 text-[#fff]"
          onClick={() => setShowJoinDialog(true)}
        >
          <img src={star} alt="" />
          JOIN
        </button>
      </section>

      {/* ThumbnailDialog */}
      <Dialog
        open={showDetail}
        onClose={() => setShowDetail(false)}
        sx={{
          "& .css-10d30g3-MuiPaper-root-MuiDialog-paper": {
            margin: "0",
          },
        }}
      >
        <section
          className="flex flex-col items-center relative w-[361px] h-[485px] rounded-[16px] shadow-[0_4px_13px_0_rgba(0,0,0,0.25)]"
          style={{
            backgroundColor:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.81) 0%, rgba(255, 255, 255, 0.45) 100%)",
          }}
        >
          <button
            className="absolute right-0 bg-transparent border-none cursor-pointer"
            onClick={() => setShowDetail(false)}
          >
            <img src={closeBtn} alt="" />
          </button>

          <h1 className="mt-[64px] text-hakgyo-b-28">{data?.bandName}</h1>
          <div className="flex gap-[8px] mt-[20px] mb-[32px]">
            <StatusIndicator status="red" src={fileMusic} />
            <StatusIndicator status="red" src={music} />
            <StatusIndicator status="red" src={users} />
            <StatusIndicator status="black" src={youtubeOutlined} />
            <StatusIndicator status="black" src={instagramOutlined} />
            <StatusIndicator status="black" src={tiktokOutlined} />
          </div>

          <section className="pl-[36px] pr-[53px] w-full">
            <div className="flex justify-start gap-[8px] text-ibm-sb-16">
              <img src={polygon} alt="" />
              <p>
                {data?.ageRange === "0대 이상" ? "나이 무관" : data?.ageRange}
              </p>
              <div className="w-[0.5px] h-[24px] bg-[#292929]" />
              <p>{data?.genderCondition}</p>
              <div className="w-[0.5px] h-[24px] bg-[#292929]" />
              <p>{data?.region}</p>
            </div>

            <article className="mt-[28px] h-[156px] overflow-scroll text-hakgyo-r-16">
              {data?.description}
            </article>
          </section>
          <p className="absolute left-[36px] bottom-[32px] text-wanted-sb-12">
            마감: {data?.endDate}
          </p>
        </section>
      </Dialog>

      {/* 삭제 Dialog */}
      <MuiDialog open={showDeleteDialog} setOpen={setShowDeleteDialog}>
        <div className="flex flex-col justify-end items-center pb-[44px] w-[336px] h-[229px]">
          <h1 className="text-hakgyo-b-24">저장한 밴드 삭제</h1>
          <p className="mt-[12px] mb-[44px] text-hakgyo-r-14">
            '{data?.bandName}'을 삭제하시겠습니까?
          </p>
          <div className="flex gap-[8px]">
            <CommonBtn color="gray" onClick={() => setShowDeleteDialog(false)}>
              취소
            </CommonBtn>
            <CommonBtn color="red" onClick={handleDeleteSaving}>
              삭제
            </CommonBtn>
          </div>
        </div>
      </MuiDialog>

      {/* JOIN Dialog */}
      <Dialog
        open={showJoinDialog}
        onClose={() => setShowJoinDialog(false)}
        sx={{
          "& .css-10d30g3-MuiPaper-root-MuiDialog-paper": {
            margin: "0",
            borderRadius: "14px",
          },
        }}
      >
        <div className="flex flex-col items-center pt-[26.5px] w-[361px] h-[287px]">
          <img src={star3} alt="" />
          <h1 className="mt-[32px] text-hakgyo-b-24">
            밴드에 조인하시겠습니까?
          </h1>
          <p className="mt-[12px] mb-[32px] text-hakgyo-r-14 text-center">
            예를 누르면 밴드 지원 1:1 채팅방에 <br />
            입장합니다.
          </p>
          <div className="flex gap-[8px]">
            <CommonBtn color="gray" onClick={() => setShowJoinDialog(false)}>
              아니오
            </CommonBtn>
            <CommonBtn color="red" onClick={() => setShowJoinDialog(false)}>
              예
            </CommonBtn>
          </div>
        </div>
      </Dialog>
    </main>
  );
};

export default SavedBandDetail;

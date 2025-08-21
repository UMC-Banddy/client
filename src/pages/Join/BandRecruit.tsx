import back from "@/assets/icons/join/ic_back.svg";
import dotsVertical from "@/assets/icons/join/ic_dots_vertical.svg";
// import mic from "@/assets/icons/join/ic_mic.svg";
// import micRed from "@/assets/icons/join/ic_mic_red.svg";
// import guitar from "@/assets/icons/join/ic_guitar_brighter.svg";
import {
  mic,
  electricGuitar,
  acousticGuitar,
  bass,
  drum,
  piano,
  trumpet,
  violin,
} from "@/assets/icons/join/band_recruit";
import RecruitChat from "./_components/band_recruit/RecruitChat";
import { useState, useEffect, useRef, useCallback } from "react";
import BandMenuContentBtn from "./_components/band_recruit/BandMenuContentBtn";
import CheckBox from "./_components/band_recruit/CheckBox";
import MuiDialog from "@/shared/components/MuiDialog";
import CommonBtn from "@/shared/components/CommonBtn";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "@/api/API";
import type { BandDetail } from "@/types/band";
import { parseToKoreanText } from "./_utils/parseToKoreanText";
import clsx from "clsx";

const sessionsMap = {
  "🎤 보컬 🎤": mic,
  "🎸 일렉 기타 🎸": electricGuitar,
  "🪕 어쿠스틱 기타 🪕": acousticGuitar,
  "🎵 베이스 🎵": bass,
  "🥁 드럼 🥁": drum,
  "🎹 키보드 🎹": piano,
  "🎻 바이올린 🎻": violin,
  "🎺 트럼펫 🎺": trumpet,
};

interface Chat {
  bandName: string;
  bandImage: string;
  sessions: string[];
  status: string;
  bandChatList: [
    {
      roomId: number;
      nickname: string;
      imageUrl: string | null;
      session: string;
      content: string;
      lastMessageAt: string | null;
      passFail: "PENDING" | "PASS" | "FAIL";
    }
  ];
}

const BandRecruit = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const [checkEnabled, setCheckEnabled] = useState(false);
  const [checkedId, setCheckedId] = useState<number[]>([]);
  const [checkedIdLimitedAt4, setCheckedIdLimitedAt4] = useState<number[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPassDialog, setOpenPassDialog] = useState(false);
  const [isPassDialog, setIsPassDialog] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const [bandDetail, setBandDetail] = useState<BandDetail>();
  const [chats, setChats] = useState<Chat>();

  // Toast state for custom UI alert
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertFading, setAlertFading] = useState(false);
  const alertTimers = useRef<number[]>([]);

  const fetchData = useCallback(async () => {
    const { data } = await API.get(`/api/band/${id}/detail`);
    setBandDetail(data);
  }, [id]);

  const fetchChat = useCallback(async () => {
    const { data } = await API.get(`/api/recruitments/${id}/applications`);
    setChats(data.result);
  }, [id]);

  useEffect(() => {
    fetchData();
    fetchChat();
  }, [fetchData, fetchChat]);

  // Cleanup any pending alert timers on unmount
  useEffect(() => {
    return () => {
      alertTimers.current.forEach((t) => clearTimeout(t));
      alertTimers.current = [];
    };
  }, []);

  useEffect(() => {
    if (checkedId.length > 4) {
      setCheckedIdLimitedAt4(checkedId.slice(0, 4));
    } else {
      setCheckedIdLimitedAt4(checkedId);
    }
  }, [checkedId]);

  const handleDelete = async () => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ bandId: id, status: "ENDED" }));

      await API.patch("/api/recruitments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/join");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePass = async (status: "PASS" | "FAIL") => {
    try {
      // 일괄 PATCH 요청을 모두 대기
      await Promise.all(
        checkedId.map((roomId) =>
          API.patch(`/api/recruitments/${id}`, {
            applicantUpdate: [
              {
                roomId,
                status,
              },
            ],
          })
        )
      );

      // 데이터 재조회 및 선택 초기화
      await fetchChat();
      setCheckedId([]);
      setCheckEnabled(false);

      const message = status === "PASS" ? "합격" : "불합격";
      showAlert(`일괄 ${message} 처리가 완료되었습니다.`);
      setOpenPassDialog(false);
    } catch (error) {
      console.log(error);
      showAlert("오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const showAlert = (message: string) => {
    // Clear existing timers to restart animation
    alertTimers.current.forEach((t) => clearTimeout(t));
    alertTimers.current = [];

    setAlertMsg(message);
    setAlertVisible(true);
    setAlertFading(false);

    // Start fade after 2.5s, remove after 3s
    const t1 = window.setTimeout(() => setAlertFading(true), 2500);
    const t2 = window.setTimeout(() => {
      setAlertVisible(false);
      setAlertFading(false);
    }, 3000);

    alertTimers.current.push(t1, t2);
  };

  return (
    <main className="relative min-h-screen w-[393px] mx-auto">
      {/* Toast Alert */}
      {alertVisible && (
        <div
          className={
            "fixed bottom-[20px] left-1/2 -translate-x-1/2 z-[100] transition-opacity duration-500 " +
            (alertFading ? "opacity-0" : "opacity-100")
          }
        >
          <div className="px-[17px] py-[8.5px] rounded-[20px] bg-[#121212] text-[#E9E9E9] text-hakgyo-r-16 shadow-md whitespace-nowrap">
            {alertMsg}
          </div>
        </div>
      )}
      <section
        className="flex flex-col justify-between relative ml-[calc(50%_-_50vw)] mr-[calc(50%_-_50vw)] h-[228px] bg-cover bg-center bg-no-repeat px-[16px] pt-[16px]"
        style={{
          background: `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${bandDetail?.profileImageUrl}) lightgray 50% / cover no-repeat`,
        }}
      >
        <div className="flex justify-between">
          <button
            className="p-[0] bg-transparent border-none cursor-pointer"
            onClick={() => navigate("/join")}
          >
            <img src={back} alt="back" />
          </button>
          <button
            className="p-[0] bg-transparent border-none cursor-pointer"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <img src={dotsVertical} alt="dotsVertical" />
          </button>
          {openMenu && (
            <div className="flex flex-col absolute top-[0] right-[12px] translate-y-[33.3%]">
              <BandMenuContentBtn
                radius="top"
                onClick={() => {
                  setCheckEnabled(true);
                  setOpenMenu(false);
                }}
              >
                합격 / 불합격 관리
              </BandMenuContentBtn>
              <BandMenuContentBtn
                onClick={() => {
                  navigate("/join/create-band", {
                    state: {
                      isEditing: true,
                      bandId: id,
                    },
                  });
                  setOpenMenu(false);
                }}
              >
                밴드 모집방 편집
              </BandMenuContentBtn>
              <BandMenuContentBtn
                radius="bottom"
                onClick={() => {
                  setOpenDeleteDialog(true);
                  setOpenMenu(false);
                }}
              >
                밴드 모집방 삭제
              </BandMenuContentBtn>
            </div>
          )}
        </div>

        {/* 방 삭제 dialog */}
        <MuiDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog}>
          <div className="flex flex-col items-center pt-[62px] pb-[28px] px-[26px] w-[336px] h-[332px] bg-[#E9E9E9] text-center">
            <p className="text-hakgyo-b-24">
              정말
              <br />'{bandDetail?.bandName}'을
              <br />
              삭제하시겠습니까?
            </p>
            <p className="mt-[16px] w-[240px] text-hakgyo-r-14 text-[#555]">
              삭제 시 되돌릴 수 없으며 지원자들의 채팅방에서 모두 나가기 처리가
              됩니다. 또한 밴드 모집방과 관련된 모든 데이터가 삭제되며 확인할 수
              없게 됩니다.{" "}
            </p>
            <div className="flex gap-[16px] mt-[24px]">
              <CommonBtn
                color="gray"
                onClick={() => setOpenDeleteDialog(false)}
              >
                아니오
              </CommonBtn>
              <CommonBtn
                color="red"
                onClick={() => {
                  handleDelete();
                  setOpenDeleteDialog(false);
                }}
              >
                예
              </CommonBtn>
            </div>
          </div>
        </MuiDialog>

        <div className="flex flex-col gap-[8px] mb-[20px]">
          <p className="text-hakgyo-b-24 text-[#fff]">{bandDetail?.bandName}</p>
          <div className="flex items-center gap-[12px]">
            <div
              className={clsx(
                "px-[11px] py-[4px] rounded-full text-[#fff] text-wanted-sb-13",
                chats?.status === "RECRUITING" ? "bg-[#B42127]" : "bg-[#292929]"
              )}
            >
              {chats?.status === "RECRUITING" ? "모집중" : "모집완료"}
            </div>
            {/* <div className="flex gap-[4px]">
              <img className="size-[16px]" src={mic} alt="mic" />
              <p className="text-wanted-sb-13 text-[#CACACA]">보컬</p>
            </div>
            <div className="flex gap-[4px]">
              <img className="size-[16px]" src={guitar} alt="guitar" />
              <p className="text-wanted-sb-13 text-[#CACACA]">일렉기타</p>
            </div> */}
            <div className="flex gap-[12.5px]">
              {chats?.sessions?.map((session, index) => {
                return (
                  <div key={index} className="flex gap-[4px] items-center">
                    {session in sessionsMap && (
                      <img
                        className="size-[16px]"
                        src={sessionsMap[session as keyof typeof sessionsMap]}
                        alt="session"
                      />
                    )}
                    <p className="text-wanted-sb-13 text-[#CACACA]">
                      {parseToKoreanText(session)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-[20px] px-[16px] pt-[32px] w-full">
        {chats?.bandChatList.map((item) => {
          const isChecked = checkedId.includes(item.roomId);
          return (
            <RecruitChat
              key={item.roomId}
              roomId={item.roomId}
              name={item.nickname}
              thumbnail={item.imageUrl}
              content={item.content}
              lastMessageAt={item.lastMessageAt}
              passFail={item.passFail}
              enableCheck={checkEnabled}
              checked={isChecked}
              onCheck={() => {
                if (isChecked) {
                  // 선택 해제
                  setCheckedId((prev) => prev.filter((i) => i !== item.roomId));
                } else {
                  setCheckedId((prev) => [...prev, item.roomId]);
                }
              }}
            />
          );
        })}
      </section>

      {checkEnabled && (
        <section className="flex justify-between items-center fixed bottom-[104px] px-[20px] w-[393px] h-[69px] rounded-t-[12px] bg-[#292929] z-[60]">
          <div className="flex items-center gap-[8px] ">
            <CheckBox
              checked={checkedId.length === chats?.bandChatList.length}
              onClick={() => {
                if (checkedId.length === chats?.bandChatList.length) {
                  setCheckedId([]);
                } else {
                  setCheckedId(
                    chats?.bandChatList.map((item) => item.roomId) || []
                  );
                }
              }}
              checkboxColor="#959595"
            />
            <p className="wanted-sb-13 text-[#959595]">전체 선택</p>
          </div>

          <div className="flex gap-[8px]">
            <button
              className="w-[108px] h-[33px] border-none rounded-[100px] bg-[#555] text-ibm-sb-16 text-[#fff] whitespace-nowrap cursor-pointer"
              onClick={() => {
                setIsPassDialog(false);
                setOpenPassDialog(true);
              }}
            >
              불합격 처리
            </button>
            <button
              className="w-[108px] h-[33px] border-none rounded-[100px] bg-[#555] text-ibm-sb-16 text-[#fff] whitespace-nowrap cursor-pointer"
              onClick={() => {
                setIsPassDialog(true);
                setOpenPassDialog(true);
              }}
            >
              합격 처리
            </button>
          </div>

          {/* 합격/불합격 처리 dialog */}
          <MuiDialog open={openPassDialog} setOpen={setOpenPassDialog}>
            <div className="flex flex-col items-center pt-[48px] pb-[27px] px-[40px] w-[334px] bg-[#E9E9E9] text-center">
              <p className="mb-[12px] text-hakgyo-b-24">
                일괄 {isPassDialog ? "합격" : "불합격"}
              </p>
              <p className="mb-[20px] text-wanted-sb-15">
                다음 지원자를 모두 {isPassDialog ? "합격" : "불합격"} 처리
                <br />
                하시겠습니까?
              </p>
              <p className="text-hakgyo-r-14 text-[#555] text-start">
                예를 누르시면 즉시 {isPassDialog ? "합격" : "불합격"} 통보가
                전송되며, 취소할 수 없습니다.{" "}
                {isPassDialog && "또한 친구 신청이 자동으로 발송됩니다."}
              </p>

              <section className="mt-[28px] w-full">
                {
                  // checkedId === roomId인 유저의 정보
                  // roomId가 4 이상이면 앞에 4개만 보여주고, 밑에 '...외 n명' 표시
                  checkedIdLimitedAt4.map((roomId) => {
                    return (
                      <>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-hakgyo-b-17">
                            {
                              chats?.bandChatList.find(
                                (item) => item.roomId === roomId
                              )?.nickname
                            }
                          </p>
                          <div className="flex items-center gap-[4px]">
                            {/* <img src={micRed} alt="mic" /> */}
                            <p className="text-wanted-sb-13 text-[#B42127]">
                              {parseToKoreanText(
                                chats?.bandChatList.find(
                                  (item) => item.roomId === roomId
                                )?.session || ""
                              )}
                            </p>
                          </div>
                        </div>
                        {checkedId.length > 4 && (
                          <p className="text-wanted-sb-12 text-[#555] text-end">
                            ...외 {checkedId.length - 4}명
                          </p>
                        )}
                      </>
                    );
                  })
                }
              </section>

              <div className="flex gap-[16px] mt-[39px]">
                <CommonBtn
                  color="gray"
                  onClick={() => setOpenPassDialog(false)}
                >
                  아니오
                </CommonBtn>
                <CommonBtn
                  color="red"
                  onClick={() => {
                    handlePass(isPassDialog ? "PASS" : "FAIL");
                  }}
                >
                  예
                </CommonBtn>
              </div>
            </div>
          </MuiDialog>
        </section>
      )}
    </main>
  );
};

export default BandRecruit;

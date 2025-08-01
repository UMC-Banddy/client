import clsx from "clsx";
import { useEffect, useState } from "react";
import RecruitChat from "./_components/band_recruit/RecruitChat";
import SearchField from "./_components/SearchField";
import { API } from "@/api/API";
import { useNavigate } from "react-router-dom";
import JoinHeader from "./_components/JoinHeader";

type Friend = {
  friendId: number;
  otherMemberId: number;
  nickname: string;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
  createdAt: string;
};

const CreateChat = () => {
  const [enableConfirmBtn, setEnableConfirmBtn] = useState(false);
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      const { data } = await API.get("/api/friend");
      setFriends(data);
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    if (checkedList.length > 0) {
      setEnableConfirmBtn(true);
    } else {
      setEnableConfirmBtn(false);
    }
  }, [checkedList]);

  const handleCheckboxClick = (id: number) => {
    if (checkedList.includes(id)) {
      setCheckedList(checkedList.filter((itemId) => itemId !== id));
    } else {
      setCheckedList([...checkedList, id]);
    }
  };

  return (
    <main className="relative p-[16px] min-h-screen w-[393px] mx-auto">
      <JoinHeader
        enableConfirmBtn={enableConfirmBtn}
        onClick={() =>
          navigate("/join/create-chat/2", { state: { checkedList } })
        }
      />

      {checkedList.length > 0 && (
        <section className="flex gap-[20px]">
          {checkedList.map((id) => {
            const friend = friends.find((f) => f.friendId === id);
            return (
              <div key={id} className="flex flex-col items-center gap-[4px]">
                <div
                  className="w-[50px] h-[50px] rounded-full bg-[#777] bg-cover bg-center"
                  style={{ backgroundImage: `url(${friend?.profileImageUrl})` }}
                />
                <p className="text-hakgyo-r-14 text-[#fff]">
                  {friend?.nickname}
                </p>
              </div>
            );
          })}
        </section>
      )}

      <SearchField
        className={clsx(
          "mb-[36px]",
          checkedList.length > 0 ? "mt-[27px]" : "mt-[36px]"
        )}
        placeholder="친구를 검색하세요."
      />

      <section className="flex flex-col gap-[20px]">
        {friends.map((item) => (
          <RecruitChat
            key={item.friendId}
            enableCheck={true}
            checked={checkedList.includes(item.friendId)}
            onCheck={() => {
              handleCheckboxClick(item.friendId);
            }}
            name={item.nickname}
            thumbnail={item?.profileImageUrl}
            isOnlyName={true}
          />
        ))}
      </section>
    </main>
  );
};

export default CreateChat;

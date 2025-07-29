import back from "@/assets/icons/join/ic_back.svg";
import clsx from "clsx";
import { useEffect, useState } from "react";
import RecruitChat from "./_components/band_recruit/RecruitChat";
import SearchField from "./_components/SearchField";

const dummyData = [
  {
    id: 0,
    thumbnail: "",
    name: "noko",
  },
  {
    id: 1,
    thumbnail: "",
    name: "noko",
  },
  {
    id: 2,
    thumbnail: "",
    name: "noko",
  },
];

const CreateChat = () => {
  const [enableConfirmBtn, setEnableConfirmBtn] = useState(false);
  const [checkedList, setCheckedList] = useState<number[]>([]);

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
    <main className="relative p-[16px] min-h-screen w-[393px] mx-auto bg-[#121212]/90">
      <div className="flex justify-between mb-[16px] w-full">
        <button className="p-[0] bg-transparent border-none cursor-pointer">
          <img src={back} alt="back" />
        </button>
        <button
          className={clsx(
            "p-[0] bg-transparent border-none text-ibm-sb-16",
            enableConfirmBtn ? "text-[#79D000] cursor-pointer" : "text-[#555]"
          )}
        >
          확인
        </button>
      </div>

      {checkedList.length > 0 && (
        <section className="flex gap-[20px]">
          {checkedList.map((item) => (
            <div key={item} className="flex flex-col items-center gap-[4px]">
              <div
                className="size-[50px] rounded-full bg-[#777]"
                style={{ backgroundImage: `url(${dummyData[item].thumbnail})` }}
              />
              <p className="text-hakgyo-r-14 text-[#fff]">
                {dummyData[item].name}
              </p>
            </div>
          ))}
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
        {dummyData.map((item) => (
          <RecruitChat
            key={item.id}
            enableCheck={true}
            checked={checkedList.includes(item.id)}
            onCheck={() => {
              handleCheckboxClick(item.id);
            }}
            isOnlyName={true}
          />
        ))}
      </section>
    </main>
  );
};

export default CreateChat;

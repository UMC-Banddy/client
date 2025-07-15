import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./_components/Header";
import bell from "@/assets/icons/my/bell.svg";
import no_bell from "@/assets/icons/my/no-bell.svg";
import ProfileInfo from "./_components/ProfileInfo";
import SectionDivider from "./_components/SectionDivider";
import HashtagList from "./_components/HashTagList";
import ArchiveSection from "./_components/Archive/ArchiveSection";
import ArchiveItem from "./_components/Archive/ArchiveItem";

const MyPage = () => {
  const navigate = useNavigate();
  // 목데이터
  const myProfile = {
    avatar: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRVZlH-Bqpxw2XI_qUxlkg4uI0ewNh8jKqgS8G9x-GXYZzAQj1-",
    name: "BECK",
    bio: "나는 파리의 택시운전사",
    albums: [
      { image: "https://image.yes24.com/momo/TopCate0010/hani/L_1303497.jpg", title: "PARKLIFE" },
      { image: "https://image.fmkorea.com/files/attach/new5/20250607/8489985601_2120028041_a92cded32079ed870400f29e1f826c7a.png", title: "Loveless" },
      { image: "https://upload.wikimedia.org/wikipedia/ko/0/01/%ED%95%91%ED%81%AC_%ED%94%8C%EB%A1%9C%EC%9D%B4%EB%93%9C_-_Wish_You_Were_Here.png", title: "The wall" },
      { image: "https://upload.wikimedia.org/wikipedia/ko/0/01/%ED%95%91%ED%81%AC_%ED%94%8C%EB%A1%9C%EC%9D%B4%EB%93%9C_-_Wish_You_Were_Here.png", title: "The wall" },
    ],
    musics: [
      { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "二月の兵隊", artist: "The cabs" },
      { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "No future for us", artist: "The cabs" },
    ],
    hashtags: [
      "#Britpop", "#J-Rock", "슈게이징 중독자", "#어떤키워드1", "#어떤키워드2", "#어떤키워드3"
    ]
  };
  // 알림 여부 (나중에 API로 대체)
  const hasNotification = true; // false로 바꾸면 알림 없음

  return (
    <div className="min-h-[100vh] w-full flex flex-col bg-[#1C1C1E]">
      <Header
        title="MY"
        rightIcon={<img src={hasNotification ? bell : no_bell} alt="bell" className="text-[#FFFFFF] mb" />}
        rightLink={"/my/notifications"}
      />
      <div className="mt-[15vh]"></div>
      <ProfileInfo
        nickname="BECK"
        avatarUrl="https://siff.kr/wp-content/uploads/2024/11/3.jpg"
        onEdit={() => alert("수정")}
        onShare={() => alert("공유")}
        bio="나는 파리의 택시운전사"
        showEdit={true}
        showShare={true}
      />
      <HashtagList tags={myProfile.hashtags} />
      <SectionDivider />
      <ArchiveSection title="음악 아카이빙" onClick={() => navigate("/archive")}/>
      <div className="w-full flex flex-row gap-[3vw] px-[6vw] overflow-x-auto flex-nowrap scrollbar-hide">
        {myProfile.albums.map((album, i) => (
          <ArchiveItem key={i} coverUrl={album.image} title={album.title} muted />
        ))}
      </div>
    </div>
  );
};

export default MyPage;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./_components/Header";
import ProfileInfo from "./_components/ProfileInfo";
import SectionDivider from "./_components/SectionDivider";
import HashtagList from "./_components/HashTagList";
import ArchiveSection from "./_components/Archive/ArchiveSection";
import MyArchiveItem from "./_components/Archive/MyArchiveItem";
import MuiDialog from "@/shared/components/MuiDialog";
import CommonBtn from "@/shared/components/CommonBtn";

const MyPage = () => {
  const navigate = useNavigate();
  // 목데이터
  const myProfile = {
    avatar:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRVZlH-Bqpxw2XI_qUxlkg4uI0ewNh8jKqgS8G9x-GXYZzAQj1-",
    name: "BECK",
    bio: "나는 파리의 택시운전사",
    albums: [
      {
        image: "https://image.yes24.com/momo/TopCate0010/hani/L_1303497.jpg",
        title: "PARKLIFE",
      },
      {
        image:
          "https://image.fmkorea.com/files/attach/new5/20250607/8489985601_2120028041_a92cded32079ed870400f29e1f826c7a.png",
        title: "Loveless",
      },
      {
        image:
          "https://upload.wikimedia.org/wikipedia/ko/0/01/%ED%95%91%ED%81%AC_%ED%94%8C%EB%A1%9C%EC%9D%B4%EB%93%9C_-_Wish_You_Were_Here.png",
        title: "The wall",
      },
      {
        image:
          "https://upload.wikimedia.org/wikipedia/ko/0/01/%ED%95%91%ED%81%AC_%ED%94%8C%EB%A1%9C%EC%9D%B4%EB%93%9C_-_Wish_You_Were_Here.png",
        title: "The wall",
      },
    ],
    musics: [
      {
        image:
          "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg",
        title: "二月の兵隊",
        artist: "The cabs",
      },
      {
        image:
          "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg",
        title: "No future for us",
        artist: "The cabs",
      },
    ],
    hashtags: [
      "#Britpop",
      "#J-Rock",
      "슈게이징 중독자",
      "#어떤키워드1",
      "#어떤키워드2",
      "#어떤키워드3",
    ],
  };
  // 알림 여부 (나중에 API로 대체)
  const hasNotification = true; // false로 바꾸면 알림 없음
  // const hasNotification = false;
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="min-h-[100vh] w-full flex flex-col">
      <Header title="MY" hasNotification={hasNotification} />
      <div className="mt-[10vh]"></div>
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
      <ArchiveSection
        title="음악 아카이빙"
        onClick={() => navigate("/my/archive")}
      />
      <div className="w-full grid grid-cols-3 gap-x-[4vw] gap-y-[6vw] px-[6vw]">
        {myProfile.albums.map((album, i) => (
          <MyArchiveItem key={i} coverUrl={album.image} title={album.title} />
        ))}
      </div>

      <div
        className="w-full flex flex-col items-center px-[6vw] mt-[5vh] cursor-pointer"
        onClick={() => setLogoutOpen(true)}
      >
        <div className="text-wanted-sb-13 border-b-[1px] border-[#555555] text-[#555555]">
          로그아웃
        </div>
      </div>
      <MuiDialog open={logoutOpen} setOpen={setLogoutOpen}>
        <div className="flex flex-col items-center justify-center bg-[#e9e9e9] rounded-[14px] pt-[7vh] pb-[3vh]">
          <div className="text-hakgyo-b-24 text-[#292929] mb-[1.4vh]">
            로그아웃
          </div>
          <div className="text-hakgyo-r-14 text-[#555555] mb-[5vh] mx-[12vw] w-[61vw] text-center">
            정말 로그아웃 하시겠습니까?
          </div>
          <div className="flex gap-[2vw] w-full justify-center">
            <CommonBtn color="gray" onClick={() => setLogoutOpen(false)}>
              아니요
            </CommonBtn>
            <CommonBtn
              color="red"
              onClick={() => {
                setLogoutOpen(false);
                // 실제 로그아웃 로직 추가 예정
              }}
            >
              예
            </CommonBtn>
          </div>
        </div>
      </MuiDialog>
    </div>
  );
};

export default MyPage;


/* 제로: 마이페이지에 계정이 적용이 되는지 테스트 하기 위해 임시 코드 작성함 (아래)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./_components/Header";
import ProfileInfo from "./_components/ProfileInfo";
import SectionDivider from "./_components/SectionDivider";
import HashtagList from "./_components/HashTagList";
import ArchiveSection from "./_components/Archive/ArchiveSection";
import MyArchiveItem from "./_components/Archive/MyArchiveItem";
import MuiDialog from "@/shared/components/MuiDialog";
import CommonBtn from "@/shared/components/CommonBtn";
import { useUser } from "@/features/setting/hooks/useUser";
import type { SavedTrack } from "@/features/setting/hooks/useUser";

const MyPage = () => {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { data, isLoading, error } = useUser();

  if (isLoading) return <div className="text-white text-center mt-20">로딩 중...</div>;
  if (error || !data) return <div className="text-red-500 text-center mt-20">유저 정보를 불러올 수 없습니다.</div>;

  const { nickname, profileImageUrl, bio, tags, savedTracks } = data;

  return (
    <div className="min-h-[100vh] w-full flex flex-col">
      <Header title="MY" hasNotification={true} />

      <div className="mt-[10vh]" />

      <ProfileInfo
        nickname={nickname}
        avatarUrl={profileImageUrl}
        onEdit={() => alert("수정")}
        onShare={() => alert("공유")}
        bio={bio}
        showEdit={true}
        showShare={true}
      />

      <HashtagList tags={tags} />
      <SectionDivider />
      <ArchiveSection title="음악 아카이빙" onClick={() => navigate("/my/archive")} />

      <div className="w-full grid grid-cols-3 gap-x-[4vw] gap-y-[6vw] px-[6vw]">
        {savedTracks?.map((track: SavedTrack, i: number) => (
          <MyArchiveItem
            key={i}
            coverUrl={track.imageUrl}
            title={track.title}
          />
        ))}
      </div>

      <div
        className="w-full flex flex-col items-center px-[6vw] mt-[5vh] cursor-pointer"
        onClick={() => setLogoutOpen(true)}
      >
        <div className="text-wanted-sb-13 border-b-[1px] border-[#555555] text-[#555555]">로그아웃</div>
      </div>

      <MuiDialog open={logoutOpen} setOpen={setLogoutOpen}>
        <div className="flex flex-col items-center justify-center bg-[#e9e9e9] rounded-[14px] pt-[7vh] pb-[3vh]">
          <div className="text-hakgyo-b-24 text-[#292929] mb-[1.4vh]">로그아웃</div>
          <div className="text-hakgyo-r-14 text-[#555555] mb-[5vh] mx-[12vw] w-[61vw] text-center">
            정말 로그아웃 하시겠습니까?
          </div>
          <div className="flex gap-[2vw] w-full justify-center">
            <CommonBtn color="gray" onClick={() => setLogoutOpen(false)}>아니요</CommonBtn>
            <CommonBtn color="red" onClick={() => {
              setLogoutOpen(false);
              // 로그아웃 로직은 추후 구현
            }}>예</CommonBtn>
          </div>
        </div>
      </MuiDialog>
    </div>
  );
};

export default MyPage;

*/
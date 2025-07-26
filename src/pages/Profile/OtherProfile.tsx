import { useState } from "react";
import ProfileInfo from "@/pages/My/_components/ProfileInfo";
import SectionDivider from "@/pages/Profile/_components/SectionDivider";
import HashtagList from "@/pages/My/_components/HashTagList";
import ArtistGrid from "@/pages/Archive/Artist/ArtistGrid";
import MusicList from "@/pages/Archive/Music/MusicList";
import MyArchiveItem from "@/pages/My/_components/Archive/MyArchiveItem";

export default function OtherProfile() {
  const [activeTab, setActiveTab] = useState<"곡" | "앨범">("곡");

  // 목데이터
  const profile = {
    avatar: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRVZlH-Bqpxw2XI_qUxlkg4uI0ewNh8jKqgS8G9x-GXYZzAQj1-",
    name: "BECK",
    bio: "나는 파리의 택시운전사",
    artists: [
      { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "The cabs" },
      { image: "https://mir-s3-cdn-cf.behance.net/user/230/fe74a51202250825.62130870ceb63.jpg", title: "草東沒有派對" },
      { image: "https://pbs.twimg.com/media/F84cL12bwAAvKI9.jpg", title: "asunojokei" },
      { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "The cabs" },
      { image: "https://mir-s3-cdn-cf.behance.net/user/230/fe74a51202250825.62130870ceb63.jpg", title: "草東沒有派對" },
      { image: "https://pbs.twimg.com/media/F84cL12bwAAvKI9.jpg", title: "asunojokei" },
    ],
    albums: [
      { image: "https://image.yes24.com/momo/TopCate0010/hani/L_1303497.jpg", title: "PARKLIFE" },
      { image: "https://image.fmkorea.com/files/attach/new5/20250607/8489985601_2120028041_a92cded32079ed870400f29e1f826c7a.png", title: "Loveless" },
      { image: "https://upload.wikimedia.org/wikipedia/ko/0/01/%ED%95%91%ED%81%AC_%ED%94%8C%EB%A1%9C%EC%9D%B4%EB%93%9C_-_Wish_You_Were_Here.png", title: "The wall" },
      { image: "https://image.yes24.com/momo/TopCate0010/hani/L_1303497.jpg", title: "PARKLIFE" },
      { image: "https://image.fmkorea.com/files/attach/new5/20250607/8489985601_2120028041_a92cded32079ed870400f29e1f826c7a.png", title: "Loveless" },
      { image: "https://upload.wikimedia.org/wikipedia/ko/0/01/%ED%95%91%ED%81%AC_%ED%94%8C%EB%A1%9C%EC%9D%B4%EB%93%9C_-_Wish_You_Were_Here.png", title: "The wall" },
    ],
    musics: [
      { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "二月の兵隊", artist: "The cabs" },
      { image: "https://cdn-ak.f.st-hatena.com/images/fotolife/a/arakibass/20250110/20250110230234.jpg", title: "No future for us", artist: "The cabs" },
      // ...더 추가
    ],
    hashtags: [
      // "#Britpop", "#J–Rock", "슈게이징 중독자", "#어떤키워드1", "#어떤키워드2", "#어떤키워드3"
    ]
  };

  return (
    <div className="min-h-[100vh] w-full flex flex-col pb-[4vh]">
      <ProfileInfo avatarUrl={profile.avatar} nickname={profile.name} bio={profile.bio} showEdit={false} showShare={false} />
      <HashtagList tags={profile.hashtags} />
      
      <div className="pl-[24px] mb-[1vh]">
        <ArtistGrid items={profile.artists} />
      </div>
      
      <SectionDivider />
      
      <div className="flex gap-[2.5vw] px-[24px] mb-[3.2vh]">
        <button
          onClick={() => setActiveTab("곡")}
          className={`px-[20px] py-[8px] rounded-[19px] text-wanted-sb-15 ${
            activeTab === "곡" 
              ? "bg-[#B42127] text-[#E9E9E9]" 
              : "bg-[#555555] text-[#E9E9E9]"
          }`}
        >
          곡
        </button>
        <button
          onClick={() => setActiveTab("앨범")}
          className={`px-[20px] py-[8px] rounded-[19px] text-wanted-sb-15 ${
            activeTab === "앨범" 
              ? "bg-[#B42127] text-[#E9E9E9]" 
              : "bg-[#555555] text-[#E9E9E9]"
          }`}
        >
          앨범
        </button>
      </div>
      
      <div className="px-[24px]">
        {activeTab === "곡" ? (
          <MusicList 
            items={profile.musics.map(music => ({
              image: music.image,
              title: music.title,
              subtitle: music.artist
            }))} 
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-[16px] gap-y-[20px]">
            {profile.albums.map((album, i) => (
              <MyArchiveItem
                key={i}
                coverUrl={album.image}
                title={album.title}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
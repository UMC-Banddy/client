import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./_components/Header";
import ProfileInfo from "./_components/ProfileInfo";
import ProfileInfoSkeleton from "./_components/ProfileInfoSkeleton";
import SectionDivider from "./_components/SectionDivider";
import HashtagList from "./_components/HashTagList";
import HashTagListSkeleton from "./_components/HashTagListSkeleton";
import ArchiveSection from "./_components/Archive/ArchiveSection";
import MyArchiveItem from "./_components/Archive/MyArchiveItem";
import MyArchiveItemSkeletonList from "./_components/Archive/MyArchiveItemSkeletonList";
import MuiDialog from "@/shared/components/MuiDialog";
import CommonBtn from "@/shared/components/CommonBtn";
import { useProfile } from "@/features/my/hooks/useProfile";
import { useNotificationCount } from "@/features/notification/hooks/useNotificationCount";
import { logout } from "@/features/setting/hooks/useAuth";
import { type SavedTrack } from "@/types/track";

const MyPage = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useProfile();
  const { count: notificationCount } = useNotificationCount();
  const [logoutOpen, setLogoutOpen] = useState(false);

  // 에러가 있으면 처리
  if (error || (!isLoading && !profile)) {
    return (
      <div className="min-h-[100vh] w-full flex items-center justify-center">
        <div className="text-white">{error?.message || "프로필을 불러올 수 없습니다."}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] w-full flex flex-col">
      <Header
        title="MY"
        hasNotification={notificationCount > 0}
      />
      <div className="mt-[10vh]"></div>
      {isLoading ? (
        <>
          <ProfileInfoSkeleton />
          <HashTagListSkeleton />
        </>
      ) : profile ? (
        <>
          <ProfileInfo
            nickname={profile.nickname}
            avatarUrl={profile.profileImageUrl}
            bio={profile.bio}
            showEdit={true}
            showShare={true}
          />
          <HashtagList tags={profile.tags} />
        </>
      ) : null}
      <SectionDivider />
      <ArchiveSection title="음악 아카이빙" onClick={() => navigate("/my/archive")}/>
      {isLoading ? (
        <div className="w-full grid grid-cols-3 gap-x-[20px] gap-y-[16px] px-[24px]">
          <MyArchiveItemSkeletonList count={6} />
        </div>
      ) : (
        <div className="w-full grid grid-cols-3 gap-x-[20px] gap-y-[16px] px-[24px]">
          {profile.savedTracks.map((track: SavedTrack, i: number) => (
            <MyArchiveItem
              key={i}
              coverUrl={track.imageUrl}
              title={track.title}
              externalUrl={track.externalUrl}
            />
          ))}
        </div>
      )}

      <div
        className="w-full flex flex-col items-center mt-[5vh] mb-[7vh] cursor-pointer"
        onClick={() => setLogoutOpen(true)}
      >
        <div className="text-wanted-sb-13 border-b-[1px] border-[#555555] text-[#555555]">로그아웃</div>
      </div>
      <MuiDialog open={logoutOpen} setOpen={setLogoutOpen}>
        <div
          className="flex flex-col items-center justify-center bg-[#e9e9e9] rounded-[14px] pt-[62px] pb-[28px]"
        >
          <div className="text-hakgyo-b-24 text-[#292929] mb-[1.4vh]">로그아웃</div>
          <div className="text-hakgyo-r-14 text-[#555555] mb-[5vh] w-[61vw] max-w-[220px] text-center">정말 로그아웃 하시겠습니까?</div>
          <div className="flex gap-[2vw] w-full justify-center mx-[59px]">
            <CommonBtn color="gray" onClick={() => setLogoutOpen(false)}>
              아니요
            </CommonBtn>
            <CommonBtn 
              color="red" 
              onClick={() => {
                setLogoutOpen(false);
                logout();
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
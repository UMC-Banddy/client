import React from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useBandDetail,
  useBandProfile,
} from "@/features/band/hooks/useBandData";
import profileFallback from "@/assets/images/profile1.png";
import guitarBoy from "@/assets/images/guitar-boy.svg";
import album1 from "@/assets/images/home-album1.svg";

const Skeleton: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212] text-white">
      <div className="w-full h-[220px] bg-[#1E1E1E] animate-pulse" />
      <div className="-mt-12 px-6">
        <div className="w-24 h-24 rounded-full bg-[#2A2A2A] border-4 border-[#121212] animate-pulse" />
        <div className="mt-4 h-6 w-48 bg-[#2A2A2A] rounded animate-pulse" />
        <div className="mt-2 h-4 w-64 bg-[#2A2A2A] rounded animate-pulse" />
      </div>
      <div className="mt-8 px-6 space-y-4">
        <div className="h-5 w-32 bg-[#2A2A2A] rounded animate-pulse" />
        <div className="h-16 w-full bg-[#1E1E1E] rounded-xl animate-pulse" />
        <div className="h-16 w-full bg-[#1E1E1E] rounded-xl animate-pulse" />
        <div className="h-16 w-full bg-[#1E1E1E] rounded-xl animate-pulse" />
      </div>
    </div>
  );
};

const BandDetailPage: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const location = useLocation();
  // 상세 스펙에 맞게 우선 상세만 조회, 프로필은 보조로 사용
  const { data: detailOnly, isLoading: loadingDetail } = useBandDetail(id);
  const { data, isLoading } = useBandProfile(id);

  if (loadingDetail || isLoading || !data) return <Skeleton />;

  const detail = detailOnly ?? data.detail;
  const profile = data.profile;
  const nameParam =
    new URLSearchParams(location.search).get("name") || undefined;
  const bandName =
    detail?.bandName ||
    nameParam ||
    profile?.goalTracks?.[0]?.title ||
    (id ? `밴드 ${id}` : "밴드");

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212] text-white">
      {/* 헤더 이미지 */}
      <div
        className="w-full h-[220px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${detail?.profileImageUrl || profileFallback})`,
        }}
      />

      {/* 프로필 요약 */}
      <div className="-mt-12 px-6">
        <img
          src={detail?.profileImageUrl || profileFallback}
          alt={detail?.bandName}
          className="w-24 h-24 rounded-full border-4 border-[#121212] object-cover"
        />
        <h1 className="mt-4 text-2xl font-bold">{bandName}</h1>
        <p className="mt-1 text-sm text-[#CFCFCF]">
          {`${detail?.region ?? "서울"} · ${detail?.district ?? "강남구"} · ${
            detail?.ageRange ?? "20-30"
          }`}
        </p>
      </div>

      {/* 본문 */}
      <div className="mt-8 px-6 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">{`${bandName}의 소개`}</h2>
          <div className="bg-[#1E1E1E] rounded-xl p-4 text-sm leading-6">
            {detail?.description ||
              "임시 밴드 소개입니다. 서버 데이터가 없을 때 표시됩니다."}
          </div>
        </section>

        {Array.isArray(profile?.goalTracks) &&
          profile.goalTracks.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">{`${bandName}의 목표 곡`}</h2>
              <div className="grid grid-cols-3 gap-3">
                {profile.goalTracks.slice(0, 6).map((t, idx) => (
                  <div
                    key={`${t.title}-${idx}`}
                    className="bg-[#1E1E1E] rounded-lg p-3"
                  >
                    <img
                      src={t.imageUrl || album1}
                      alt={t.title}
                      className="w-full h-24 object-cover rounded"
                    />
                    <div className="mt-2 text-sm font-medium truncate">
                      {t.title}
                    </div>
                    <div className="text-xs text-[#BDBDBD] truncate">
                      {t.artist}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        {Array.isArray(profile?.preferredArtists) &&
          profile.preferredArtists.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">{`${bandName}의 선호 아티스트`}</h2>
              <div className="grid grid-cols-4 gap-3">
                {profile.preferredArtists.slice(0, 8).map((a, idx) => (
                  <div
                    key={`${a.name}-${idx}`}
                    className="flex flex-col items-center"
                  >
                    <img
                      src={a.imageUrl || guitarBoy}
                      alt={a.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="mt-2 text-xs text-center truncate w-20">
                      {a.name}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
      </div>
    </div>
  );
};

export default BandDetailPage;

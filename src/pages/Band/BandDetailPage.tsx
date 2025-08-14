import React from "react";
import { useParams } from "react-router-dom";
import { useBandProfile } from "@/features/band/hooks/useBandData";

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
  const { data, isLoading } = useBandProfile(id);

  if (isLoading || !data) return <Skeleton />;

  const detail = data.detail;
  const profile = data.profile;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212] text-white">
      {/* 헤더 이미지 */}
      <div className="w-full h-[220px] bg-cover bg-center" style={{ backgroundImage: `url(${detail?.profileImageUrl || "/assets/profile1.png"})` }} />

      {/* 프로필 요약 */}
      <div className="-mt-12 px-6">
        <img
          src={detail?.profileImageUrl || "/assets/profile1.png"}
          alt={detail?.bandName}
          className="w-24 h-24 rounded-full border-4 border-[#121212] object-cover"
        />
        <h1 className="mt-4 text-2xl font-bold">{detail?.bandName || "밴디 (임시)"}</h1>
        <p className="mt-1 text-sm text-[#CFCFCF]">
          {`${detail?.region ?? "서울"} · ${detail?.district ?? "강남구"} · ${detail?.ageRange ?? "20-30"}`}
        </p>
      </div>

      {/* 본문 */}
      <div className="mt-8 px-6 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">소개</h2>
          <div className="bg-[#1E1E1E] rounded-xl p-4 text-sm leading-6">
            {detail?.description || "임시 밴드 소개입니다. 서버 데이터가 없을 때 표시됩니다."}
          </div>
        </section>

        {Array.isArray(profile?.goalTracks) && profile.goalTracks.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">목표 곡</h2>
            <div className="grid grid-cols-3 gap-3">
              {profile.goalTracks.slice(0, 6).map((t, idx) => (
                <div key={`${t.title}-${idx}`} className="bg-[#1E1E1E] rounded-lg p-3">
                  <img src={t.imageUrl} alt={t.title} className="w-full h-24 object-cover rounded" />
                  <div className="mt-2 text-sm font-medium truncate">{t.title}</div>
                  <div className="text-xs text-[#BDBDBD] truncate">{t.artist}</div>
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

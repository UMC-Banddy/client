import React, { useEffect, useState } from "react";
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

const NotFoundSkeleton: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212] text-white">
      <div className="w-full h-[220px] bg-[#1E1E1E]" />
      <div className="-mt-12 px-6">
        <div className="w-24 h-24 rounded-full bg-[#2A2A2A] border-4 border-[#121212]" />
        <div className="mt-4 h-6 w-56 bg-[#2A2A2A] rounded" />
        <div className="mt-2 h-4 w-72 bg-[#2A2A2A] rounded" />
      </div>
      <div className="mt-10 px-6">
        <div className="bg-[#1E1E1E] rounded-xl p-6 text-center text-[#CFCFCF]">
          {message || "해당 밴드의 정보가 존재하지 않습니다."}
        </div>
      </div>
    </div>
  );
};

const BandDetailPage: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const location = useLocation();
  // 상세 스펙에 맞게 우선 상세만 조회, 프로필은 보조로 사용
  const {
    data: detailOnly,
    isLoading: loadingDetail,
    error: detailError,
  } = useBandDetail(id);
  const { data, isLoading, error: profileError } = useBandProfile(id);

  if (loadingDetail || isLoading) return <Skeleton />;

  // 에러 메시지 파싱
  const extractError = (err: unknown): string => {
    const e = err as
      | {
          response?: { data?: { result?: string; message?: string } };
          message?: string;
        }
      | null
      | undefined;
    return (
      e?.response?.data?.result ||
      e?.response?.data?.message ||
      e?.message ||
      ""
    );
  };

  if (detailError || profileError || !data) {
    const msg = (extractError(detailError) ||
      extractError(profileError) ||
      "") as string;
    // 서버가 404 대신 500을 내려도 메시지로 NotFound 판별 (예: "해당 ID의 밴드를 찾을 수 없습니다.")
    const isNotFound = /(존재하지\s*않|찾을\s*수\s*없|not\s*found|404)/i.test(
      msg
    );
    if (isNotFound) {
      return (
        <NotFoundSkeleton message="해당 밴드의 정보가 존재하지 않습니다." />
      );
    }
    return (
      <div className="min-h-screen w-full flex flex-col bg-[#121212] text-white items-center justify-center px-6">
        <div className="text-2xl font-bold mb-3">오류가 발생했습니다</div>
        <div className="text-sm text-[#BDBDBD] mb-6 text-center">
          서버 오류 또는 밴드 정보를 불러올 수 없습니다. 잠시 후 다시 시도해
          주세요.
        </div>
        <button
          className="px-4 py-2 rounded bg-[#C7242D] text-black font-semibold"
          onClick={() => window.location.reload()}
        >
          새로고침
        </button>
      </div>
    );
  }

  const detail = detailOnly ?? data.detail;
  const profile = data.profile;
  const nameParam =
    new URLSearchParams(location.search).get("name") || undefined;
  const bandName =
    detail?.bandName ||
    nameParam ||
    profile?.goalTracks?.[0]?.title ||
    (id ? `밴드 ${id}` : "밴드");

  // 잘못된 URL("", "null", "undefined") 방지용 유틸
  const isValidImageUrl = (value?: string | null): value is string => {
    if (!value) return false;
    const v = String(value).trim();
    if (v.length === 0) return false;
    if (v.toLowerCase() === "null" || v.toLowerCase() === "undefined")
      return false;
    return true;
  };
  // 헤더/프로필 이미지 URL 사전 검증 + 실제 로드 확인 후 폴백
  const [headerUrl, setHeaderUrl] = useState<string>(profileFallback);
  useEffect(() => {
    const candidate = isValidImageUrl(detail?.profileImageUrl)
      ? (detail?.profileImageUrl as string)
      : "";
    if (!candidate) {
      setHeaderUrl(profileFallback);
      return;
    }
    const img = new Image();
    img.onload = () => setHeaderUrl(candidate);
    img.onerror = () => setHeaderUrl(profileFallback);
    img.src = candidate;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [detail?.profileImageUrl]);

  // 리스트 안전 래핑 (명시 타입)
  const goalTracks: Array<{
    title: string;
    artist: string;
    imageUrl?: string;
  }> = Array.isArray(profile?.goalTracks)
    ? (profile?.goalTracks as Array<{
        title: string;
        artist: string;
        imageUrl?: string;
      }>)
    : [];
  const preferredArtists: Array<{ name: string; imageUrl?: string }> =
    Array.isArray(profile?.preferredArtists)
      ? (profile?.preferredArtists as Array<{
          name: string;
          imageUrl?: string;
        }>)
      : [];

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212] text-white">
      {/* 헤더 이미지 */}
      <div
        className="w-full h-[220px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${headerUrl})`,
        }}
      />

      {/* 프로필 요약 */}
      <div className="-mt-12 px-6">
        <img
          src={headerUrl}
          alt={detail?.bandName}
          className="w-24 h-24 rounded-full border-4 border-[#121212] object-cover"
          onError={(e) => {
            e.currentTarget.src = profileFallback;
          }}
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

        <section>
          <h2 className="text-lg font-semibold mb-3">{`${bandName}의 목표 곡`}</h2>
          {goalTracks.length === 0 ? (
            <div className="text-sm text-[#BDBDBD] bg-[#1E1E1E] rounded-xl p-4">
              해당 밴드가 등록한 목표곡이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {goalTracks.slice(0, 6).map((t, idx) => (
                <div
                  key={`${t.title}-${idx}`}
                  className="bg-[#1E1E1E] rounded-lg p-3"
                >
                  <img
                    src={t.imageUrl || album1}
                    alt={t.title}
                    className="w-full h-24 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = album1;
                    }}
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
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">{`${bandName}의 선호 아티스트`}</h2>
          {preferredArtists.length === 0 ? (
            <div className="text-sm text-[#BDBDBD] bg-[#1E1E1E] rounded-xl p-4">
              해당 밴드가 등록한 선호 아티스트가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {preferredArtists.slice(0, 8).map((a, idx) => (
                <div
                  key={`${a.name}-${idx}`}
                  className="flex flex-col items-center"
                >
                  <img
                    src={a.imageUrl || guitarBoy}
                    alt={a.name}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = guitarBoy as unknown as string;
                    }}
                  />
                  <div className="mt-2 text-xs text-center truncate w-20">
                    {a.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BandDetailPage;

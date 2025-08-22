import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "@/assets/images/profile1.png";
import SessionIcon from "./_components/SessionIcon";
import noProfile from "@/assets/icons/profile/no_img.svg";
import {
  mic,
  electricGuitar,
  acousticGuitar,
  bass as bassIcon,
  drum as drumIcon,
  piano,
  trumpet as trumpetIcon,
  violin as violinIcon,
} from "@/assets/icons/join/band_recruit";

// 타입: 관심 아티스트 렌더링에 사용하는 최소 형태
type ArtistLike = {
  title: string;
  imageUrl: string;
};

// 세션 렌더링에서 사용하는 최소 형태
type SessionCandidate = { sessionType?: string; type?: string; name?: string } | Record<string, unknown>;

// 안전한 타입 가드/헬퍼들
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const getStr = (o: Record<string, unknown>, key: string): string | undefined => {
  const v = o[key];
  return typeof v === "string" ? v : undefined;
};
const getFirstImageUrl = (o: Record<string, unknown>): string | undefined => {
  const images = o["images"];
  if (Array.isArray(images) && images.length > 0 && isObj(images[0])) {
    const url = images[0]["url"];
    if (typeof url === "string") return url;
  }
  return undefined;
};
const getAlbumFirstImageUrl = (o: Record<string, unknown>): string | undefined => {
  const album = o["album"];
  if (isObj(album)) return getFirstImageUrl(album);
  return undefined;
};
const getFirstArtistName = (o: Record<string, unknown>): string | undefined => {
  const artists = o["artists"];
  if (Array.isArray(artists) && artists.length > 0 && isObj(artists[0])) {
    const a0 = artists[0];
    return getStr(a0, "name") ?? getStr(a0, "artistName");
  }
  return undefined;
};

import { profileAPI } from "@/api/API";

const PretestProfileCompletePage: React.FC = () => {
  const navigate = useNavigate();
  // 프로필 응답에서 사용하는 필드 최소 정의
  interface ProfileResultPartial {
    profileImageUrl?: string | null;
    nickname?: string;
    age?: number;
    gender?: string;
    region?: string;
    savedArtists?: unknown;
    favoriteArtists?: unknown;
    likedArtists?: unknown;
    artists?: unknown;
    artistList?: unknown;
    savedTracks?: unknown;
    favoriteArtistList?: unknown;
    pretest?: { artists?: unknown } | null;
    sessions?: unknown;
    availableSessions?: unknown;
    selectedSessions?: unknown;
  }
  const [profileData, setProfileData] = useState<ProfileResultPartial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 프로필 데이터 로드
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        // 프로필 데이터 로드 (토큰 기반)
        try {
          const response = await profileAPI.getProfile();
          console.log("프로필 데이터:", response);

          if (response.isSuccess && response.result) {
            setProfileData(response.result);
          } else {
            console.warn("프로필 데이터가 없습니다:", response);
            setProfileData(null);
          }
          setError(null);
        } catch (profileError: unknown) {
          console.error("프로필 데이터 로드 실패:", profileError);
          // 프로필 로드 실패해도 에러로 표시하지 않음 (아이디 기반 저장은 성공했을 수 있음)
          setProfileData(null);
        }
      } catch (err: unknown) {
        console.error("데이터 로드 실패:", err);
        setError("데이터를 불러오는데 실패했습니다.");
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleConfirm = () => {
    navigate("/");
  };

  // 편집 제거 (요구사항)

  // 세션 타입에 따른 아이콘 반환
  // const getSessionIcon = (sessionType: string) => {
  //   const iconMapping: Record<string, string> = {
  //     vocal: "🎤",
  //     electric_guitar: "🎸",
  //     acoustic_guitar: "🪕",
  //     bass: "🪕",
  //     drums: "🥁",
  //     keyboard: "🎹",
  //     violin: "🎻",
  //     trumpet: "🎺",
  //   };
  //   return iconMapping[sessionType] || "🎤";
  // };

  return (
    <div className="w-full h-full flex flex-col text-white font-inherit">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10 2xl:py-12">
        <div className="flex-1"></div>
        <button
          onClick={handleConfirm}
          className="bg-none border-none text-[#7ED957] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold cursor-pointer"
        >
          확인
        </button>
      </div>

      {/* 본문 */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 md:py-10 lg:py-12 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          {/* 완성 메시지 */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-white font-medium leading-tight">
          사전테스트가 완료되었습니다!
        </h1>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="text-center text-white text-lg">
              프로필 정보를 불러오는 중...
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="text-center text-red-400 text-lg mb-4">{error}</div>
          )}

          {/* 프로필 카드 */}
          {!loading && (
            <div className="bg-gray-200 rounded-2xl sm:rounded-3xl md:rounded-4xl lg:rounded-5xl xl:rounded-6xl 2xl:rounded-7xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16 relative">
              {/* 편집 버튼 제거됨 */}

              {/* 프로필 이미지 및 기본 정보 */}
              <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                {profileData?.profileImageUrl ? (
                  <img
                    src={profileData.profileImageUrl}
                    alt="프로필"
                    className="w-40 h-40 sm:w-40 sm:h-40 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-40 h-40 sm:w-40 sm:h-40 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 rounded-full bg-[#CACACA] flex items-center justify-center">
                    <img src={noProfile} alt="기본 프로필" className="w-20 h-20 object-contain" />
                  </div>
                )}
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-black mb-1 sm:mb-2">
                    {profileData?.nickname || "BECK"}
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 mb-2 sm:mb-3">
                    {profileData?.age ? `${profileData.age}세` : "23세"} |{" "}
                    {profileData?.gender || "여성"} ·{" "}
                    {profileData?.region || "서울시"}
                  </p>
                  <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 justify-center">
                    {(() => {
                      const iconMap: Record<string, string> = {
                        VOCAL: mic,
                        ELECTRIC_GUITAR: electricGuitar,
                        ACOUSTIC_GUITAR: acousticGuitar,
                        BASS: bassIcon,
                        DRUM: drumIcon,
                        KEYBOARD: piano,
                        VIOLIN: violinIcon,
                        TRUMPET: trumpetIcon,
                      };
                      // 세션 소스 후보: availableSessions | sessions | selectedSessions
                      const raw = (
                        profileData?.availableSessions ||
                        profileData?.sessions ||
                        profileData?.selectedSessions ||
                        []
                      ) as SessionCandidate[];

                      const normalize = (input: string): string => {
                        const cleaned = input
                          // 이모지 제거
                          .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, "")
                          // 특수문자 제거(공백/언더바/한글/영숫자만)
                          .replace(/[^\p{L}\p{N}\s_]/gu, "")
                          .replace(/\s+/g, " ")
                          .trim();
                        const lower = cleaned.toLowerCase();
                        // 포함어 매핑
                        if (lower.includes("보컬")) return "VOCAL";
                        if (lower.includes("일렉") || lower.includes("electric")) return "ELECTRIC_GUITAR";
                        if (lower.includes("어쿠") || lower.includes("acoustic")) return "ACOUSTIC_GUITAR";
                        if (lower.includes("베이스") || lower.includes("bass")) return "BASS";
                        if (lower.includes("드럼") || lower.includes("drum")) return "DRUM";
                        if (lower.includes("키보드") || lower.includes("keyboard")) return "KEYBOARD";
                        if (lower.includes("바이올린") || lower.includes("violin")) return "VIOLIN";
                        if (lower.includes("트럼펫") || lower.includes("trumpet")) return "TRUMPET";
                        // 스네이크/공백 → ENUM
                        const snake = cleaned.replace(/\s+/g, "_").toUpperCase();
                        // 복수형 보정
                        if (snake === "DRUMS") return "DRUM";
                        if (snake === "BASSES") return "BASS";
                        return snake;
                      };

                      const sessionTypes = raw
                        .map((s: SessionCandidate) => {
                          const o = s as Record<string, unknown>;
                          return getStr(o, "sessionType") ?? getStr(o, "type") ?? getStr(o, "name");
                        })
                        .filter((v): v is string => typeof v === "string" && v.length > 0)
                        .map((v) => normalize(v))
                        // 중복 제거
                        .filter((val, idx, arr) => arr.indexOf(val) === idx);

                      return sessionTypes.length > 0
                        ? sessionTypes.map((type: string, idx: number) => {
                            const src = iconMap[type];
                            return src ? (
                              <div
                                key={`${type}-${idx}`}
                                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#B42127] flex items-center justify-center"
                                aria-label={type}
                              >
                                <img
                                  src={src}
                                  alt={type}
                                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 object-contain"
                                />
                              </div>
                            ) : (
                              <SessionIcon key={`${type}-${idx}`} icon="🎤" />
                            );
                          })
                        : null;
                    })()}
                  </div>
                </div>
              </div>


              {/* 관심 아티스트 */}
              <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                  <h3 className="inline-block bg-black text-white px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 xl:px-10 xl:py-6 2xl:px-12 2xl:py-7 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium">
                    관심 아티스트
                  </h3>
                </div>
                <div className="flex gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10 2xl:gap-11 overflow-x-auto scrollbar-hide">
                  {(() => {
                    // 아티스트 소스 후보: savedArtists | favoriteArtists | likedArtists | artists | artistList | savedTracks | favoriteArtistList | pretest.artists (obj.items 지원)
                    const pickArray = (val: unknown): Record<string, unknown>[] => {
                      const arr = Array.isArray(val)
                        ? val
                        : isObj(val) && Array.isArray((val as Record<string, unknown>)["items"]) 
                        ? ((val as Record<string, unknown>)["items"] as unknown[])
                        : [];
                      return arr.filter(isObj) as Record<string, unknown>[];
                    };
                    const candidateSources: Record<string, unknown>[] = [
                      ...pickArray(profileData?.savedArtists ?? null),
                      ...pickArray(profileData?.favoriteArtists ?? null),
                      ...pickArray(profileData?.likedArtists ?? null),
                      ...pickArray(profileData?.artists ?? null),
                      ...pickArray(profileData?.artistList ?? null),
                      ...pickArray(profileData?.savedTracks ?? null),
                      ...pickArray(profileData?.favoriteArtistList ?? null),
                      ...pickArray(profileData?.pretest?.artists ?? null),
                    ];

                    // 최후의 보루: profileData 전체를 순회하여 아티스트처럼 보이는 항목 추출
                    const deepCollect = (root: unknown, limit = 20): ArtistLike[] => {
                      const out: ArtistLike[] = [];
                      const seen = new Set<string>();
                      const pushIfArtistLike = (obj: Record<string, unknown>) => {
                        const name = getStr(obj, "name") ?? getStr(obj, "title") ?? getStr(obj, "artistName");
                        const image =
                          getStr(obj, "imageUrl") ??
                          getFirstImageUrl(obj) ??
                          getStr(obj, "profileImageUrl") ??
                          getStr(obj, "image") ??
                          getStr(obj, "thumbnailUrl") ??
                          getStr(obj, "coverUrl");
                        if (name && image) {
                          const key = `${name}__${image}`;
                          if (!seen.has(key)) {
                            seen.add(key);
                            out.push({ title: name, imageUrl: image });
                          }
                        }
                      };
                      const walk = (node: unknown) => {
                        if (!node || out.length >= limit) return;
                        if (Array.isArray(node)) {
                          for (const el of node) {
                            if (out.length >= limit) break;
                            if (isObj(el)) {
                              pushIfArtistLike(el);
                              walk(el);
                            }
                          }
                        } else if (isObj(node)) {
                          const n = node as Record<string, unknown>;
                          // items 배열을 우선으로 본다
                          if (Array.isArray(n.items)) walk(n.items);
                          for (const k of Object.keys(n)) {
                            if (out.length >= limit) break;
                            const v = n[k];
                            if (Array.isArray(v) || isObj(v)) {
                              if (isObj(v)) pushIfArtistLike(v);
                              walk(v);
                            }
                          }
                        }
                      };
                      walk(root);
                      return out;
                    };

                    let items: ArtistLike[] = candidateSources
                      .map((o) => {
                        const base = o;
                        const track = isObj(base["track"]) ? (base["track"] as Record<string, unknown>) : base;
                        const firstArtistName = getFirstArtistName(track) ?? getFirstArtistName(base);
                        const artistObj = isObj(base["artist"]) ? (base["artist"] as Record<string, unknown>) : undefined;

                        const img =
                          getStr(base, "imageUrl") ??
                          getFirstImageUrl(base) ??
                          getAlbumFirstImageUrl(track) ??
                          getStr(base, "profileImageUrl") ??
                          getStr(base, "image") ??
                          getStr(base, "thumbnailUrl") ??
                          getStr(base, "coverUrl") ??
                          (artistObj && (getStr(artistObj, "imageUrl") ?? getFirstImageUrl(artistObj) ?? getStr(artistObj, "profileImageUrl"))) ??
                          profileImage;
                        const name =
                          getStr(base, "name") ??
                          getStr(base, "title") ??
                          firstArtistName ??
                          getStr(base, "artistName") ??
                          (artistObj && (getStr(artistObj, "name") ?? getStr(artistObj, "artistName"))) ??
                          "";
                        return { imageUrl: img, title: name } as ArtistLike;
                      })
                      .filter((x) => !!x.title)
                      // 중복 이름 제거
                      .filter((item, idx, arr) => arr.findIndex((t) => t.title === item.title) === idx);

                    if (items.length === 0) {
                      const deep = deepCollect(profileData);
                      if (deep.length > 0) {
                        items = deep;
                        console.log("[pretest] deep artist items used:", deep.slice(0, 5));
                      } else {
                        console.log("[pretest] no artist items found in profileData");
                      }
                    }

                    return items.length > 0 ? (
                      items.map((track, index: number) => (
                        <div key={index} className="flex-shrink-0 text-center">
                          <div className="relative inline-block">
                            <img
                              src={track.imageUrl || profileImage}
                              alt={track.title}
                              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 rounded-full object-cover mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8"
                            />
                          </div>
                          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-black font-medium">
                            {track.title}
                          </p>
                        </div>
                      ))
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PretestProfileCompletePage;

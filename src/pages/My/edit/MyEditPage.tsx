import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import profileImage from "@/assets/icons/profile/no_img.svg";
import ProfileEditHeader from "./_components/ProfileEditHeader";
import ProfileImageSection from "./_components/ProfileImageSection";
import BasicInfoSection from "./_components/BasicInfoSection";
import LocationSection from "./_components/LocationSection";
import SessionSection from "./_components/SessionSection";
import GenreSection from "./_components/GenreSection";
import KeywordSection from "./_components/KeywordSection";
import IntroductionSection from "./_components/IntroductionSection";
import { useProfileData, useUploadProfileMedia, useUpdateProfile } from "@/features/my/hooks/useProfileEdit";

// API 응답 데이터 타입 정의
interface ApiProfileData {
  memberId: number;
  nickname: string;
  bio: string;
  profileImageUrl: string;
  age: number;
  gender: string;
  region: string;
  district: string | null;
  tags: string[];
  sessions: Array<{
    name: string;
    icon: string;
  }>;
  favoriteArtists: Array<{
    name: string;
    imageUrl: string;
  }>;
  traits: string[];
  youtubeUrl: string | null;
  instagramUrl: string | null;
  canRequestChat: boolean;
  genres: string[];
  friend: boolean;
  blocked: boolean;
}

const MyEditPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 커스텀 훅 사용
  const { data: profileResponse, isLoading: profileLoading, error: profileError } = useProfileData();
  const uploadProfileMediaMutation = useUploadProfileMedia();
  const updateProfileMutation = useUpdateProfile();

  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [selectedSessions, setSelectedSessions] = useState<
    Record<string, string>
  >({});
  const [genres, setGenres] = useState<
    Array<{ id: string; name: string; icon: string }>
  >([]);
  const [artists, setArtists] = useState<
    Array<{ id: string; name: string; imageUrl: string }>
  >([]);
  const [keywords, setKeywords] = useState<
    Array<{ id: string; text: string; category: string }>
  >([]);
  const [introduction, setIntroduction] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(profileImage);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isEditingArtists, setIsEditingArtists] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // API에서 프로필 데이터 가져오기
  useEffect(() => {
    console.log("🚨 useEffect 실행됨!");
    console.log("🚨 profileResponse:", profileResponse);
    console.log("🚨 profileLoading:", profileLoading);
    console.log("🚨 profileError:", profileError);
    
    // profileResponse가 직접 데이터 객체로 오는 경우
    if (profileResponse && typeof profileResponse === "object" && "memberId" in profileResponse) {
      console.log("🚨 API 응답 성공! 데이터 처리 시작...");
      try {
        setLoading(true);
        const data = profileResponse as unknown as ApiProfileData;
        console.log("🔍 API에서 가져온 원본 데이터:", data);
        console.log("🔍 sessions 데이터:", data.sessions);
        console.log("🔍 genres 데이터:", data.genres);
        console.log("🔍 favoriteArtists 데이터:", data.favoriteArtists);
        console.log("🔍 traits 데이터:", data.traits);

        // 성별을 UI 표시용으로 변환
        const genderDisplayMap: Record<string, string> = {
          MALE: "남성",
          FEMALE: "여성",
          OTHER: "기타",
        };

        const displayGender = genderDisplayMap[data.gender] || "여성";

        // 기본 정보 설정 - API 데이터를 그대로 사용
        console.log("🔍 닉네임 매핑:", data.nickname);
        setName(data.nickname);
        
        console.log("🔍 나이 매핑:", data.age);
        setAge(data.age ? `${data.age}세` : "");
        
        console.log("🔍 성별 매핑:", { apiGender: data.gender, displayGender });
        setGender(displayGender);
        
        console.log("🔍 지역 매핑:", { apiRegion: data.region });
        setCity(data.region);
        
        console.log("🔍 소개글 매핑:", data.bio);
        setIntroduction(data.bio);
        
        console.log("🔍 프로필 이미지 매핑:", data.profileImageUrl);
        setProfileImageUrl(data.profileImageUrl);

        // 세션 데이터 변환 (올바른 매핑)
        if (data.sessions && Array.isArray(data.sessions) && data.sessions.length > 0) {
          console.log("🔍 세션 매핑 시작...");
          const sessionsMap: Record<string, string> = {};
          
          // 세션 타입 매핑
          const sessionTypeMapping: Record<string, string> = {
            "🎸 일렉 기타 🎸": "ELECTRIC_GUITAR",
            "🎤 보컬 🎤": "VOCAL",
            "🪕 어쿠스틱 기타 🪕": "ACOUSTIC_GUITAR",
            "🎵 베이스 🎵": "BASS",
            "🥁 드럼 🥁": "DRUMS",
            "🎹 키보드 🎹": "KEYBOARD",
            "🎻 바이올린 🎻": "VIOLIN",
            "🎺 트럼펫 🎺": "TRUMPET"
          };
          
          data.sessions.forEach((session: { name: string; icon: string }, index: number) => {
            console.log(`🔍 세션 ${index + 1}:`, session);
            console.log(`🔍 세션 이름: "${session.name}"`);
            console.log(`🔍 매핑된 sessionType: "${sessionTypeMapping[session.name]}"`);
            
            const sessionType = sessionTypeMapping[session.name] || session.name;
            sessionsMap[sessionType] = "초보"; // 기본값: 초보
            
            console.log(`🔍 최종 매핑: ${sessionType} = "초보"`);
          });
          
          console.log("🔍 최종 sessionsMap:", sessionsMap);
          setSelectedSessions(sessionsMap);
        } else {
          console.log("🔍 sessions 데이터가 없거나 빈 배열임:", data.sessions);
          setSelectedSessions({}); // 빈 객체로 설정
        }

        // 장르 데이터 변환
        if (data.genres && Array.isArray(data.genres)) {
          console.log("🔍 장르 매핑 시작...");
          const genresData = data.genres.map((genre: string, index: number) => ({
            id: index.toString(),
            name: genre,
            icon: "🎵",
          }));
          console.log("🔍 최종 genresData:", genresData);
          setGenres(genresData);
        } else {
          console.log("🔍 genres 데이터가 없거나 배열이 아님:", data.genres);
        }

        // 관심 아티스트 데이터 변환
        if (data.favoriteArtists && Array.isArray(data.favoriteArtists)) {
          console.log("🔍 아티스트 매핑 시작...");
          const artistsData = data.favoriteArtists.map(
            (artist: { name: string; imageUrl: string }, index: number) => ({
              id: index.toString(),
              name: artist.name,
              imageUrl: artist.imageUrl || profileImage,
            })
          );
          console.log("🔍 최종 artistsData:", artistsData);
          setArtists(artistsData);
        } else {
          console.log("🔍 favoriteArtists 데이터가 없거나 배열이 아님:", data.favoriteArtists);
        }

        // 키워드 데이터 변환
        if (data.traits && Array.isArray(data.traits)) {
          console.log("🔍 키워드 매핑 시작...");
          console.log("🔍 API에서 받은 traits:", data.traits);
          const keywordsData = data.traits.map((trait: string, index: number) => ({
            id: index.toString(),
            text: trait,
            category: "manner",
          }));
          console.log("🔍 최종 keywordsData:", keywordsData);
          setKeywords(keywordsData);
        } else {
          console.log("🔍 traits 데이터가 없거나 배열이 아님:", data.traits);
          setKeywords([]); // 빈 배열로 초기화
        }

        setError(null);
      } catch (err) {
        console.error("프로필 데이터 처리 실패:", err);
        setError("프로필 데이터를 처리하는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    } else if (profileError) {
      console.error("프로필 데이터 로드 실패:", profileError);
      setError("프로필 데이터를 불러오는데 실패했습니다.");
      setLoading(false);
    }
  }, [profileResponse, profileError]);

  // 로딩 상태 동기화
  useEffect(() => {
    setLoading(profileLoading);
  }, [profileLoading]);

  // 이벤트 핸들러
  const handleBack = () => {
    navigate(-1);
  };

  const handleComplete = async () => {
    try {
      // 세션 데이터를 API 형식으로 변환
      const availableSessions = Object.entries(selectedSessions).map(
        ([sessionType, level]) => {
          // 세션 타입을 서버가 기대하는 형식으로 변환
          const sessionTypeMapping: Record<string, string> = {
            "electric-guitar": "ELECTRIC_GUITAR",
            "acoustic-guitar": "ACOUSTIC_GUITAR",
            "vocal": "VOCAL",
            "bass": "BASS",
            "drums": "DRUMS",
            "keyboard": "KEYBOARD",
            "violin": "VIOLIN",
            "trumpet": "TRUMPET"
          };

          const serverSessionType = sessionTypeMapping[sessionType] || sessionType;

          // 레벨을 서버가 기대하는 형식으로 변환
          const levelMapping: Record<string, string> = {
            "초보": "BEGINNER",
            "중수": "INTERMEDIATE",
            "고수": "ADVANCED"
          };

          const serverLevel = levelMapping[level] || "BEGINNER";

          return {
            sessionType: serverSessionType,
            level: serverLevel,
          };
        }
      );

      // 장르 데이터 변환
      const genresData = genres.map((genre) => genre.name);

      // 아티스트 데이터 변환 (API에는 아티스트 ID가 필요할 수 있음)
      const artistsData = artists.map((artist) => artist.name);

      // 키워드 데이터 변환
      const keywordsData = keywords.map((keyword) => keyword.text);

      // 성별을 서버가 기대하는 형식으로 변환
      const genderMap: Record<string, string> = {
        남성: "MALE",
        여성: "FEMALE",
        기타: "OTHER",
      };

      const serverGender = genderMap[gender] || "OTHER";

      // API로 프로필 업데이트
      const updateData: Record<string, unknown> = {
        nickname: name,
        age: parseInt(age.replace("세", "")) || 23,
        gender: serverGender,
        region: city,
        bio: introduction,
        // profileImage는 별도로 처리하므로 제거
        mediaUrl: "",
        genres: genresData,
        artists: artistsData,
        keywords: keywordsData,
      };

      // 세션 데이터가 있을 때만 추가
      if (availableSessions.length > 0) {
        updateData.availableSessions = availableSessions;
      }

      console.log("🔍 업데이트할 데이터 상세:", {
        nickname: updateData.nickname,
        age: updateData.age,
        gender: updateData.gender,
        region: updateData.region,
        bio: updateData.bio,
        availableSessions: updateData.availableSessions,
        genres: updateData.genres,
        artists: updateData.artists,
        keywords: updateData.keywords
      });

      // 필수 필드 검증
      if (!name || name.trim() === "") {
        setError("닉네임을 입력해주세요.");
        return;
      }

      if (!age || age.trim() === "") {
        setError("나이를 입력해주세요.");
        return;
      }

      if (!gender || gender.trim() === "") {
        setError("성별을 선택해주세요.");
        return;
      }

      try {
        const response = await updateProfileMutation.mutateAsync(updateData);
        console.log("프로필 업데이트 결과:", response);

        if (response.isSuccess) {
          console.log("✅ 프로필 업데이트 성공! 캐시 무효화 중...");
          // 프로필 관련 캐시 무효화
          await queryClient.invalidateQueries({ queryKey: ["profile"] });
          console.log("✅ 캐시 무효화 완료!");
          navigate("/my");
        } else {
          setError("프로필 업데이트에 실패했습니다.");
        }
      } catch (error: unknown) {
        console.error("프로필 업데이트 실패:", error);
        console.error("🔍 서버 에러 상세:", error);
        setError("프로필 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      setError("프로필 업데이트에 실패했습니다.");
    }
  };

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      console.log("카메라 권한 상태:", result.state);
      return result.state;
    } catch (error) {
      console.log("권한 상태 확인 실패:", error);
      return "unknown";
    }
  };

  const handleImageChange = async () => {
    console.log("카메라 버튼 클릭됨");

    // 카메라 직접 켜기
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia 지원됨, 카메라 접근 시도...");
      console.log("현재 프로토콜:", window.location.protocol);
      console.log("현재 호스트:", window.location.host);

      // 카메라 권한 확인
      const permissionState = await checkCameraPermission();
      console.log("카메라 권한 상태:", permissionState);

      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user", // 전면 카메라 우선
          },
        })
        .then((stream) => {
          console.log("카메라 스트림 획득 성공:", stream);
          setCameraStream(stream);
          setShowCamera(true);
          console.log("카메라 모달 표시 상태:", true);

          // 비디오 요소에 스트림 연결
          if (videoRef.current) {
            console.log("비디오 요소에 스트림 연결 중...");

            // 기존 srcObject 제거
            videoRef.current.srcObject = null;

            // 새로운 스트림 설정
            videoRef.current.srcObject = stream;
            console.log("srcObject 설정됨:", videoRef.current.srcObject);

            // 스트림 연결 확인
            setTimeout(() => {
              if (videoRef.current && videoRef.current.srcObject) {
                console.log("스트림 연결 확인됨:", videoRef.current.srcObject);
                console.log("스트림 트랙:", stream.getTracks());
                console.log("비디오 readyState:", videoRef.current.readyState);
                console.log(
                  "비디오 networkState:",
                  videoRef.current.networkState
                );
              }
            }, 100);

            // 비디오 이벤트 리스너 설정
            const video = videoRef.current;

            video.onloadedmetadata = () => {
              console.log("비디오 메타데이터 로드됨, 재생 시작...");
              console.log(
                "비디오 크기:",
                video.videoWidth,
                "x",
                video.videoHeight
              );

              // 비디오 재생 시도
              const playVideo = () => {
                video
                  .play()
                  .then(() => {
                    console.log("비디오 재생 성공");
                  })
                  .catch((e) => {
                    console.error("비디오 재생 실패:", e);
                    // 재생 실패 시 다시 시도
                    setTimeout(() => {
                      console.log("재생 재시도...");
                      video
                        .play()
                        .then(() => console.log("재시도 성공"))
                        .catch((e2) => console.error("재시도 실패:", e2));
                    }, 500);
                  });
              };

              // 즉시 재생 시도
              playVideo();

              // 추가로 100ms 후에도 재생 시도
              setTimeout(playVideo, 100);
            };

            video.onerror = (e) => {
              console.error("비디오 오류:", e);
            };

            video.oncanplay = () => {
              console.log("비디오 재생 준비 완료");
            };

            video.onplay = () => {
              console.log("비디오 재생 시작됨");
            };

            video.onpause = () => {
              console.log("비디오 일시정지됨");
            };

            video.onloadstart = () => {
              console.log("비디오 로드 시작됨");
            };

            video.onloadeddata = () => {
              console.log("비디오 데이터 로드됨");
            };
          }
        })
        .catch((error) => {
          console.error("카메라 접근 실패:", error);
          // 카메라 접근이 실패하면 파일 선택으로 대체
          if (fileInputRef.current) {
            fileInputRef.current.accept = "image/*";
            fileInputRef.current.setAttribute("capture", "environment");
            fileInputRef.current.click();
          }
        });
    } else {
      console.log("getUserMedia 지원되지 않음, 파일 선택으로 대체");
      // getUserMedia를 지원하지 않는 경우 파일 선택으로 대체
      if (fileInputRef.current) {
        fileInputRef.current.accept = "image/*";
        fileInputRef.current.setAttribute("capture", "environment");
        fileInputRef.current.click();
      }
    }
  };

  const handleTakePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // 캔버스 크기를 비디오 크기에 맞춤
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 비디오 프레임을 캔버스에 그리기
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 캔버스를 이미지 URL로 변환
        canvas.toBlob(
          async (blob) => {
            if (blob) {
              const imageUrl = URL.createObjectURL(blob);
              console.log("생성된 이미지 URL:", imageUrl);
              setProfileImageUrl(imageUrl);
              console.log("촬영된 이미지:", blob);

              // 서버에 이미지 업로드
              try {
                // Blob을 File로 변환
                const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
                const uploadResponse = await uploadProfileMediaMutation.mutateAsync(file);
                
                if (uploadResponse.url) {
                  setProfileImageUrl(uploadResponse.url);
                  console.log("이미지 업로드 성공:", uploadResponse.url);
                }
              } catch (error) {
                console.error("이미지 업로드 실패:", error);
                setError("이미지 업로드에 실패했습니다.");
              }
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }

    // 카메라 종료
    handleCloseCamera();
  };

  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const handleImageUpload = () => {
    // 이미지 업로드 기능 - 파일 선택 다이얼로그 열기
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      // capture 속성 제거 (갤러리에서 선택)
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일을 URL로 변환하여 미리보기
      const imageUrl = URL.createObjectURL(file);
      console.log("선택된 파일 URL:", imageUrl);
      setProfileImageUrl(imageUrl);

      // 서버에 이미지 업로드
      try {
        const uploadResponse = await uploadProfileMediaMutation.mutateAsync(file);
        
        if (uploadResponse.url) {
          setProfileImageUrl(uploadResponse.url);
          console.log("이미지 업로드 성공:", uploadResponse.url);
        }
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        setError("이미지 업로드에 실패했습니다.");
      }
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNameClear = () => {
    setName("");
  };

  const handleSessionChange = (sessionId: string, levelId: string) => {
    setSelectedSessions((prev) => ({
      ...prev,
      [sessionId]: levelId,
    }));
  };

  const handleEditArtist = () => {
    // 아티스트 편집 모드 토글
    setIsEditingArtists(!isEditingArtists);
  };

  const handleRemoveGenre = (genreId: string) => {
    // 장르 제거 로직
    console.log("장르 제거:", genreId);
    setGenres((prevGenres) =>
      prevGenres.filter((genre) => genre.id !== genreId)
    );
  };

  const handleRemoveArtist = async (artistId: string) => {
    try {
      // API에서 아티스트 제거
      const artistToRemove = artists.find((artist) => artist.id === artistId);
      if (artistToRemove) {
        // 실제 API 호출 (아티스트 ID나 이름으로 제거)
        console.log("아티스트 제거:", artistToRemove.name);

        // 로컬 상태에서 제거
        setArtists((prevArtists) =>
          prevArtists.filter((artist) => artist.id !== artistId)
        );

        // TODO: 실제 API 호출
        // await artistAPI.removeArtist(artistToRemove.name);
      }
    } catch (error) {
      console.error("아티스트 제거 실패:", error);
      setError("아티스트 제거에 실패했습니다.");
    }
  };

  const handleKeywordsChange = (newKeywords: Array<{ id: string; text: string; category: string }>) => {
    setKeywords(newKeywords);
  };

  return (
    <div className="w-full h-full flex flex-col text-white">
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 카메라 모달 */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover rounded-lg bg-black"
                style={{
                  transform: "scaleX(-1)",
                  minHeight: "256px",
                  display: "block",
                  width: "100%",
                  height: "256px",
                  backgroundColor: "black",
                  border: "2px solid red",
                }}
                onLoadStart={() => console.log("비디오 로드 시작")}
                onLoadedData={() => console.log("비디오 데이터 로드됨")}
                onCanPlay={() => console.log("비디오 재생 가능")}
                onPlay={() => console.log("비디오 재생 중")}
                onPause={() => console.log("비디오 일시정지")}
                onError={(e) => console.error("비디오 오류:", e)}
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                카메라 상태: {cameraStream ? "연결됨" : "연결 중..."}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleTakePhoto}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                촬영
              </button>
              <button
                onClick={handleCloseCamera}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <ProfileEditHeader onBack={handleBack} onComplete={handleComplete} />

      {/* 본문 */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-6">
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

          {/* 프로필 편집 폼 */}
          {!loading && (
            <>
              {/* 프로필 이미지 */}
              <ProfileImageSection
                imageUrl={profileImageUrl}
                onImageChange={handleImageChange}
                onImageUpload={handleImageUpload}
              />

              {/* 기본 정보 */}
              <BasicInfoSection
                name={name}
                age={age}
                gender={gender}
                onNameChange={setName}
                onNameClear={handleNameClear}
                onAgeChange={setAge}
                onGenderChange={setGender}
              />

              {/* 거주 지역 */}
              <LocationSection
                city={city}
                onCityChange={setCity}
              />

              {/* 가능한 세션 및 실력 */}
              <SessionSection
                sessions={selectedSessions}
                onSessionChange={handleSessionChange}
              />

              {/* 관심 장르 */}
              <GenreSection
                genres={genres}
                onRemoveGenre={handleRemoveGenre}
                onAddGenre={(newGenre) => {
                  setGenres(prev => [...prev, newGenre]);
                }}
              />

              {/* 관심 아티스트 */}
              <div className="mb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
                <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-white">
                    관심 아티스트
                  </h3>
                  <button
                    onClick={handleEditArtist}
                    className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium transition-colors ${
                      isEditingArtists
                        ? "text-green-500 hover:text-green-400"
                        : "text-[#B71C1C] hover:text-red-400"
                    }`}
                  >
                    {isEditingArtists ? "완료" : "수정"}
                  </button>
                </div>
                <div className="flex gap-6 sm:gap-7 md:gap-8 lg:gap-9 xl:gap-10 2xl:gap-11 overflow-x-auto scrollbar-hide pb-4 pt-4">
                  {artists.map((artist) => (
                    <div key={artist.id} className="flex-shrink-0 text-center">
                      <div className="relative inline-block">
                        <img
                          src={artist.imageUrl}
                          alt={artist.name}
                          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 rounded-full object-cover mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8"
                        />
                        {isEditingArtists && (
                          <button
                            onClick={() => handleRemoveArtist(artist.id)}
                            className="absolute -top-3 -right-3 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-13 2xl:h-13 bg-[#B71C1C] rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-24 sm:max-w-28 md:max-w-32 lg:max-w-36 xl:max-w-40 2xl:max-w-44">
                        {artist.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 키워드 */}
              <KeywordSection
                keywords={keywords}
                onKeywordsChange={handleKeywordsChange}
              />

              {/* 소개글 */}
              <IntroductionSection
                introduction={introduction}
                onIntroductionChange={setIntroduction}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEditPage;

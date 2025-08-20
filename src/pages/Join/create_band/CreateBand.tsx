import {
  ElectricGuitarImg,
  MicImg,
  GuitarImg,
  BassImg,
  DrumImg,
  PianoImg,
  ViolinImg,
  TrumpetImg,
} from "@/shared/components/images";
import { Dialog, Slide } from "@mui/material";
import MuiDialog from "@/shared/components/MuiDialog";
import CommonBtn from "@/shared/components/CommonBtn";
import { useEffect, useRef, useState } from "react";
import happy from "@/assets/icons/join/ic_mood_happy.svg";
import cameraBtn from "@/assets/icons/join/ic_camera_btn.svg";
import music from "@/assets/icons/join/ic_music.svg";
import DateSelect from "../_components/create_band/DateSelect";
import clsx from "clsx";
import SelectWithArrow from "../_components/create_band/SelectWithArrow";
import JobInfoBtn from "../_components/create_band/JobInfoBtn";
import plusIcon from "@/assets/icons/join/ic_plus_gray.svg";
import regions from "../_constants/regions";
import JoinInputField from "../_components/JoinInputField";
import youtubeIcon from "@/assets/icons/join/ic_youtube.svg";
import instagramIcon from "@/assets/icons/join/ic_instagram.svg";
import tiktokIcon from "@/assets/icons/join/ic_tiktok.svg";
import SnsInputField from "../_components/SnsInputField";
import IOSSwitch from "../_components/create_band/IOSSwitch";
import { genres } from "../_constants/genres";
import { useSnapshot } from "valtio";
import { createBandActions, createBandStore } from "@/store/createBandStore";
import GenreStatusBlackBtn from "../_components/create_band/genre/GenreStatusBlackBtn";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import JoinHeader from "../_components/JoinHeader";
import { API } from "@/api/API";
import ToggleBtn from "../_components/ToggleBtn";
import axios from "axios";

const sessionList = [
  { key: "🎤 보컬 🎤", Icon: MicImg },
  { key: "🎸 일렉 기타 🎸", Icon: ElectricGuitarImg },
  { key: "🪕 어쿠스틱 기타 🪕", Icon: GuitarImg },
  { key: "🎵 베이스 🎵", Icon: BassImg },
  { key: "🥁 드럼 🥁", Icon: DrumImg },
  { key: "🎹 키보드 🎹", Icon: PianoImg },
  { key: "🎻 바이올린 🎻", Icon: ViolinImg },
  { key: "🎺 트럼펫 🎺", Icon: TrumpetImg },
] as const;

type SessionKey = (typeof sessionList)[number]["key"];
type SessionState = Record<SessionKey, boolean>;

type age = "10대" | "20대" | "30대" | "40대" | "50대" | "60대" | "무관";
type gender = "OTHER" | "MALE" | "FEMALE";
type sido =
  | "서울"
  | "경기"
  | "인천"
  | "부산"
  | "대구"
  | "광주"
  | "대전"
  | "울산"
  | "세종"
  | "강원"
  | "충북"
  | "충남"
  | "전북"
  | "전남"
  | "경북"
  | "경남"
  | "제주";

type WannaBuddy = {
  startAge: age;
  endAge: age;
  gender: gender;
  location: {
    sido: sido;
    sigungu: string;
  };
};

const ages = ["10대", "20대", "30대", "40대", "50대", "60대", "무관"];
const genders = [
  { label: "남녀무관", value: "OTHER" },
  { label: "남자 선호", value: "MALE" },
  { label: "여자 선호", value: "FEMALE" },
];
const sidoList = regions;

interface ExistMember {
  averageAge: age;
  job: {
    colleague: boolean;
    worker: boolean;
    freelancer: boolean;
  };
  genderRatio: {
    male: string;
    female: string;
  };
  existSession: SessionState;
}

interface CreateBandPayload {
  snsLinks: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
  gender: string;
  averageAge: string;
  maleCount: number;
  femaleCount: number;
  genres: string[];
  ageStart: number;
  artistSpotifyIds: string[];
  autoClose: boolean;
  endDate: string;
  trackSpotifyIds: string[];
  name: string;
  district: string;
  representativeSong: string;
  status: string;
  region: string;
  currentSessions: string[];
  session: string[];
  ageEnd: number;
  description: string;
  job: string[];
}

interface EditBandPayload extends CreateBandPayload {
  bandId: string;
}

interface FetchedBandPayload {
  status: string;
  profileImageUrl: string | null;
  representativeSong: {
    spotifyId: string;
    artist: string;
    trackTitle: string;
  };
  representativeSongFile: {
    originalFilename: string;
    fileUrl: string;
  };
  name: string;
  endDate: string;
  autoClose: boolean;
  description: string;
  sessions: SessionKey[];
  genres: string[];
  artists: [
    {
      spotifyId: string;
      name: string;
      imageUrl: string | null;
    }
  ];
  tracks: [
    {
      spotifyId: string;
      title: string;
      imageUrl: string | null;
    }
  ];
  ageStart: number;
  ageEnd: number;
  gender: gender;
  region: sido;
  averageAge: age;
  jobs: string[];
  maleCount: number;
  femaleCount: number;
  currentSessions: SessionKey[];
  snsLink: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
}

const CreateBand = () => {
  const [isRecruiting, setIsRecruiting] = useState(true);
  const [name, setName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [fetchedAudioFileName, setFetchedAudioFileName] = useState<
    string | null
  >(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [automaticClosing, setAutomaticClosing] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [bandIntro, setBandIntro] = useState("");
  const [recruitSession, setRecruitSession] = useState<SessionState>(
    sessionList.reduce(
      (acc, { key }) => ({ ...acc, [key]: false }),
      {} as SessionState
    )
  );
  const [wannaBuddy, setWannaBuddy] = useState<WannaBuddy>({
    startAge: "무관",
    endAge: "무관",
    gender: "OTHER",
    location: {
      sido: "서울",
      sigungu: "",
    },
  });
  const [existMember, setExistMember] = useState<ExistMember>({
    averageAge: "20대",
    job: {
      colleague: false,
      worker: false,
      freelancer: false,
    },
    genderRatio: {
      male: "",
      female: "",
    },
    existSession: sessionList.reduce(
      (acc, { key }) => ({ ...acc, [key]: false }),
      {} as SessionState
    ),
  });
  const [snsLink, setSnsLink] = useState({
    youtube: "",
    instagram: "",
    tiktok: "",
  });

  const [openSelectExistingSessions, setOpenSelectExistingSessions] =
    useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { genres: toggledGenre, artists, songs } = useSnapshot(createBandStore);
  const setToggledGenre = createBandActions.setGenres;

  const navigate = useNavigate();
  const outlet = useOutlet();

  const location = useLocation();
  const { isEditing = false, bandId = "" } = location.state ?? {};

  useEffect(() => {
    const fetchExistedData = async () => {
      const { data: fetchedData } = await API.get<{
        result: FetchedBandPayload;
      }>(`/api/recruitments/${bandId}`);
      console.log("data:", fetchedData);
      const data = fetchedData.result;

      setName(data.name);
      setFetchedAudioFileName(data.representativeSongFile.originalFilename);
      setEndDate(new Date(data.endDate));
      setAutomaticClosing(data.autoClose);
      setBandIntro(data.description);
      setRecruitSession(
        data.sessions.reduce<SessionState>((acc, session) => {
          acc[session] = true;
          return acc;
        }, {} as SessionState)
      );

      let startAge: age, endAge: age;
      if (data.ageStart === 0) {
        startAge = "무관";
      } else {
        startAge = (data.ageStart.toString() + "대") as age;
      }
      if (data.ageEnd === 0) {
        endAge = "무관";
      } else {
        endAge = (data.ageEnd.toString() + "대") as age;
      }

      setWannaBuddy({
        startAge,
        endAge,
        gender: data.gender,
        location: {
          sido: data.region,
          sigungu: "",
        },
      });
      setExistMember({
        averageAge: data.averageAge,
        job: {
          colleague: data.jobs.includes("colleague"),
          worker: data.jobs.includes("worker"),
          freelancer: data.jobs.includes("freelancer"),
        },
        genderRatio: {
          male: data.maleCount.toString(),
          female: data.femaleCount.toString(),
        },
        existSession: data.currentSessions.reduce((acc, session) => {
          acc[session] = true;
          return acc;
        }, {} as SessionState),
      });
      setSnsLink({
        youtube: data.snsLink.additionalProp1,
        instagram: data.snsLink.additionalProp2,
        tiktok: data.snsLink.additionalProp3,
      });
      // valtio
      createBandActions.setGenres(data.genres);
      createBandActions.setArtists(
        data.artists.map((artist) => ({
          spotifyId: artist.spotifyId,
          name: artist.name,
          imageUrl: artist.imageUrl,
        }))
      );
      createBandActions.setSongs(
        data.tracks.map((track) => ({
          spotifyId: track.spotifyId,
          title: track.title,
          imageUrl: track.imageUrl,
        }))
      );
    };

    // 페이지 진입 시 valtio 초기화
    createBandActions.setGenres([]);
    createBandActions.setArtists([]);
    createBandActions.setSongs([]);

    if (isEditing) {
      fetchExistedData();
    }
  }, [isEditing]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    setImgSrc(url);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleAudioSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (event.target.files && event.target.files[0]) || null;
    setAudioFile(file);
    // allow re-selecting the same file
    event.target.value = "";
  };

  const toggleJobInfoBtn = (key: keyof typeof existMember.job) => () => {
    setExistMember((prev) => {
      const newJobState = { ...prev.job, [key]: !prev.job[key] };
      return {
        ...prev,
        job: newJobState,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      const session = Object.entries(recruitSession)
        // eslint-disable-next-line
        .filter(([_, on]) => on)
        .map(([key]) => key);

      const currentSessions = Object.entries(existMember.existSession)
        // eslint-disable-next-line
        .filter(([_, on]) => on)
        .map(([key]) => key);

      const job = Object.entries(existMember.job)
        // eslint-disable-next-line
        .filter(([_, on]) => on)
        .map(([key]) => key);

      let fileUrl = "";
      // presignedURL 이미지 업로드
      if (audioFile) {
        const { data } = await API.post(
          "/api/audio/presign",
          {},
          {
            params: {
              filename: audioFile.name,
              contentType: audioFile.type,
            },
          }
        );

        const { uploadUrl, fileUrl: presignedFileUrl } = data.result;
        // S3 PUT typically returns an empty body. Use fileUrl from the presign response.
        await axios.put(uploadUrl, audioFile, {
          headers: { "Content-Type": audioFile.type },
        });
        fileUrl = presignedFileUrl;
      }

      // formData 생성
      const payload: CreateBandPayload | EditBandPayload = {
        status: isRecruiting ? "RECRUITING" : "ACTIVE",
        representativeSong: songs[0]?.spotifyId.toString() ?? "",
        name,
        endDate: endDate.toISOString(),
        autoClose: automaticClosing,
        description: bandIntro,
        session, // e.g. ["🎤 보컬 🎤", "🎸 일렉 기타 🎸", …]
        genres: [...toggledGenre],
        artistSpotifyIds: artists.map((a) => a.spotifyId),
        trackSpotifyIds: songs.map((s) => s.spotifyId),
        ageStart: parseInt(wannaBuddy.startAge), // convert "20대"→20
        ageEnd: parseInt(wannaBuddy.endAge),
        gender: wannaBuddy.gender,
        region: wannaBuddy.location.sido,
        district: wannaBuddy.location.sigungu, // ""
        averageAge: existMember.averageAge,
        job, // e.g. ["대학생","프리랜서"]
        maleCount: Number(existMember.genderRatio.male) || 0,
        femaleCount: Number(existMember.genderRatio.female) || 0,
        currentSessions,
        snsLinks: {
          additionalProp1: snsLink.youtube,
          additionalProp2: snsLink.instagram,
          additionalProp3: snsLink.tiktok,
        },
        ...(audioFile && {
          originalFilename: audioFile?.name,
          fileUrl,
        }),
        ...(isEditing && { bandId }),
      };

      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));

      formData.append(
        "data",
        new Blob([JSON.stringify(payload)], {
          type: "application/json; charset=UTF-8",
        })
      );

      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      if (!isEditing) {
        await API.post("/api/recruitments", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await API.patch("/api/recruitments", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("성공!");
      createBandActions.setArtists([]);
      createBandActions.setGenres([]);
      createBandActions.setSongs([]);
      navigate("/join");
    } catch (err) {
      console.error(err);
    }
  };

  if (outlet) {
    return outlet;
  }

  return (
    <main className="relative min-h-screen w-[393px] mx-auto pb-[200px]">
      <div className="px-[16px] pt-[16px]">
        <JoinHeader enableConfirmBtn onClick={handleSubmit} />
      </div>

      <div className="flex flex-col gap-[48px] px-[24px] pt-[8px]">
        <section>
          {isEditing && (
            <IOSSwitch
              defaultChecked={isRecruiting}
              checked={isRecruiting}
              onChange={() => {
                setIsRecruiting(!isRecruiting);
              }}
            />
          )}

          <div className="flex justify-center">
            <div
              className="flex items-center justify-center relative mt-[30px] size-[162px] rounded-[10px] bg-[#CACACA]"
              style={{
                backgroundImage: imgSrc ? `url(${imgSrc})` : "",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <img
                src={happy}
                alt="happy mood"
                className={clsx("size-[112px]", imgSrc ? "hidden" : "")}
              />
              <button
                className="absolute right-[0] bottom-[0] p-[0] size-[39px] bg-transparent border-none cursor-pointer"
                onClick={() => setOpenDialog(true)}
              >
                <img className="size-full" src={cameraBtn} alt="camera" />
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-[16px]">
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-[8px]">
              <img src={music} alt="music" />
              <p className="max-w-[280px] text-hakgyo-b-17 text-[#959595] whitespace-nowrap overflow-x-auto">
                {/* fetchedAudioFileName이 있을 경우 제목만 보여주기 (추가된 것처럼 보일 수 있도록) */}
                {audioFile
                  ? audioFile.name
                  : fetchedAudioFileName
                  ? fetchedAudioFileName
                  : "노래를 추가하세요."}
              </p>
            </div>
            <button
              className="text-ibm-sb-16 text-[#D13D55]"
              onClick={() => audioInputRef.current?.click()}
            >
              추가
            </button>
          </div>

          {/* Hidden audio input for uploading from device */}
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioSelect}
            className="hidden"
          />

          {/* Selected audio file preview */}
          {/* {audioFile && (
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between bg-[#1E1E1E] rounded-[8px] px-[12px] py-[8px]">
                <div className="flex flex-col">
                  <p className="text-wanted-sb-12 text-white line-clamp-1">
                    {audioFile.name}
                  </p>
                  <p className="text-wanted-sb-10 text-[#959595]">
                    {Math.max(1, Math.round(audioFile.size / 1024))} KB
                  </p>
                </div>
                <button
                  type="button"
                  className="text-wanted-sb-12 text-[#D13D55]"
                  onClick={removeAudio}
                >
                  제거
                </button>
              </div>
            </div>
          )} */}

          <JoinInputField
            type="text"
            placeholder="밴드 이름을 입력하세요."
            className="w-full h-full bg-transparent border-none text-hakgyo-r-16 text-[#959595] focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </section>

        <section className="flex flex-col gap-[20px]">
          <p className="text-hakgyo-b-17 text-[#E9E9E9]">모집 마감일</p>
          <div className="flex w-full">
            <DateSelect date={endDate} setDate={setEndDate} />
          </div>
          <ToggleBtn toggle={automaticClosing} setToggle={setAutomaticClosing}>
            지정한 날이 되면 자동으로 모집 마감
          </ToggleBtn>
        </section>

        <section className="flex flex-col gap-[20px] w-full">
          <p className="text-hakgyo-b-17 text-[#E9E9E9]">밴드 소개글</p>
          <JoinInputField
            type="text"
            placeholder="밴드 소개글을 입력하세요."
            className="w-full h-full bg-transparent border-none text-hakgyo-r-16 text-[#959595] focus:outline-none"
            value={bandIntro}
            onChange={(e) => setBandIntro(e.target.value)}
          />
        </section>

        <section>
          <div className="flex mb-[20px]">
            <p className="text-hakgyo-b-17 text-[#E9E9E9]">모집 세션</p>
            &nbsp;
            <p className="text-hakgyo-r-16 text-[#C7242D]">*</p>
          </div>

          <div className="flex flex-col gap-[16px]">
            {[sessionList.slice(0, 4), sessionList.slice(4, 8)].map(
              (row, rowIndex) => (
                <div key={rowIndex} className="flex gap-[16px]">
                  {row.map(({ key, Icon }) => (
                    <button
                      onClick={() =>
                        setRecruitSession((prev) => ({
                          ...prev,
                          [key]: !prev[key as SessionKey],
                        }))
                      }
                      className="cursor-pointer"
                    >
                      <Icon
                        color={
                          recruitSession[key as SessionKey] ? "red" : "gray"
                        }
                      />
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
        </section>

        <section className="flex flex-col gap-[18px] w-full">
          <div className="flex justify-between w-full">
            <div className="flex">
              <p className="text-hakgyo-b-17 text-[#E9E9E9]">추구하는 장르</p>
              &nbsp;
              <p className="text-hakgyo-r-16 text-[#C7242D]">*</p>
            </div>
            <button
              className="text-ibm-sb-16 text-[#D13D55]"
              onClick={() => {
                navigate("/join/create-band/genre");
              }}
            >
              수정
            </button>
          </div>

          {toggledGenre.length > 0 && (
            <div className="flex flex-nowrap gap-[12px] overflow-x-auto">
              {toggledGenre.map((genre) => (
                <GenreStatusBlackBtn
                  key={genre}
                  onClick={() =>
                    setToggledGenre(toggledGenre.filter((id) => id !== genre))
                  }
                >
                  {genres.find((g) => g.text === genre)?.content}
                </GenreStatusBlackBtn>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-[18px] w-full">
          <div className="flex justify-between w-full">
            <div className="flex">
              <p className="text-hakgyo-b-17 text-[#E9E9E9]">
                대표하는 아티스트
              </p>
              &nbsp;
              <p className="text-hakgyo-r-16 text-[#C7242D]">*</p>
            </div>
            <button
              className="text-ibm-sb-16 text-[#D13D55]"
              onClick={() => {
                navigate("/join/create-band/artist");
              }}
            >
              수정
            </button>
          </div>
          {artists.length > 0 && (
            <div className="flex flex-nowrap gap-[12px] overflow-x-auto">
              {artists.map((artist) => (
                <div
                  key={artist.spotifyId}
                  className="flex flex-col items-center gap-[4px] flex-shrink-0"
                >
                  <div
                    className="relative w-[50px] h-[50px] rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${artist.imageUrl})`,
                    }}
                  />
                  <p className="w-[55px] text-hakgyo-r-14 text-white text-center line-clamp-1">
                    {artist.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-[18px] w-full">
          <div className="flex justify-between w-full">
            <div className="flex">
              <p className="text-hakgyo-b-17 text-[#E9E9E9]">목표하는 곡</p>
              &nbsp;
              <p className="text-hakgyo-r-16 text-[#C7242D]">*</p>
            </div>
            <button
              className="text-ibm-sb-16 text-[#D13D55]"
              onClick={() => {
                navigate("/join/create-band/song");
              }}
            >
              수정
            </button>
          </div>
          {songs.length > 0 && (
            <div className="flex flex-nowrap gap-[12px] overflow-x-auto">
              {songs.map((song) => (
                <div
                  key={song.spotifyId}
                  className="flex flex-col items-center gap-[4px] flex-shrink-0"
                >
                  <div
                    className="relative w-[50px] h-[50px] bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${song.imageUrl})`,
                    }}
                  />
                  <p className="w-[55px] text-wanted-sb-12 text-white line-clamp-2">
                    {song.title}
                  </p>
                  <p className="w-[55px] text-wanted-sb-10 text-[#959595] line-clamp-1">
                    {song.artist}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex mb-[20px]">
            <p className="text-hakgyo-b-17 text-[#E9E9E9]">
              함께하고 싶은 밴드 버디
            </p>
            &nbsp;
            <p className="text-hakgyo-r-16 text-[#C7242D]">*</p>
          </div>

          <div className="flex flex-col gap-[24px]">
            <div className="flex items-center">
              <div className="flex items-center gap-[8px] mr-[16px]">
                <p className="text-wanted-sb-13 text-[#CACACA] whitespace-nowrap">
                  연령
                </p>
                <div className="w-[0.5px] h-[21px] bg-[#CACACA]"></div>
              </div>
              <div className="flex items-center gap-[12px]">
                <SelectWithArrow
                  value={wannaBuddy.startAge}
                  onChange={(e) =>
                    setWannaBuddy({
                      ...wannaBuddy,
                      startAge: e.target.value as age,
                    })
                  }
                  options={ages}
                />
                <p className="text-wanted-sb-13 text-[#CACACA] whitespace-nowrap">
                  부터
                </p>
                <SelectWithArrow
                  value={wannaBuddy.endAge}
                  onChange={(e) =>
                    setWannaBuddy({
                      ...wannaBuddy,
                      endAge: e.target.value as age,
                    })
                  }
                  options={ages}
                />
                <p className="text-wanted-sb-13 text-[#CACACA] whitespace-nowrap">
                  까지
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center gap-[8px] mr-[16px]">
                <p className="text-wanted-sb-13 text-[#CACACA] whitespace-nowrap">
                  성별
                </p>
                <div className="w-[0.5px] h-[21px] bg-[#CACACA]"></div>
              </div>
              <div className="flex items-center gap-[12px]">
                <SelectWithArrow
                  value={
                    genders.find((g) => g.value === wannaBuddy.gender)?.label ??
                    ""
                  }
                  onChange={(e) => {
                    const selectedLabel = e.target.value;
                    const selectedGender = genders.find(
                      (g) => g.label === selectedLabel
                    );
                    if (selectedGender) {
                      setWannaBuddy({
                        ...wannaBuddy,
                        gender: selectedGender.value as gender,
                      });
                    }
                  }}
                  options={genders.map((g) => g.label)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center gap-[8px] mr-[16px]">
                <p className="text-wanted-sb-13 text-[#CACACA] whitespace-nowrap">
                  지역
                </p>
                <div className="w-[0.5px] h-[21px] bg-[#CACACA]"></div>
              </div>
              <div className="flex items-center gap-[12px]">
                <SelectWithArrow
                  value={wannaBuddy.location.sido}
                  onChange={(e) =>
                    setWannaBuddy({
                      ...wannaBuddy,
                      location: {
                        ...wannaBuddy.location,
                        sido: e.target.value as sido,
                      },
                    })
                  }
                  options={sidoList}
                />

                <p className="text-wanted-sb-13 text-[#CACACA]">에서 활동</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-[12px] mb-[20px]">
            <p className="text-hakgyo-b-17 text-[#E9E9E9]">
              기존의 밴드 구성원이 있나요?
            </p>
            <p className="text-hakgyo-r-14 text-[#959595]">
              해당하는 정보를 입력해주세요.
            </p>
          </div>

          <div className="flex flex-col gap-[32px]">
            <div className="flex items-center">
              <div className="flex items-center gap-[8px] mr-[16px]">
                <p className="text-wanted-sb-13 text-[#CACACA] whitespace-nowrap">
                  평균 연령대
                </p>
                <div className="w-[0.5px] h-[21px] bg-[#CACACA]"></div>
              </div>
              <div className="flex items-center gap-[12px]">
                <SelectWithArrow
                  value={existMember.averageAge}
                  onChange={(e) =>
                    setExistMember({
                      ...existMember,
                      averageAge: e.target.value as age,
                    })
                  }
                  options={ages.filter((age) => age !== "무관")}
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-[8px] mr-[16px]">
                <p className="text-wanted-sb-13 text-[#CACACA] whitespace-nowrap">
                  직업 정보
                </p>
                <div className="w-[0.5px] h-[21px] bg-[#CACACA]"></div>
              </div>
              <div className="flex items-center gap-[12px]">
                <JobInfoBtn
                  isActive={existMember.job.colleague}
                  onClick={toggleJobInfoBtn("colleague")}
                >
                  대학생
                </JobInfoBtn>
                <JobInfoBtn
                  isActive={existMember.job.worker}
                  onClick={toggleJobInfoBtn("worker")}
                >
                  직장인
                </JobInfoBtn>
                <JobInfoBtn
                  isActive={existMember.job.freelancer}
                  onClick={toggleJobInfoBtn("freelancer")}
                >
                  프리랜서
                </JobInfoBtn>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center gap-[8px] mr-[16px]">
                <p className="text-wanted-sb-13 text-[#CACACA] whitespace-nowrap">
                  성비
                </p>
                <div className="w-[0.5px] h-[21px] bg-[#CACACA]"></div>
              </div>
              <div className="flex items-center gap-[12px]">
                <p className="text-hakgyo-r-16 text-[#ffffff]">남</p>
                <div className="relative flex justify-between w-[29px] border-b-[0.75px] border-[#959595]">
                  <input
                    type="text"
                    className="w-full h-full bg-transparent border-none text-hakgyo-r-16 text-[#ffffff] text-center focus:outline-none"
                    value={existMember.genderRatio.male}
                    onChange={(e) =>
                      setExistMember({
                        ...existMember,
                        genderRatio: {
                          ...existMember.genderRatio,
                          male: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <p className="text-hakgyo-r-16 text-[#ffffff]">명,</p>
                <p className="text-hakgyo-r-16 text-[#ffffff]">여</p>
                <div className="relative flex justify-between w-[29px] border-b-[0.75px] border-[#959595]">
                  <input
                    type="text"
                    className="w-full h-full bg-transparent border-none text-hakgyo-r-16 text-[#ffffff] text-center focus:outline-none"
                    value={existMember.genderRatio.female}
                    onChange={(e) =>
                      setExistMember({
                        ...existMember,
                        genderRatio: {
                          ...existMember.genderRatio,
                          female: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <p className="text-hakgyo-r-16 text-[#ffffff]">명</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-[8px] mr-[16px]">
                <p className="text-wanted-sb-13 text-[#CACACA] whitespace-nowrap">
                  기존 세션
                </p>
                <div className="w-[0.5px] h-[21px] bg-[#CACACA]"></div>
              </div>

              <div className="grid grid-cols-5 gap-4 place-items-center">
                {sessionList.map(
                  ({ key, Icon }) =>
                    existMember.existSession[key as SessionKey] && (
                      <Icon key={key} color="red" size={42} />
                    )
                )}
                <button
                  className={clsx(
                    "flex items-center justify-center size-[42px] rounded-full bg-[#CACACA] cursor-pointer",
                    Object.values(existMember.existSession).filter((v) => v)
                      .length === 8 && "translate-x-1/2"
                  )}
                  onClick={() => setOpenSelectExistingSessions(true)}
                >
                  <img src={plusIcon} alt="+" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 기존 세션 Slide Dialog */}
        <Dialog
          open={openSelectExistingSessions}
          onClose={() => setOpenSelectExistingSessions(false)}
          slots={{
            transition: Slide,
          }}
          slotProps={{
            transition: {
              direction: "up",
              mountOnEnter: true,
              unmountOnExit: true,
            },
          }}
          PaperProps={{
            sx: {
              position: "fixed",
              bottom: 0,
              left: 0,
              margin: "0",
              padding: "36.5px 0",
              paddingTop: "8px",
              paddingBottom: "46px",
              width: "100%",
              backgroundColor: "#E9E9E9",
              boxShadow: "0px -4px 4px rgba(0, 0, 0, 0.25)",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              zIndex: 1300,
            },
          }}
        >
          <div className="flex justify-center w-full">
            <div className="w-[106px] h-[5px] rounded-[5px] bg-[#959595]"></div>
          </div>
          <div className="flex flex-col items-center justify-center gap-[8px] mt-[32px] h-full">
            {[sessionList.slice(0, 4), sessionList.slice(4, 8)].map(
              (row, rowIndex) => (
                <div key={rowIndex} className="flex gap-[16px]">
                  {row.map(({ key, Icon }) => (
                    <button
                      onClick={() =>
                        setExistMember((prev) => ({
                          ...prev,
                          existSession: {
                            ...prev.existSession,
                            [key]: !prev.existSession[key],
                          },
                        }))
                      }
                      className="cursor-pointer"
                    >
                      <Icon
                        color={
                          existMember.existSession[key as SessionKey]
                            ? "red"
                            : "gray"
                        }
                        size={68}
                      />
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
        </Dialog>

        <section className="flex flex-col gap-[19px]">
          <p className="mb-[1px] text-hakgyo-b-17 text-[#E9E9E9]">
            밴드의 SNS가 있다면 링크를 넣어주세요.
          </p>
          <SnsInputField
            icon={youtubeIcon}
            value={snsLink.youtube}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSnsLink({ ...snsLink, youtube: e.target.value })
            }
            onDelete={() => setSnsLink({ ...snsLink, youtube: "" })}
          />
          <SnsInputField
            icon={instagramIcon}
            value={snsLink.instagram}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSnsLink({ ...snsLink, instagram: e.target.value })
            }
            onDelete={() => setSnsLink({ ...snsLink, instagram: "" })}
          />
          <SnsInputField
            icon={tiktokIcon}
            value={snsLink.tiktok}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSnsLink({ ...snsLink, tiktok: e.target.value })
            }
            onDelete={() => setSnsLink({ ...snsLink, tiktok: "" })}
          />
        </section>

        <MuiDialog open={openDialog} setOpen={setOpenDialog}>
          <div className="flex flex-col items-center justify-between pt-[62px] pb-[28px] px-[26px] w-[336px] h-[229px]">
            <div className="flex flex-col items-center gap-[12px]">
              <p className="text-hakgyo-b-24">채팅방 사진 등록</p>
              <p className="text-hakgyo-r-14 text-[#555]">
                앨범에서 사진을 등록하시겠습니까?
              </p>
            </div>
            <div className="flex gap-[8px]">
              <CommonBtn color="gray" onClick={() => setOpenDialog(false)}>
                아니오
              </CommonBtn>
              <CommonBtn
                color="red"
                onClick={() => {
                  setOpenDialog(false);
                  openFileSelector();
                }}
              >
                예
              </CommonBtn>
            </div>
          </div>
        </MuiDialog>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
      </div>
    </main>
  );
};

export default CreateBand;

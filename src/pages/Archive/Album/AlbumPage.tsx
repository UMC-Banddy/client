import { useState } from "react";
import AlbumGrid from "./AlbumGrid";
import lock from "@/assets/icons/archive/lock.svg";
import unlock from "@/assets/icons/archive/unlock.svg";
import plus from "@/assets/icons/archive/plus.svg";
import { useNavigate } from "react-router-dom";

// 목데이터
const albumData = [
  { image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTR3p-fly8W_TWNFWQxbYEXDbUjzhpxfTsTApqTglDpBPU2-JQj", title: "그래요 저 왜색질이에요" },
  { image: "https://image.yes24.com/momo/TopCate0010/hani/L_601438.jpg", title: "우후" },
  { image: "https://fastly-s3.allmusic.com/release/mr0006397615/front/400/OEPzpYnfre8CKU9emnxBJ5hUoDg0hsvx4F4sL4oO-nA=.jpg", title: "여자보컬이좋아" },
  { image: "https://i.namu.wiki/i/CrVepZ3RwDBTeU0tJTIIvy0rJ2qi3kV_bN7Xg0aMX4gUcyZlCSgQc2ZECXiUSCbMRrU3idzwYd-mdS7SqeI9Sw.webp", title: "우울한인디" },
  // ...etc
];

export default function AlbumPage() {
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div className="pr-[6vw]">
        <div className="flex items-center justify-end mt-[2vh] mb-[3vh]">
          <div className="flex items-center justify-end mt-[1.6vh] mb-[0.5vh]" onClick={() => navigate("/my/archive/add")}>
            <img src={plus} alt="plus" className="w-[10vw] h-[10vw] cursor-pointer" />
          </div>
          <div onClick={() => setLocked((prev) => !prev)} className="ml-[1vw] cursor-pointer">
            {locked ? (
              <img src={lock} alt="lock" className="w-[10vw] h-[10vw]" />
            ) : (
              <img src={unlock} alt="unlock" className="w-[10vw] h-[10vw]" />
            )}
          </div>
        </div>
        <AlbumGrid items={albumData} />
      </div>
    </>
  );
}

import { useNavigate } from "react-router-dom";
import { type AlbumGridProps } from "@/types/album";

export default function AlbumGrid({ items }: AlbumGridProps) {
  const navigate = useNavigate();
  
  const handleAlbumClick = (albumId?: string) => {
    if (albumId) {
      navigate(`/my/archive/album/${albumId}`);
    }
  };

  return (
    <div className="grid grid-cols-2 justify-items-center gap-x-[12px] mb-[3vh]">
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity max-w-[166px] break-keep"
          onClick={() => handleAlbumClick(item.albumId)}
        >
          <div className="relative w-[42vw] h-[42vw] max-w-[166px] max-h-[166px] overflow-hidden bg-[#232325]">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="mt-[1.4vh] mb-[2.8vh] text-[#FFFFFF] text-hakgyo-r-14">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
}
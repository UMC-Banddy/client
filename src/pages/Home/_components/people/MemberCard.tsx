import KingBadge from "@/pages/Home/_components/people/KingBadge";
import homeAlbum1 from "@/assets/images/home-album1.svg";

const MemberCard = () => {
  return (
    <div className="w-full max-w-xl px-6 ml-8 mr-8">
      <div className="flex items-center gap-6 py-4">
        <img
          src={homeAlbum1}
          alt="profile"
          className="w-18 h-18 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center">
            <KingBadge />
            <span className="font-bold text-base text-[#E9E9E9] font-hakgyoansim">
              괴담재미따
            </span>
          </div>
          <p className="text-sm text-gray-400">보컬, 일렉기타</p>
        </div>
      </div>
      <div className="border-b border-gray-600/70 w-full" />
    </div>
  );
};

export default MemberCard;

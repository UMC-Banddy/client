import { Mic, Guitar, Drum } from "lucide-react";

const iconClass = "w-14 h-14 text-gray-700";

const RoleIconList = () => {
  return (
    <div className="flex gap-x-4 mb-4 px-4 w-full justify-start">
      <div className="bg-[#E9E9E9] rounded-full w-20 h-20 flex items-center justify-center">
        <Mic className={iconClass} />
      </div>
      <div className="bg-[#E9E9E9] rounded-full w-20 h-20 flex items-center justify-center">
        <Guitar className={iconClass} />
      </div>
      <div className="bg-[#E9E9E9] rounded-full w-20 h-20 flex items-center justify-center">
        <Drum className={iconClass} />
      </div>
    </div>
  );
};

export default RoleIconList;

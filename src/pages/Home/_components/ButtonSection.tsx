import React from 'react';
import whiteStar from '@/assets/logos/white-star.svg';
import muteIcon from '@/assets/icons/no-sound.svg';
import starIcon from '@/assets/icons/like-star.svg';

const ButtonSection = () => {
  return (
    <div className="flex items-center justify-center gap-x-4 px-4 pr-4 py-0 mt-0 mb-0">
      <button className="opacity-50 p-2 hover:opacity-80 transition">
        <img src={muteIcon} alt="mute" className="w-6 h-6" />
      </button>
      <button className="bg-red-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-bold hover:bg-red-500 transition">
        <img src={whiteStar} alt="join" className="w-4 h-4" />
        JOIN
      </button>
      <button className="opacity-50 p-2 hover:opacity-80 transition">
        <img src={starIcon} alt="like" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ButtonSection;

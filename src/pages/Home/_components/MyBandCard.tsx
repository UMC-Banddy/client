import React from 'react';
import ButtonSection from './ButtonSection';

interface Band {
  title: string;
  description: string;
  image: string;
}

const MyBandCard: React.FC<{ band: Band }> = ({ band }) => {
  return (
    <div className="flex flex-col items-center text-center pt-6 pb-10 px-10 gap-y-0">
      <img
        src={band.image}
        alt={band.title}
        className="w-72 h-72 rounded-xl object-cover mb-6"
      />
      <h2 className="text-white font-bold text-xl mb-2">{band.title}</h2>
      <p className="text-gray-400 text-sm mb-6">{band.description}</p>
      <div className="mt-2">
        <ButtonSection />
      </div>
    </div>
  );
};

export default MyBandCard;

type ProfileBioProps = {
  bio: string;
};

export default function ProfileBio({ bio }: ProfileBioProps) {
  return (
    <>
      <div className="text-hakgyo-b-17 bg-black text-white px-[1vw] py-[0.5vh] inline-block mb-[2vh]">소개글</div>
      <div className="text-left text-[#71717A] text-hakgyo-r-14 whitespace-pre-line mb-[7vh]">{bio}</div>
    </>
  );
}
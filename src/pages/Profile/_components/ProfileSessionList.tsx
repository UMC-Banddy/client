type Session = {
  icon: React.ReactNode;
};

type ProfileSessionListProps = {
  sessions: Session[];
};

export default function ProfileSessionList({ sessions }: ProfileSessionListProps) {
  return (
    <>
      <div className="text-hakgyo-b-17 bg-black text-white mb-[1.4vh] inline-block">가능 세션</div>
      <div className="flex gap-[2vw] mb-[3vh]">
        {sessions.map((s: Session, i: number) => (
          <span key={i} className="bg-[#B42127] text-white rounded-full p-[2vw] flex items-center gap-[1vw] text-hakgyo-r-14">{s.icon}</span>
        ))}
      </div>
    </>
  );
}
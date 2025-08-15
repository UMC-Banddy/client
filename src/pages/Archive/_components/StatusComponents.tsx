interface StatusProps {
  message: string;
  className?: string;
}

export function ErrorState({ message, className = "" }: StatusProps) {
  return (
    <div className={`min-h-[100vh] w-full flex items-center justify-center ${className}`}>
      <div className="text-white text-hakgyo-r-16 text-center">{message}</div>
    </div>
  );
}

export function EmptyState({ message, className = "" }: StatusProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="text-[#959595] text-hakgyo-r-16 text-center">{message}</div>
    </div>
  );
} 
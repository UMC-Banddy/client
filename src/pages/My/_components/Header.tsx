import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  leftLink?: string;
  rightIcon?: React.ReactNode;
  rightLink?: string;
  className?: string;
}

export default function Header({
  title,
  leftIcon,
  leftLink,
  rightIcon,
  rightLink,
  className = '',
}: HeaderProps) {
  return (
    <header
      className={`fixed top-[0vh] left-[0vw] w-full h-[13vh] bg-[#000000] flex items-center justify-between px-[4vw] ${className}`}
    >
      <div className="flex items-center">
        {leftIcon && leftLink ? (
          <Link to={leftLink} className="mr-2 flex items-center justify-center" aria-label="left icon">
            {leftIcon}
          </Link>
        ) : null}
        <span
          className="text-hel-26 text-[#FFFFFF] select-none"
        >
          {title}
        </span>
      </div>
      {rightIcon && rightLink ? (
        <Link to={rightLink} className="flex items-center justify-center bg-[#000000]" aria-label="right icon">
          {rightIcon}
        </Link>
      ) : null}
    </header>
  );
}
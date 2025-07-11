import React from 'react';

interface TagButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}

const TagButton = ({
  active,
  className = '',
  children,
  ...props
}: TagButtonProps) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-full min-w-max font-wantedsans font-semibold text-[15px] transition-colors duration-150 ${
      active
        ? 'bg-[#DF0001] text-white'
        : 'bg-black/80 text-white hover:bg-black/60'
    } ${className}`}
    aria-pressed={active}
    aria-label={typeof children === 'string' ? children : undefined}
  >
    {children}
  </button>
);

export default TagButton;

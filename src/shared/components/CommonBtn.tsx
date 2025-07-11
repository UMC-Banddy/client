import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface CommonBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'red' | 'gray';
}

/**
 * 예/아니오 버튼 컴포넌트
 * @param {string} color - 버튼 색상 (red | gray)
 * @returns {JSX.Element}
 */
const CommonBtn = ({ color, className, ...props }: CommonBtnProps) => {
  return (
    <button
      className={clsx(
        'w-[105px] h-[41px] border-none rounded-[50px] text-ibm-sb-16 whitespace-nowrap cursor-pointer',
        className,
        {
          'bg-[#B42127] text-[#fff]': color === 'red',
          'bg-[#CACACA] text-[#B42127]': color === 'gray',
        }
      )}
      {...props}
    ></button>
  );
};

export default CommonBtn;

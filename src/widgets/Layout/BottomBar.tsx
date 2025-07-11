import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import homeIcon from '@/assets/icons/bottom-home.svg';
import searchIcon from '@/assets/icons/bottom-search.svg';
import joinIcon from '@/assets/icons/bottom-join.svg';
import profileIcon from '@/assets/icons/bottom-profile.svg';
import '@/App.css';

const navs = [
  { label: '홈', icon: homeIcon, path: '/' },
  { label: '탐색', icon: searchIcon, path: '/explore' },
  { label: '밴드생성', icon: joinIcon, path: '/band/create' },
  { label: '마이', icon: profileIcon, path: '/my' },
];

const BottomBar = () => {
  const location = useLocation();
  return (
    <nav
      className="
        fixed bottom-[0vh] left-1/2 -translate-x-1/2 w-full max-w-md z-50
        flex justify-around items-center h-[12.2vh]
        custom-bottom-gradient rounded-t-2xl
      "
      aria-label="하단 내비게이션 바"
    >
      {navs.map((nav) => {
        const active = location.pathname === nav.path;
        return (
          <Link
            key={nav.path}
            to={nav.path}
            className="flex flex-col items-center justify-center flex-1 py-2"
            aria-label={nav.label}
          >
            <img
              src={nav.icon}
              alt={nav.label + ' 아이콘'}
              style={{
                width: '12.2vw',
                height: '12.2vw',
                maxWidth: 48,
                maxHeight: 48,
                minWidth: 32,
                minHeight: 32,
              }}
              className={`transition-opacity ${
                active ? 'opacity-100' : 'opacity-50'
              }`}
            />
            <span
              style={{
                width: '1.53vw',
                height: '1.53vw',
                borderRadius: '50%',
                backgroundColor: 'white',
                opacity: active ? 1 : 0,
              }}
              className="mt-1 transition-all"
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomBar;

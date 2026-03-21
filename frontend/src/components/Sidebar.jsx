import { Link, useLocation } from 'react-router-dom';
import { AiFillHome, AiOutlineHome, AiFillFire, AiOutlineFire } from 'react-icons/ai';
import { IoNewspaperOutline, IoNewspaper } from 'react-icons/io5';
import { BsPerson, BsPersonFill } from 'react-icons/bs';

const navItems = [
  { name: 'Home', path: '/', icon: AiOutlineHome, activeIcon: AiFillHome },
  { name: 'News', path: '/news', icon: IoNewspaperOutline, activeIcon: IoNewspaper },
  { name: 'Trending', path: '/trending', icon: AiOutlineFire, activeIcon: AiFillFire },
  { name: 'Profile', path: '/profile', icon: BsPerson, activeIcon: BsPersonFill },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <nav className="w-16 md:w-64 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col items-center md:items-start transition-all duration-300 z-50 shrink-0">
      <div className="p-4 md:p-6 w-full flex items-center justify-center md:justify-start">
        <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
          E
        </div>
        <span className="hidden md:block ml-3 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          EasyNews
        </span>
      </div>

      <div className="flex-1 w-full mt-4 md:mt-8 flex flex-col gap-2 px-2 md:px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <div className="relative flex items-center justify-center shrink-0 w-6 h-6">
                <Icon className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
              </div>
              <span className={`hidden md:block ml-4 font-medium transition-colors ${
                isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

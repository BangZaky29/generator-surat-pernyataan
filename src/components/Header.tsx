import React from 'react';
import logo from '../assets/NS_white_01.png';


const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 fixed top-0 w-full z-30">
      <div className="flex items-center gap-2 text-blue-600">
        <div className="w-12 h-12 flex items-center justify-center rounded-l shadow-[5px_5px_12px_rgba(0,0,0,0.11)] overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-contain"/>
          </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-800">
          Generator<span className="text-blue-600"> Surat Pernyataan</span>
        </h1>
      </div>
      <div className="ml-auto text-sm text-gray-500 hidden sm:block">
        Generator Surat Pernyataan
      </div>
    </header>
  );
};

export default Header;
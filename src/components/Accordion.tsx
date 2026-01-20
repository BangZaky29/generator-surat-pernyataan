import React from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  subTitle?: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, icon, isOpen, onToggle, children, subTitle }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 mb-3">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
          isOpen ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`${isOpen ? 'text-blue-600' : 'text-gray-500'}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">{title}</h3>
            {subTitle && <p className="text-xs text-gray-500 font-normal mt-0.5">{subTitle}</p>}
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 text-gray-400 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>
      
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 border-t border-gray-100 bg-white">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
import React from 'react';
import { MobileViewMode } from '../types';
import { Eye, PenLine } from 'lucide-react';

interface Props {
  currentView: MobileViewMode;
  onToggle: () => void;
}

const MobileActionButton: React.FC<Props> = ({ currentView, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 md:hidden z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
      aria-label="Toggle View"
    >
      {currentView === 'form' ? (
        <Eye size={24} />
      ) : (
        <PenLine size={24} />
      )}
    </button>
  );
};

export default MobileActionButton;

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Save, Download, Trash2 } from 'lucide-react';

export type ModalType = 'info' | 'warning' | 'danger' | 'import';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (inputValue?: string) => void;
    title: string;
    message: string;
    type?: ModalType;
    showInput?: boolean;
    inputPlaceholder?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'info',
    showInput = false,
    inputPlaceholder = 'Nama data...'
}) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (isOpen) setInputValue('');
    }, [isOpen]);

    if (!isOpen) return null;

    const icons = {
        info: <Save className="w-8 h-8 text-indigo-500" />,
        warning: <AlertTriangle className="w-8 h-8 text-amber-500" />,
        danger: <Trash2 className="w-8 h-8 text-red-500" />,
        import: <Download className="w-8 h-8 text-indigo-500" />,
    };

    const colors = {
        info: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
        warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
        danger: 'bg-red-600 hover:bg-red-700 shadow-red-200',
        import: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                <div className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-all" onClick={onClose}>
                    <X className="w-5 h-5" />
                </div>

                <div className="p-8 pb-6 flex flex-col items-center text-center">
                    <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
                        {icons[type] || icons.info}
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                        {message}
                    </p>

                    {showInput && (
                        <div className="w-full mb-6">
                            <input
                                type="text"
                                autoFocus
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={inputPlaceholder}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (inputValue.trim() || !showInput)) {
                                        onConfirm(inputValue);
                                    }
                                }}
                            />
                        </div>
                    )}

                    <div className="flex w-full gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-2xl transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(inputValue)}
                            disabled={showInput && !inputValue.trim()}
                            className={`flex-1 py-3.5 px-4 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${colors[type] || colors.info}`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;


import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Trash2, Save, Download, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'delete' | 'import';

interface NotificationProps {
    message: string;
    type?: NotificationType;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type = 'success', onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for transition
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Save className="w-5 h-5 text-indigo-500" />,
        delete: <Trash2 className="w-5 h-5 text-red-500" />,
        import: <Download className="w-5 h-5 text-indigo-500" />,
    };

    const bgColors = {
        success: 'bg-emerald-50 border-emerald-100',
        error: 'bg-red-50 border-red-100',
        info: 'bg-indigo-50 border-indigo-100',
        delete: 'bg-red-50 border-red-100',
        import: 'bg-indigo-50 border-indigo-100',
    };

    return (
        <div
            className={`fixed top-4 right-4 z-[9999] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
                }`}
        >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg ${bgColors[type] || bgColors.success}`}>
                {icons[type] || icons.success}
                <span className="text-sm font-semibold text-slate-700">{message}</span>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors text-slate-400"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Notification;

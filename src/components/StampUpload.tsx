import React, { useRef } from 'react';
import { Stamp, X, Upload } from 'lucide-react';

interface Props {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}

const StampUpload: React.FC<Props> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2 text-gray-700">
          <Stamp size={18} /> Stempel / Cap <span className="text-gray-400 text-xs">(Opsional)</span>
        </h3>
      </div>

      <div className="flex items-center gap-4">
        <div 
          className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 overflow-hidden relative group cursor-pointer"
          onClick={() => !value && fileInputRef.current?.click()}
        >
          {value ? (
            <>
              <img src={value} alt="Stempel" className="w-full h-full object-cover opacity-80" />
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                }}
                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <Stamp className="text-gray-300" size={24} />
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors w-full justify-center"
          >
            <Upload size={16} /> Pilih Gambar Stempel
          </button>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Gunakan gambar PNG dengan background transparan untuk hasil terbaik.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StampUpload;
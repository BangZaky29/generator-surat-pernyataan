import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PenTool, Upload, RefreshCcw, Eraser } from 'lucide-react';

interface Props {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}

const TTDUpload: React.FC<Props> = ({ value, onChange }) => {
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const sigPad = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearCanvas = () => {
    sigPad.current?.clear();
    onChange(null);
  };

  const handleEndDrawing = () => {
    if (sigPad.current) {
      onChange(sigPad.current.toDataURL());
    }
  };

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
          <PenTool size={18} /> Tanda Tangan <span className="text-red-500 text-xs">(Wajib)</span>
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode('draw')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              mode === 'draw' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Gambar
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              mode === 'upload' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === 'draw' ? (
        <div className="relative border border-gray-300 rounded-md bg-white touch-none">
          <SignatureCanvas
            ref={sigPad}
            penColor="black"
            canvasProps={{
              className: "w-full h-40 rounded-md cursor-crosshair",
            }}
            onEnd={handleEndDrawing}
          />
          <button
            type="button"
            onClick={clearCanvas}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 bg-white/80 p-1 rounded-full shadow-sm"
            title="Bersihkan"
          >
            <Eraser size={16} />
          </button>
          <div className="absolute bottom-2 left-0 w-full text-center pointer-events-none text-xs text-gray-300">
            Area Tanda Tangan
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md h-40 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative" onClick={() => fileInputRef.current?.click()}>
          {value ? (
            <img src={value} alt="TTD" className="h-full object-contain p-2" />
          ) : (
            <>
              <Upload className="text-gray-400 mb-2" size={24} />
              <p className="text-xs text-gray-500 font-medium">Klik untuk upload gambar TTD</p>
              <p className="text-[10px] text-gray-400 mt-1">PNG Transparan direkomendasikan</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          {value && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              <RefreshCcw size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TTDUpload;
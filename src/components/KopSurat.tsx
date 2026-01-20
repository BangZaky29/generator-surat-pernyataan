import React, { useRef } from 'react';
import { KopSuratData } from '../types';
import { Building2, Upload, X } from 'lucide-react';

interface Props {
  data: KopSuratData;
  onChange: (data: KopSuratData) => void;
}

const KopSurat: React.FC<Props> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2 text-gray-700">
          <Building2 size={18} /> Kop Surat
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={data.enabled}
            onChange={(e) => onChange({ ...data, enabled: e.target.checked })}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {data.enabled && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Logo Upload */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-50 border border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden relative">
              {data.logoUrl ? (
                <>
                  <img src={data.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  <button
                    onClick={() => onChange({ ...data, logoUrl: null })}
                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <span className="text-xs text-gray-400">No Logo</span>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleLogoUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors"
              >
                <Upload size={14} /> Upload Logo
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Nama Instansi / Perusahaan"
            value={data.namaInstansi}
            onChange={(e) => onChange({ ...data, namaInstansi: e.target.value })}
            className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <textarea
            placeholder="Alamat Lengkap"
            rows={2}
            value={data.alamat}
            onChange={(e) => onChange({ ...data, alamat: e.target.value })}
            className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Kontak (Telp / Email)"
            value={data.kontak}
            onChange={(e) => onChange({ ...data, kontak: e.target.value })}
            className="w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default KopSurat;
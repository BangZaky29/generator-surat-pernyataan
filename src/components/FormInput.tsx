import React, { useState } from 'react';
import { LetterData } from '../types';
import KopSurat from './KopSurat';
import TTDUpload from './TTDUpload';
import StampUpload from './StampUpload';
import Accordion from './Accordion';
import { User, MapPin, FileType, Calendar, FileText, Building2, Stamp } from 'lucide-react';

interface Props {
  data: LetterData;
  onChange: (data: LetterData) => void;
}

type SectionKey = 'kop' | 'identitas' | 'info' | 'isi' | 'legalitas';

const FormInput: React.FC<Props> = ({ data, onChange }) => {
  // State untuk mengontrol accordion mana yang terbuka
  const [activeSection, setActiveSection] = useState<SectionKey | null>('identitas');

  const toggleSection = (section: SectionKey) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  const handleChange = (field: keyof LetterData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 md:pb-10 px-1 md:px-0">
      
      {/* 1. KOP SURAT */}
      <Accordion
        title="Kop Surat"
        subTitle="Logo dan Identitas Instansi (Opsional)"
        icon={<Building2 size={20} />}
        isOpen={activeSection === 'kop'}
        onToggle={() => toggleSection('kop')}
      >
        <KopSurat 
            data={data.kopSurat} 
            onChange={(kopData) => onChange({ ...data, kopSurat: kopData })} 
        />
      </Accordion>

      {/* 2. IDENTITAS DIRI */}
      <Accordion
        title="Identitas Pembuat"
        subTitle="Nama, NIK, Pekerjaan, Alamat"
        icon={<User size={20} />}
        isOpen={activeSection === 'identitas'}
        onToggle={() => toggleSection('identitas')}
      >
        <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">Nama Lengkap</label>
              <input
                type="text"
                value={data.nama}
                onChange={(e) => handleChange('nama', e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                placeholder="Contoh: Budi Santoso"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase">NIK <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={data.nik}
                onChange={(e) => handleChange('nik', e.target.value.replace(/\D/g, ''))} // Numeric only
                maxLength={16}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                placeholder="16 Digit NIK"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Pekerjaan / Jabatan <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={data.pekerjaan}
              onChange={(e) => handleChange('pekerjaan', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              placeholder="Contoh: Karyawan Swasta"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Alamat Lengkap</label>
            <textarea
              value={data.alamat}
              onChange={(e) => handleChange('alamat', e.target.value)}
              rows={2}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              placeholder="Jl. Merdeka No. 45, Jakarta Pusat"
            />
          </div>
        </div>
      </Accordion>

      {/* 3. INFO SURAT */}
      <Accordion
        title="Informasi Surat"
        subTitle="Judul, Nomor, Tanggal & Tempat"
        icon={<FileType size={20} />}
        isOpen={activeSection === 'info'}
        onToggle={() => toggleSection('info')}
      >
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase">Judul Surat</label>
                <input
                type="text"
                value={data.judulSurat}
                onChange={(e) => handleChange('judulSurat', e.target.value.toUpperCase())}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold outline-none"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase">Nomor Surat (Opsional)</label>
                <input
                type="text"
                value={data.nomorSurat}
                onChange={(e) => handleChange('nomorSurat', e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="No: 001/SP/2024"
                />
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase">Tempat Surat (Kota)</label>
                <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                    type="text"
                    value={data.tempatSurat}
                    onChange={(e) => handleChange('tempatSurat', e.target.value)}
                    className="w-full p-3 pl-9 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: Jakarta"
                />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase">Tanggal Surat</label>
                <div className="relative">
                <Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                    type="date"
                    value={data.tanggalSurat}
                    onChange={(e) => handleChange('tanggalSurat', e.target.value)}
                    className="w-full p-3 pl-9 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                </div>
            </div>
            </div>
        </div>
      </Accordion>

      {/* 4. ISI PERNYATAAN */}
      <Accordion
        title="Isi Pernyataan"
        subTitle="Konten utama surat"
        icon={<FileText size={20} />}
        isOpen={activeSection === 'isi'}
        onToggle={() => toggleSection('isi')}
      >
        <div className="space-y-2">
            <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100 italic">
            Tips: Halaman akan bertambah otomatis jika teks terlalu panjang.
            </p>
            <textarea
            value={data.isi}
            onChange={(e) => handleChange('isi', e.target.value)}
            rows={10}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm leading-relaxed outline-none"
            placeholder="Tuliskan isi pernyataan Anda di sini..."
            />
        </div>
      </Accordion>

      {/* 5. LEGALITAS */}
      <Accordion
        title="Legalitas"
        subTitle="Tanda Tangan & Stempel"
        icon={<Stamp size={20} />}
        isOpen={activeSection === 'legalitas'}
        onToggle={() => toggleSection('legalitas')}
      >
        <div className="grid grid-cols-1 gap-6">
            <TTDUpload 
            value={data.signatureUrl}
            onChange={(val) => handleChange('signatureUrl', val || '')}
            />
            <StampUpload 
            value={data.stampUrl}
            onChange={(val) => handleChange('stampUrl', val || '')}
            />
        </div>
      </Accordion>

    </div>
  );
};

export default FormInput;
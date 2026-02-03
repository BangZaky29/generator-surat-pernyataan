import React, { useMemo, useState } from 'react';
import { LetterData } from '../types';
import { paginateText } from '../utils/paginateContent';
import DownloadPDFButton from './DownloadPDFButton';
import { downloadPDF } from '../utils/downloadPDF';
import { Download, Loader2, Check } from 'lucide-react';

interface Props {
  data: LetterData;
  onSave: () => void;
}

const formatDateIndo = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const StatementPreview: React.FC<Props> = ({ data, onSave }) => {
  // Membagi isi menjadi halaman-halaman
  const pages = useMemo(() => paginateText(data.isi), [data.isi]);
  const formattedDate = formatDateIndo(data.tanggalSurat);

  // Mobile Download State
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleMobileDownload = async () => {
    if (downloadStatus !== 'idle') return;

    const element = document.getElementById('pdf-content');
    if (!element) return;

    setDownloadStatus('loading');

    // Memberikan sedikit delay agar animasi loading terlihat oleh user
    await new Promise(resolve => setTimeout(resolve, 500));

    // 1. Matikan scaling mobile sementara agar PDF digenerate dengan ukuran A4 asli
    const wasZoomed = element.classList.contains('mobile-preview-zoom');
    if (wasZoomed) {
      element.classList.remove('mobile-preview-zoom');
    }

    try {
      await downloadPDF('pdf-content', `Surat_Pernyataan_${data.nama.replace(/\s+/g, '_')}`);
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    } catch (error) {
      console.error("Download failed", error);
      setDownloadStatus('idle');
      // alert replaced by notification system in App.tsx, but here we can just log
    } finally {
      // 2. Kembalikan scaling mobile
      if (wasZoomed) {
        element.classList.add('mobile-preview-zoom');
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Toolbar */}
      <div className="w-full max-w-[210mm] flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm sticky top-[70px] z-20">
        <span className="text-sm font-medium text-gray-600 pl-2">
          Preview Dokumen | Ukuran A4
        </span>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs md:text-sm font-bold rounded-xl transition-all active:scale-95"
            title="Simpan Data"
          >
            <Download size={16} className="rotate-180" />
            <span className="hidden sm:inline">Simpan</span>
          </button>
          {/* Hide default button on mobile */}
          <div className="hidden md:block">
            <DownloadPDFButton targetId="pdf-content" fileName={`Surat_Pernyataan_${data.nama.replace(/\s+/g, '_')}`} />
          </div>
        </div>
      </div>

      {/* Container for PDF Generation */}
      <div id="pdf-content" className="flex flex-col gap-8 w-full items-center pb-20 mobile-preview-zoom origin-top transition-transform duration-0">
        {pages.map((pageContent, index) => {
          const isFirstPage = index === 0;
          const isLastPage = index === pages.length - 1;

          return (
            <div
              key={index}
              className="a4-paper bg-white relative text-gray-900 font-serif leading-relaxed"
              style={{ fontFamily: '"Times New Roman", Times, serif' }} // Enforce font for PDF consistency
            >
              {/* === HEADER / KOP SURAT (Only on Page 1) === */}
              {isFirstPage && data.kopSurat.enabled && (
                <div className="border-b-4 border-double border-gray-800 pb-4 mb-8 flex gap-4 items-center">
                  {data.kopSurat.logoUrl && (
                    <img src={data.kopSurat.logoUrl} alt="Logo" className="h-24 w-24 object-contain" />
                  )}
                  <div className="flex-1 text-center">
                    <h2 className="text-xl font-bold uppercase tracking-wide">{data.kopSurat.namaInstansi}</h2>
                    <p className="text-sm mt-1">{data.kopSurat.alamat}</p>
                    <p className="text-sm">{data.kopSurat.kontak}</p>
                  </div>
                </div>
              )}

              {/* === JUDUL SURAT (Only on Page 1) === */}
              {isFirstPage && (
                <div className="text-center mb-8 mt-4">
                  <h1 className="text-lg font-bold uppercase underline decoration-2 underline-offset-4">
                    {data.judulSurat || 'SURAT PERNYATAAN'}
                  </h1>
                  {data.nomorSurat && (
                    <p className="text-sm mt-1 font-semibold">Nomor: {data.nomorSurat}</p>
                  )}
                </div>
              )}

              {/* === IDENTITAS (Only on Page 1) === */}
              {isFirstPage && (
                <div className="mb-6">
                  <p className="mb-4">Yang bertanda tangan di bawah ini:</p>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-40 py-1 align-top">Nama</td>
                        <td className="w-4 py-1 align-top">:</td>
                        <td className="py-1 align-top font-semibold">{data.nama}</td>
                      </tr>
                      <tr>
                        <td className="py-1 align-top">NIK</td>
                        <td className="py-1 align-top">:</td>
                        <td className="py-1 align-top">{data.nik}</td>
                      </tr>
                      <tr>
                        <td className="py-1 align-top">Pekerjaan/Jabatan</td>
                        <td className="py-1 align-top">:</td>
                        <td className="py-1 align-top">{data.pekerjaan}</td>
                      </tr>
                      <tr>
                        <td className="py-1 align-top">Alamat</td>
                        <td className="py-1 align-top">:</td>
                        <td className="py-1 align-top">{data.alamat}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="mt-6 mb-2">
                    Dengan ini menyatakan dengan sesungguhnya, bahwa saya:
                  </p>
                </div>
              )}

              {/* === CONTENT OF THE PAGE === */}
              <div className="whitespace-pre-wrap text-justify min-h-[100px]">
                {pageContent}
              </div>

              {/* === SIGNATURE SECTION (Only on Last Page) === */}
              {isLastPage && (
                <div className="mt-12 flex flex-col items-end mr-8">
                  <div className="text-center w-72 relative"> {/* Increased width slightly for better spacing */}
                    <p className="mb-2">
                      {data.tempatSurat || '.......'}, {formattedDate}
                    </p>
                    <p className="font-semibold mb-4">Yang membuat pernyataan,</p>

                    {/* Area TTD & Stempel */}
                    <div className="relative h-32 w-full flex items-center justify-center my-2">
                      {/* Stempel Layer (Behind) - Positioned Right & Larger */}
                      {data.stampUrl && (
                        <img
                          src={data.stampUrl}
                          alt="Stempel"
                          className="absolute h-32 w-32 object-contain opacity-70 -rotate-12 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0"
                        />
                      )}

                      {/* Signature Layer (Front) */}
                      {data.signatureUrl ? (
                        <img
                          src={data.signatureUrl}
                          alt="Tanda Tangan"
                          className="h-full w-full object-contain relative z-10"
                        />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>

                    <p className="font-bold border-b border-black inline-block min-w-[200px] mt-2 relative z-20">
                      {data.nama || '(Nama Lengkap)'}
                    </p>
                  </div>
                </div>
              )}

              {/* Page Number (Visible on Print/PDF) */}
              <div className="absolute bottom-5 right-10 text-xs text-gray-400 no-print">
                Halaman {index + 1} dari {pages.length}
              </div>

              {/* Divider Indicator for UI Only */}
              {!isLastPage && (
                <div className="absolute -bottom-10 left-0 w-full flex justify-center items-center text-xs text-gray-400 pointer-events-none select-none no-print">
                  <span className="bg-gray-100 px-2 border rounded-full shadow-sm">
                    — PEMISAH HALAMAN —
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* === MOBILE FLOATING DOWNLOAD BUTTON === */}
      <button
        onClick={handleMobileDownload}
        disabled={downloadStatus === 'loading'}
        className={`
            md:hidden fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center text-white
            ${downloadStatus === 'success' ? 'bg-green-600' : 'bg-blue-600'}
            ${downloadStatus === 'loading' ? 'cursor-wait opacity-80' : 'hover:bg-blue-700'}
         `}
        aria-label="Download PDF"
      >
        {downloadStatus === 'loading' ? (
          <Loader2 className="animate-spin" size={24} />
        ) : downloadStatus === 'success' ? (
          <Check className="animate-in zoom-in" size={24} />
        ) : (
          <Download size={24} />
        )}
      </button>
    </div>
  );
};

export default StatementPreview;
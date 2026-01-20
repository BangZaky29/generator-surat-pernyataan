import React, { useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import { downloadPDF } from '../utils/downloadPDF';

interface Props {
  targetId: string;
  fileName: string;
}

const DownloadPDFButton: React.FC<Props> = ({ targetId, fileName }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleDownload = async () => {
    if (status !== 'idle') return;

    setStatus('loading');
    
    // Memberikan sedikit delay agar animasi loading terlihat oleh user
    // dan UI thread tidak langsung freeze oleh html2pdf
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      await downloadPDF(targetId, fileName);
      setStatus('success');
      
      // Reset kembali ke idle setelah 3 detik
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error("Download failed", error);
      setStatus('idle');
      alert("Gagal mengunduh PDF. Silakan coba lagi.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={status === 'loading'}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-all duration-300
        ${status === 'success' 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
        }
        ${status === 'loading' ? 'opacity-80 cursor-wait' : ''}
      `}
    >
      {status === 'loading' ? (
        <>
            <Loader2 size={16} className="animate-spin" />
            <span>Memproses...</span>
        </>
      ) : status === 'success' ? (
        <>
            <Check size={16} className="animate-in zoom-in duration-300" />
            <span>Berhasil!</span>
        </>
      ) : (
        <>
            <Download size={16} />
            <span>Download PDF</span>
        </>
      )}
    </button>
  );
};

export default DownloadPDFButton;
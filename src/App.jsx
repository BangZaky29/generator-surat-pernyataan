import React, { useState, useRef } from 'react';
import { FileText, Trash2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

// Komponen Header
const Header = () => (
  <header className="header">
    <div className="header-container">
      <div className="header-content">
        <FileText size={32} />
        <h1 className="header-title">Generator Surat Pernyataan</h1>
      </div>
      <p className="header-subtitle">Nuansa Lega - Buat Surat Pernyataan Formal dengan Mudah</p>
    </div>
  </header>
);

// Komponen Footer
const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <p className="footer-text">© 2025 Generator Surat Pernyataan - Nuansa Lega</p>
      <p className="footer-subtext">Dokumen resmi untuk keperluan administrasi</p>
    </div>
  </footer>
);

// Komponen Form Input
const FormInput = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Data Pribadi</h2>
      
      <div className="form-fields">
        <div className="form-field">
          <label className="form-label">Nama Lengkap</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="form-input"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Tempat Lahir</label>
          <input
            type="text"
            name="tempatLahir"
            value={formData.tempatLahir}
            onChange={handleChange}
            className="form-input"
            placeholder="Masukkan tempat lahir"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Tanggal Lahir</label>
          <input
            type="date"
            name="tanggalLahir"
            value={formData.tanggalLahir}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Agama</label>
          <select
            name="agama"
            value={formData.agama}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Pilih Agama</option>
            <option value="Islam">Islam</option>
            <option value="Kristen">Kristen</option>
            <option value="Katolik">Katolik</option>
            <option value="Hindu">Hindu</option>
            <option value="Buddha">Buddha</option>
            <option value="Konghucu">Konghucu</option>
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">Alamat Lengkap</label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            rows="3"
            className="form-input form-textarea"
            placeholder="Masukkan alamat lengkap"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Tanggal Pembuatan Surat</label>
          <input
            type="date"
            name="tanggalSurat"
            value={formData.tanggalSurat}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};

// Komponen Statement List
const StatementList = () => {
  const statements = [
    "Tidak pernah dipidana dengan pidana penjara berdasarkan keputusan pengadilan yang telah memperoleh kekuatan hukum yang tetap karena melakukan tindak pidana kejahatan;",
    "Tidak pernah diberhentikan dengan hormat tidak atas permintaan sendiri atau tidak dengan hormat sebagai Calon PNS atau PNS, prajurit Tentara Nasional Indonesia, anggota Kepolisian Negara Republik Indonesia, atau diberhentikan tidak dengan hormat sebagai pegawai swasta (termasuk pegawai Badan Usaha Milik Negara atau Badan Usaha Milik Daerah);",
    "Tidak berkedudukan sebagai Calon PNS, PNS, prajurit Tentara Nasional Indonesia, atau anggota Kepolisian Negara Republik Indonesia;",
    "Tidak menjadi anggota atau pengurus partai politik atau terlibat politik praktis;",
    "Bersedia ditempatkan di seluruh Wilayah Negara Kesatuan Republik Indonesia atau negara lain yang ditentukan oleh instansi pemerintah."
  ];

  return (
    <div className="statement-container">
      <h2 className="statement-title">Isi Pernyataan</h2>
      <div className="statement-list">
        {statements.map((statement, index) => (
          <div key={index} className="statement-item">
            <span className="statement-number">{index + 1}.</span>
            <p className="statement-text">{statement}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Komponen Action Buttons
const ActionButtons = ({ onGenerate, onClear, onDownload, isGenerated, isDownloading }) => (
  <div className="action-buttons">
    <button onClick={onGenerate} className="btn btn-generate">
      <FileText size={20} />
      Buat Surat
    </button>
    
    <button onClick={onClear} className="btn btn-clear">
      <Trash2 size={20} />
      Hapus
    </button>
    
    {isGenerated && (
      <button 
        onClick={onDownload} 
        className="btn btn-download"
        disabled={isDownloading}
      >
        <Download size={20} />
        {isDownloading ? 'Membuat PDF...' : 'Download PDF'}
      </button>
    )}
  </div>
);

// Komponen Preview Surat
const PreviewSurat = React.forwardRef(({ formData, isVisible }, ref) => {
  if (!isVisible) {
    return (
      <div className="preview-empty">
        <p className="preview-empty-text">
          Preview surat akan muncul di sini setelah Anda mengisi form dan menekan tombol "Buat Surat"
        </p>
      </div>
    );
  }

  const statements = [
    "Tidak pernah dipidana dengan pidana penjara berdasarkan keputusan pengadilan yang telah memperoleh kekuatan hukum yang tetap karena melakukan tindak pidana kejahatan;",
    "Tidak pernah diberhentikan dengan hormat tidak atas permintaan sendiri atau tidak dengan hormat sebagai Calon PNS atau PNS, prajurit Tentara Nasional Indonesia, anggota Kepolisian Negara Republik Indonesia, atau diberhentikan tidak dengan hormat sebagai pegawai swasta (termasuk pegawai Badan Usaha Milik Negara atau Badan Usaha Milik Daerah);",
    "Tidak berkedudukan sebagai Calon PNS, PNS, prajurit Tentara Nasional Indonesia, atau anggota Kepolisian Negara Republik Indonesia;",
    "Tidak menjadi anggota atau pengurus partai politik atau terlibat politik praktis;",
    "Bersedia ditempatkan di seluruh Wilayah Negara Kesatuan Republik Indonesia atau negara lain yang ditentukan oleh instansi pemerintah."
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '........................';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <div ref={ref} className="preview-container">
      <div className="preview-content">
        <h1 className="preview-title">SURAT PERNYATAAN</h1>
        
        <div className="preview-body">
          <p className="preview-intro">Yang bertanda tangan dibawah ini :</p>
          
          <div className="preview-data">
            <div className="preview-data-row">
              <span className="preview-data-label">Nama</span>
              <span className="preview-data-colon">:</span>
              <span className="preview-data-value">{formData.nama || '........................'}</span>
            </div>
            <div className="preview-data-row">
              <span className="preview-data-label">Tempat dan tanggal lahir</span>
              <span className="preview-data-colon">:</span>
              <span className="preview-data-value">
                {formData.tempatLahir || '........................'}, {formatDate(formData.tanggalLahir)}
              </span>
            </div>
            <div className="preview-data-row">
              <span className="preview-data-label">Agama</span>
              <span className="preview-data-colon">:</span>
              <span className="preview-data-value">{formData.agama || '........................'}</span>
            </div>
            <div className="preview-data-row">
              <span className="preview-data-label">Alamat</span>
              <span className="preview-data-colon">:</span>
              <span className="preview-data-value">{formData.alamat || '........................'}</span>
            </div>
          </div>

          <p className="preview-statement-intro">dengan ini menyatakan dengan sesungguhnya, bahwa saya :</p>
          
          <div className="preview-statements">
            {statements.map((statement, index) => (
              <div key={index} className="preview-statement-item">
                <span className="preview-statement-number">{index + 1}.</span>
                <p className="preview-statement-text">{statement}</p>
              </div>
            ))}
          </div>

          <p className="preview-closing">
            Demikian pernyataan ini saya buat dengan sesungguhnya, dan saya bersedia dituntut di pengadilan serta bersedia menerima segala tindakan yang diambil oleh Instansi Pemerintah, apabila dikemudian hari tertulis pernyataan saya ini tidak benar.
          </p>

          <div className="preview-signature">
            <div className="preview-signature-content">
              <p className="preview-signature-date">........................, {formatDate(formData.tanggalSurat)}</p>
              <p className="preview-signature-label">Yang membuat pernyataan,</p>
              <p className="preview-signature-stamp">Materai Rp10.000,- <br />& ditandatangani</p>
              <p className="preview-signature-name">({formData.nama || '........................'})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Komponen Utama
const App = () => {
  const [formData, setFormData] = useState({
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    agama: '',
    alamat: '',
    tanggalSurat: new Date().toISOString().split('T')[0]
  });

  const [isGenerated, setIsGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef(null);

  const handleGenerate = () => {
    if (!formData.nama || !formData.tempatLahir || !formData.tanggalLahir || !formData.agama || !formData.alamat) {
      alert('Mohon lengkapi semua data pribadi terlebih dahulu!');
      return;
    }
    setIsGenerated(true);
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClear = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
      setFormData({
        nama: '',
        tempatLahir: '',
        tanggalLahir: '',
        agama: '',
        alamat: '',
        tanggalSurat: new Date().toISOString().split('T')[0]
      });
      setIsGenerated(false);
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Surat_Pernyataan_${formData.nama.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      
      <div className="main-container">
        <div className="main-grid">
          <div className="left-section">
            <FormInput formData={formData} setFormData={setFormData} />
            <StatementList />
            <ActionButtons 
              onGenerate={handleGenerate}
              onClear={handleClear}
              onDownload={handleDownload}
              isGenerated={isGenerated}
              isDownloading={isDownloading}
            />
          </div>
          
          <div className="right-section">
            <PreviewSurat 
              ref={previewRef}
              formData={formData} 
              isVisible={isGenerated}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
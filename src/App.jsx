import React, { useState, useRef } from 'react';
import { FileText, Trash2, Download, Plus, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';
import logo from './assets/NS_white_01.png';

// Komponen Header
const Header = () => (
  <header className="header">
    <div className="header-container">
      <div className="header-content">
        <img src={logo} alt="Logo Nuansa Lega" className="header-logo" />
        <div className="header-text-wrapper">
          <h1 className="header-title">Generator Surat Pernyataan</h1>
          <p className="header-subtitle">Nuansa Lega - Buat Surat Pernyataan Formal dengan Mudah</p>
        </div>
      </div>
    </div>
  </header>
);

// Komponen Footer
const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <p className="footer-text">© 2022 Generator Surat Pernyataan - Nuansa Solution</p>
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

// Komponen Statement Input - BARU
const StatementInput = ({ statements, setStatements }) => {
  const handleAddStatement = () => {
    setStatements([...statements, '']);
  };

  const handleRemoveStatement = (index) => {
    const newStatements = statements.filter((_, i) => i !== index);
    setStatements(newStatements);
  };

  const handleChangeStatement = (index, value) => {
    const newStatements = [...statements];
    newStatements[index] = value;
    setStatements(newStatements);
  };

  return (
    <div className="statement-input-container">
      <div className="statement-input-header">
        <h2 className="statement-input-title">Isi Pernyataan</h2>
        <button
          onClick={handleAddStatement}
          className="btn-add-statement"
        >
          <Plus size={18} />
          Tambah Pernyataan
        </button>
      </div>

      {statements.length === 0 ? (
        <div className="statement-empty">
          <p className="statement-empty-text">
            Belum ada pernyataan. Klik "Tambah Pernyataan" untuk menambahkan point pernyataan.
          </p>
        </div>
      ) : (
        <div className="statement-input-list">
          {statements.map((statement, index) => (
            <div key={index} className="statement-input-item">
              <div className="statement-input-item-header">
                <label className="statement-input-item-label">
                  Pernyataan {index + 1}
                </label>
                <button
                  onClick={() => handleRemoveStatement(index)}
                  className="btn-remove-statement"
                >
                  <X size={14} />
                  Hapus
                </button>
              </div>
              <textarea
                value={statement}
                onChange={(e) => handleChangeStatement(index, e.target.value)}
                className="statement-input-textarea"
                placeholder={`Masukkan isi pernyataan ke-${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
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
const PreviewSurat = React.forwardRef(({ formData, statements, isVisible }, ref) => {
  if (!isVisible) {
    return (
      <div className="preview-empty">
        <p className="preview-empty-text">
          Preview surat akan muncul di sini setelah Anda mengisi form dan menekan tombol "Buat Surat"
        </p>
      </div>
    );
  }

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
            {statements.length > 0 ? (
              statements.map((statement, index) => (
                <div key={index} className="preview-statement-item">
                  <span className="preview-statement-number">{index + 1}.</span>
                  <p className="preview-statement-text">{statement || '........................'}</p>
                </div>
              ))
            ) : (
              <p className="preview-no-statement">Tidak ada pernyataan</p>
            )}
          </div>

          <p className="preview-closing">
            Demikian pernyataan ini saya buat dengan sesungguhnya, dan saya bersedia dituntut di pengadilan serta bersedia menerima segala tindakan yang diambil oleh Instansi Pemerintah, apabila dikemudian hari tertulis pernyataan saya ini tidak benar.
          </p>

          <div className="preview-signature">
            <div className="preview-signature-content">
              <p className="preview-signature-date">........................, {formatDate(formData.tanggalSurat)}</p>
              <p className="preview-signature-label">Yang membuat pernyataan,</p>
              <p className="preview-signature-stamp">Materai Rp 6000,<br />- & ditandatangani</p>
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

  const [statements, setStatements] = useState([
    "Tidak pernah dipidana dengan pidana penjara berdasarkan keputusan pengadilan yang telah memperoleh kekuatan hukum yang tetap karena melakukan tindak pidana kejahatan;",]);

  const [isGenerated, setIsGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef(null);

  const handleGenerate = () => {
    if (!formData.nama || !formData.tempatLahir || !formData.tanggalLahir || !formData.agama || !formData.alamat) {
      alert('Mohon lengkapi semua data pribadi terlebih dahulu!');
      return;
    }
    if (statements.length === 0 || statements.every(s => !s.trim())) {
      alert('Mohon isi minimal satu pernyataan!');
      return;
    }
    setIsGenerated(true);
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClear = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua data?')) {
      setFormData({
        nama: '',
        tempatLahir: '',
        tanggalLahir: '',
        agama: '',
        alamat: '',
        tanggalSurat: new Date().toISOString().split('T')[0]
      });
      setStatements([]);
      setIsGenerated(false);
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const element = previewRef.current;
      
      // Simpan style original
      const originalStyles = {
        width: element.style.width,
        maxWidth: element.style.maxWidth,
        padding: element.style.padding,
        position: element.style.position,
        left: element.style.left,
        transform: element.style.transform
      };
      
      // Set ukuran fixed untuk A4 (210mm = 794px at 96dpi)
      element.style.width = '794px';
      element.style.maxWidth = '794px';
      element.style.padding = '60px 40px';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.transform = 'scale(1)';
      
      // Tunggu render selesai
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: element.scrollHeight,
        windowWidth: 794,
        windowHeight: element.scrollHeight
      });
      
      // Kembalikan style original
      Object.keys(originalStyles).forEach(key => {
        element.style[key] = originalStyles[key];
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Tambahkan halaman pertama
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pdfHeight;
      
      // Tambahkan halaman berikutnya jika diperlukan
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pdfHeight;
      }
      
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
            <StatementInput statements={statements} setStatements={setStatements} />
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
              statements={statements}
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
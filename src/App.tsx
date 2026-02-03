
import React, { useState } from 'react';
import Header from './components/Header';
import FormInput from './components/FormInput';
import StatementPreview from './components/StatementPreview';
import MobileActionButton from './components/MobileActionButton';
import { LetterData, MobileViewMode } from './types';
import { getHistory, saveHistory, deleteHistory, HistoryItem } from './utils/localStorage';
import Notification, { NotificationType } from './components/Notification';
import Modal, { ModalType } from './components/Modal';

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [mobileView, setMobileView] = useState<MobileViewMode>('preview');
  const [notifications, setNotifications] = useState<{ id: number; message: string; type: NotificationType }[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>(getHistory());

  // Modal States
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
    showInput: boolean;
    onConfirm: (val?: string) => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    showInput: false,
    onConfirm: () => { },
  });

  const [letterData, setLetterData] = useState<LetterData>({
    nama: '',
    nik: '',
    pekerjaan: '',
    alamat: '',
    judulSurat: 'SURAT PERNYATAAN',
    nomorSurat: '',
    tempatSurat: '',
    tanggalSurat: new Date().toISOString().split('T')[0],
    isi: 'Saya yang bertanda tangan dibawah ini menyatakan bahwa...',
    signatureUrl: null,
    stampUrl: null,
    kopSurat: {
      enabled: false,
      namaInstansi: '',
      alamat: '',
      kontak: '',
      logoUrl: null
    }
  });

  // --- HANDLERS ---
  const toggleMobileView = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll reset
    setMobileView((prev) => (prev === 'form' ? 'preview' : 'form'));
  };

  const addNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const closeModals = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const openSaveModal = () => {
    setModalConfig({
      isOpen: true,
      type: 'info',
      title: 'Simpan Riwayat',
      message: 'Masukkan nama label untuk data ini agar mudah ditemukan nanti.',
      showInput: true,
      onConfirm: (label) => {
        const success = saveHistory(letterData, label);
        if (success) {
          setHistory(getHistory());
          addNotification('Data berhasil disimpan ke riwayat', 'success');
        } else {
          addNotification('Gagal menyimpan data', 'error');
        }
        closeModals();
      }
    });
  };

  const openImportModal = (data: LetterData) => {
    setModalConfig({
      isOpen: true,
      type: 'import',
      title: 'Import Data',
      message: 'Apakah Anda yakin ingin mengimport data ini? Data yang sedang diisi saat ini akan tertimpa.',
      showInput: false,
      onConfirm: () => {
        setLetterData(data);
        addNotification('Data berhasil diimport', 'import');
        closeModals();
      }
    });
  };

  const openDeleteModal = (id: number) => {
    setModalConfig({
      isOpen: true,
      type: 'danger',
      title: 'Hapus Riwayat',
      message: 'Data ini akan dihapus secara permanen dari browser Anda. Tindakan ini tidak dapat dibatalkan.',
      showInput: false,
      onConfirm: () => {
        const success = deleteHistory(id);
        if (success) {
          setHistory(getHistory());
          addNotification('Data riwayat berhasil dihapus', 'delete');
        } else {
          addNotification('Gagal menghapus data riwayat', 'error');
        }
        closeModals();
      }
    });
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-16 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-[1600px] mx-auto flex gap-8">

        {/* === LEFT COLUMN: FORM === */}
        {/* Responsive logic: Hidden on mobile if view is 'preview' */}
        <section
          className={`
            w-full md:w-1/2 lg:w-5/12 xl:w-1/3 
            flex-col gap-6 
            ${mobileView === 'preview' ? 'hidden md:flex' : 'flex'}
            px-3 py-4 md:p-6
          `}
        >
          <div className="md:sticky md:top-24 h-auto md:h-[calc(100vh-8rem)] md:overflow-y-auto scrollbar-hide pb-20 md:pb-0">
            <div className="mb-4 md:hidden text-center bg-white border border-blue-100 text-blue-700 p-3 rounded-lg shadow-sm text-sm font-semibold flex items-center justify-center gap-2">
              <span>✏️ Mode Edit Data</span>
            </div>
            <FormInput
              data={letterData}
              onChange={setLetterData}
              history={history}
              onImport={openImportModal}
              onDeleteHistory={openDeleteModal}
            />
          </div>
        </section>

        {/* === RIGHT COLUMN: PREVIEW === */}
        {/* Responsive logic: Hidden on mobile if view is 'form' */}
        <section
          className={`
            w-full md:w-1/2 lg:w-7/12 xl:w-2/3
            flex-col items-center
            ${mobileView === 'form' ? 'hidden md:flex' : 'flex'}
            bg-gray-100 md:bg-transparent
            px-0 py-4 md:p-6
          `}
        >
          {/* Mobile Indicator */}
          <div className="w-full px-4 mb-4 md:hidden sticky top-[64px] z-20">
            <div className="text-center bg-white border border-green-100 text-green-700 p-3 rounded-lg shadow-md text-sm font-semibold flex items-center justify-center gap-2 backdrop-blur-sm bg-opacity-90">
              <span>📄 Preview Dokumen</span>
            </div>
          </div>

          {/* The actual preview component */}
          <div className="w-full flex justify-center px-2 md:px-0 mb-24 md:mb-0">
            <StatementPreview
              data={letterData}
              onSave={openSaveModal}
            />
          </div>
        </section>

      </main>

      {/* Floating Action Button for Mobile */}
      <MobileActionButton
        currentView={mobileView}
        onToggle={toggleMobileView}
      />

      {/* Notifications */}
      {notifications.map(n => (
        <Notification
          key={n.id}
          message={n.message}
          type={n.type}
          onClose={() => removeNotification(n.id)}
        />
      ))}

      {/* Global Modals */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModals}
        onConfirm={modalConfig.onConfirm}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        showInput={modalConfig.showInput}
      />

    </div>
  );
};

export default App;
export interface KopSuratData {
  enabled: boolean;
  namaInstansi: string;
  alamat: string;
  kontak: string;
  logoUrl: string | null;
}

export interface LetterData {
  // Identitas
  nama: string;
  nik: string;
  pekerjaan: string;
  alamat: string;
  
  // Info Surat
  judulSurat: string;
  nomorSurat: string;
  tempatSurat: string;
  tanggalSurat: string;
  
  // Isi
  isi: string;
  
  // Legalitas
  signatureUrl: string | null;
  stampUrl: string | null;
  kopSurat: KopSuratData;
}

export type MobileViewMode = 'form' | 'preview';
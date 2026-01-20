/**
 * Fungsi sederhana untuk membagi teks menjadi beberapa halaman
 * berdasarkan estimasi karakter per halaman A4.
 * 
 * NOTE: Ini adalah pendekatan heuristik. Untuk presisi pixel-perfect
 * biasanya memerlukan pengukuran DOM real-time yang kompleks.
 */

const CHARS_PER_PAGE_FIRST = 1500; // Halaman pertama (ada header/identitas)
const CHARS_PER_PAGE_NEXT = 2800;  // Halaman berikutnya (full teks)

export const paginateText = (text: string): string[] => {
  const paragraphs = text.split('\n');
  const pages: string[] = [];
  
  let currentPageContent = "";
  let currentLength = 0;
  // Halaman pertama kapasitasnya lebih sedikit karena ada Header & Identitas
  let limit = CHARS_PER_PAGE_FIRST; 

  paragraphs.forEach((paragraph, index) => {
    // Tambahkan newline jika bukan paragraf pertama
    const paraText = (index > 0 ? '\n' : '') + paragraph;
    
    // Jika menambah paragraf ini melebihi limit, buat halaman baru
    if (currentLength + paraText.length > limit) {
      // Push halaman yang sudah penuh
      pages.push(currentPageContent);
      
      // Reset untuk halaman baru
      currentPageContent = paragraph; // Mulai halaman baru dengan paragraf ini
      currentLength = paragraph.length;
      limit = CHARS_PER_PAGE_NEXT; // Halaman berikutnya kapasitas penuh
    } else {
      currentPageContent += paraText;
      currentLength += paraText.length;
    }
  });

  // Push sisa konten
  if (currentPageContent) {
    pages.push(currentPageContent);
  }

  // Jika kosong sama sekali, kembalikan array kosong agar tidak crash
  if (pages.length === 0) return [""];

  return pages;
};
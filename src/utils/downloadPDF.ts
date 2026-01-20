// @ts-ignore
import html2pdf from 'html2pdf.js';

export const downloadPDF = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return Promise.reject("Element not found");

  const opt = {
    margin: 0, // Margin ditangani oleh CSS .a4-paper padding
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      scrollY: 0 // Prevents offset issues
    },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
  };

  // Return the promise chain
  return html2pdf().set(opt).from(element).save();
};
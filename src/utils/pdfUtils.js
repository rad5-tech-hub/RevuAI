export const generatePDF = (content, filename) => {
  // Placeholder for LaTeX-based PDF generation
  // In production, use a library like pdfkit or a backend endpoint
  console.log("Generating PDF with content:", content);
  const blob = new Blob([content], { type: "application/x-tex" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

// import { generatePDF } from "./../../../utils";
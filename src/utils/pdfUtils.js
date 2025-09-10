import { jsPDF } from "jspdf";

export const generatePDF = (feedback, filename) => {
  if (!feedback) {
    throw new Error("No feedback data provided");
  }

  const doc = new jsPDF();
  const margin = 10;
  let y = 20;

  // Title
  doc.setFontSize(16);
  doc.text(`Feedback Details (ID: ${feedback.id || "Unknown"})`, margin, y);
  y += 10;

  // Feedback Details
  doc.setFontSize(12);
  doc.text(`Rating: ${feedback.rating || "N/A"} Stars`, margin, y);
  y += 10;
  doc.text(`Rating Label: ${feedback.ratingLabel || "N/A"}`, margin, y);
  y += 10;
  doc.text(`Comment: ${feedback.comment || "No comment"}`, margin, y, { maxWidth: 180 });
  y += doc.getTextDimensions(feedback.comment || "No comment", { maxWidth: 180 }).h + 10;
  doc.text(`Reviewer: ${feedback.isAnonymous ? "Anonymous" : feedback.reviewer || "Unknown"}`, margin, y);
  y += 10;
  doc.text(`Date: ${feedback.createdAt || "N/A"}`, margin, y);
  y += 10;
  doc.text(`QR Code: ${feedback.qrcodeTitle || "N/A"}`, margin, y);
  y += 10;
  doc.text(`Tags: ${Array.isArray(feedback.qrcodeTags) ? feedback.qrcodeTags.join(", ") : "None"}`, margin, y);

  // Save the PDF
  doc.save(filename);
};
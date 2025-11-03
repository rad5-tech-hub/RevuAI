// utils/qrHelpers.js
import domtoimage from "dom-to-image";

/**
 * Download full A5 design as PNG
 */
export const downloadFullDesign = async (element, businessName) => {
  if (!element) return;
  try {
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1,
      bgcolor: "#fff",
      width: element.offsetWidth * 2,
      height: element.offsetHeight * 2,
      style: { transform: "scale(2)", transformOrigin: "top left" },
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${businessName.replace(/\s+/g, "_")}_QR_Design.png`;
    link.click();
  } catch (err) {
    console.error("downloadFullDesign error:", err);
  }
};

/**
 * Print full A5 design
 */
export const printFullDesign = async (element) => {
  if (!element) return;
  try {
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1,
      bgcolor: "#fff",
      width: element.offsetWidth * 2,
      height: element.offsetHeight * 2,
      style: { transform: "scale(2)", transformOrigin: "top left" },
    });

    const printWindow = window.open("");
    printWindow.document.write(`
      <html><body style="margin:0;">
        <img src="${dataUrl}" style="width:100%;height:auto;" onload="window.print();window.close()" />
      </body></html>
    `);
    printWindow.document.close();
  } catch (err) {
    console.error("printFullDesign error:", err);
  }
};
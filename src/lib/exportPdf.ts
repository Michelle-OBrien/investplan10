import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

/**
 * Capture a DOM element and export it as a multi-page A4 PDF.
 */
export async function exportToPdf(
  elementId: string,
  filename = "InvestPlan10-report.pdf"
): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Temporarily make the element full-width for capture
  const originalMaxW = el.style.maxWidth;
  el.style.maxWidth = "900px";

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#0a0a0a",
    logging: false,
    windowWidth: 900,
  });

  el.style.maxWidth = originalMaxW;

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");
  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Additional pages if content overflows
  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}

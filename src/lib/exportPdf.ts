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
  if (!el) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Clone the element to avoid layout shifts during capture.
  const clone = el.cloneNode(true) as HTMLElement;
  const computedStyle = window.getComputedStyle(el);
  clone.style.width = `${el.scrollWidth}px`;
  clone.style.maxWidth = "none";
  clone.style.boxSizing = "border-box";
  clone.style.backgroundColor = computedStyle.backgroundColor || "#ffffff";

  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.top = "-9999px";
  wrapper.style.left = "-9999px";
  wrapper.style.opacity = "0";
  wrapper.style.pointerEvents = "none";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(clone, {
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      backgroundColor: computedStyle.backgroundColor || "#ffffff",
      logging: false,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
      allowTaint: true,
      imageTimeout: 15000,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error("PDF export failed", error);
    throw error;
  } finally {
    document.body.removeChild(wrapper);
  }
}

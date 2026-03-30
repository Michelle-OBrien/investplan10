import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

async function svgElementToPngDataURL(svg: SVGSVGElement): Promise<string> {
  const svgClone = svg.cloneNode(true) as SVGSVGElement;
  const xml = new XMLSerializer().serializeToString(svgClone);
  const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not get canvas context for SVG conversion"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err instanceof Error ? err : new Error("SVG to PNG conversion failed"));
    };
    img.src = url;
  });
}

async function replaceSvgWithImage(clone: HTMLElement): Promise<void> {
  const svgElements = Array.from(clone.querySelectorAll<SVGSVGElement>("svg"));
  await Promise.all(
    svgElements.map(async (svg) => {
      const dataUrl = await svgElementToPngDataURL(svg);
      const img = document.createElement("img");
      img.src = dataUrl;
      img.width = svg.clientWidth || 300;
      img.height = svg.clientHeight || 150;
      img.style.display = "block";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      svg.replaceWith(img);
    })
  );
}

/**
 * Capture a DOM element and export it as a multi-page A4 PDF.
 */
export async function exportToPdf(
  elementId: string,
  filename = `InvestmentPlan_${new Date().toISOString().slice(0, 10)}.pdf`
): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Clone the element to avoid layout shifts during capture.
  const clone = el.cloneNode(true) as HTMLElement;
  clone.id = `${elementId}-pdf-copy`;
  clone.style.width = `${el.scrollWidth}px`;
  clone.style.maxWidth = "none";
  clone.style.boxSizing = "border-box";
  clone.style.backgroundColor = "#ffffff";
  clone.style.color = "#000000";
  clone.style.filter = "none";
  clone.style.transition = "none";

  const enforceStyle = document.createElement("style");
  enforceStyle.textContent = `
    #pdf-export-sandbox, #pdf-export-sandbox * {
      background-color: #ffffff !important;
      color: #000000 !important;
      border-color: #cccccc !important;
      box-shadow: none !important;
      filter: none !important;
      text-shadow: none !important;
    }
  `;

  // Normalize subelements so dark mode doesn't invert colors in rendered PDF.
  clone.querySelectorAll<HTMLElement>("*").forEach((child) => {
    child.style.backgroundColor = "#ffffff";
    child.style.color = "#000000";
    child.style.borderColor = "#cccccc";
    child.style.boxShadow = "none";
    child.style.filter = "none";
    child.style.textShadow = "none";
  });

  await replaceSvgWithImage(clone);

  const wrapper = document.createElement("div");
  wrapper.id = "pdf-export-sandbox";
  wrapper.style.position = "fixed";
  wrapper.style.top = "-9999px";
  wrapper.style.left = "-9999px";
  wrapper.style.opacity = "0";
  wrapper.style.pointerEvents = "none";
  wrapper.appendChild(enforceStyle);
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(wrapper, {
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: wrapper.scrollWidth,
      windowHeight: wrapper.scrollHeight,
      allowTaint: true,
      imageTimeout: 15000,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const printWidth = pageWidth - margin * 2;
    const printHeight = pageHeight - margin * 2;

    const imgWidth = printWidth;
    const pageHeightOnImage = (printHeight * (canvas.width / imgWidth));
    const pageCount = Math.ceil(canvas.height / pageHeightOnImage);

    for (let page = 0; page < pageCount; page += 1) {
      if (page > 0) {
        pdf.addPage();
      }

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(canvas.height - page * pageHeightOnImage, pageHeightOnImage);
      const ctx = pageCanvas.getContext("2d");
      if (!ctx) throw new Error("Impossible d'obtenir le contexte du canvas pour page");

      ctx.drawImage(
        canvas,
        0,
        page * pageHeightOnImage,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      );

      const pageData = pageCanvas.toDataURL("image/jpeg", 0.9);
      const pageHeightMm = (pageCanvas.height * imgWidth) / canvas.width;

      pdf.addImage(pageData, "JPEG", margin, margin, imgWidth, pageHeightMm);
    }

    pdf.save(filename);
  } catch (error) {
    console.error("PDF export failed", error);
    throw error;
  } finally {
    if (document.body.contains(wrapper)) {
      document.body.removeChild(wrapper);
    }
  }
}

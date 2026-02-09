import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type PdfTable = {
  title?: string;
  head: string[];
  body: (string | number)[][];
};

export type PdfBuildOptions = {
  filename: string;         // "cierre_noche.pdf"
  title: string;            // "BURO - Cierre de noche"
  metaLines?: string[];     // ["Semana: ...", "Total: ..."]
  tables?: PdfTable[];      // una o varias tablas
  footerText?: string;      // opcional
};


@Injectable({
  providedIn: 'root',
})
export class Pdf {

  /** Genera y descarga un PDF */
  downloadPdf(opts: PdfBuildOptions): void {
    const doc = this.buildPdf(opts);
    doc.save(opts.filename);
  }

  /** Genera un Blob para mandar al backend por mail */
  buildPdfBlob(opts: PdfBuildOptions): Blob {
    const doc = this.buildPdf(opts);
    return doc.output('blob');
  }

  // --- Interno ---
  private buildPdf(opts: PdfBuildOptions): jsPDF {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(14);
    doc.text(opts.title, 14, 16);

    // Meta líneas
    doc.setFontSize(10);
    const meta = opts.metaLines ?? [];
    let y = 24;
    for (const line of meta) {
      doc.text(String(line), 14, y);
      y += 6;
    }

    // Tablas
    const tables = opts.tables ?? [];
    for (const t of tables) {
      if (t.title) {
        doc.setFontSize(11);
        doc.text(t.title, 14, y + 4);
        y += 8;
      }

      autoTable(doc, {
        head: [t.head],
        body: t.body,
        startY: y,
        styles: { fontSize: 9 },
        headStyles: { fontStyle: 'bold' },
      });

      y = (doc as any).lastAutoTable?.finalY ?? (y + 10);
      y += 8;
    }

    // Footer (opcional)
    if (opts.footerText) {
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.text(opts.footerText, 14, pageHeight - 10);
    }

    return doc;
  }
  
}

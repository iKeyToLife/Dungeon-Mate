import { PDFDocument } from 'pdf-lib';

export async function generatePDF(data) {
    try {
        const existingPdfBytes = await fetch('/templateCharacterSheets.pdf').then(res => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        // TODO: update template, update fields
        //
        // EXAMPLE firstPage.drawText(`Name: ${data.character.name}`, { x: 50, y: 700, size: 12, color: rgb(0, 0, 0) });
        // const pages = pdfDoc.getPages();
        // const firstPage = pages[0];


        const pdfBytes = await pdfDoc.save();


        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'updated.pdf'; // name file download
        a.click();


        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error update PDF:', error);
    }
}

import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import Papa from 'papaparse';
import mammoth from 'mammoth';

// Serve the worker locally from the public directory
/* pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`; */
// Serve the worker locally from the public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';  // The worker file should now be located in 'public/pdf.worker.min.js'


export const processFileContent = async (file) => {
  const fileType = file.type;

  if (fileType === 'application/pdf') {
    const dataBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: dataBuffer }).promise;
    let extractedText = '';

    // Loop through each page of the PDF
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      extractedText += `${pageText}\n`;
    }

    return extractedText;
  } else if (fileType.includes('excel') || fileType.includes('csv')) {
    // Excel or CSV file
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result) => resolve(result.data.map(row => row.join(' ')).join('\n')),
        error: reject,
      });
    });
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
    // Word document handling using mammoth
    const dataBuffer = await file.arrayBuffer();
    const { value: extractedText } = await mammoth.extractRawText({ arrayBuffer: dataBuffer });
    return extractedText;
  } else if (fileType === 'text/plain') {
    // Plain text file
    const text = await file.text();
    return text;
  } else {
    throw new Error('Unsupported file type');
  }
};

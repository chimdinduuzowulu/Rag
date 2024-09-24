import pdfParse from 'pdf-parse';
import Papa from 'papaparse';
import mammoth from 'mammoth';

export const processFileContent = async (file) => {
  const fileType = file.type;

  if (fileType === 'application/pdf') {
    // PDF file
    const dataBuffer = await file.arrayBuffer();
    const parsedPDF = await pdfParse(dataBuffer);
    return parsedPDF.text;
  } else if (fileType.includes('excel') || fileType.includes('csv')) {
    // Excel or CSV file
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result) => resolve(result.data.map(row => row.join(' ')).join('\n')),
        error: reject,
      });
    });
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
    // Word document
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

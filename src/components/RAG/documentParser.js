import pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// Parse PDF files in the browser
export const parsePdf = async (file) => {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      try {
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let text = '';
        for (let i = 0; i < pdf.numPages; i++) {
          const page = await pdf.getPage(i + 1);
          const pageText = await page.getTextContent();
          text += pageText.items.map(item => item.str).join(' ');
        }
        resolve(text);
      } catch (error) {
        reject('Error parsing PDF');
      }
    };
    fileReader.readAsArrayBuffer(file);
  });
};

// Parse DOCX (Word) files in the browser
export const parseDocx = async (file) => {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = async function () {
      try {
        const result = await mammoth.extractRawText({ arrayBuffer: this.result });
        resolve(result.value);
      } catch (error) {
        reject('Error parsing DOCX');
      }
    };
    fileReader.readAsArrayBuffer(file);
  });
};

// Parse XLSX (Excel) files in the browser
export const parseXlsx = (file) => {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = function () {
      try {
        const workbook = XLSX.read(this.result, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_csv(firstSheet);
        resolve(data);
      } catch (error) {
        reject('Error parsing XLSX');
      }
    };
    fileReader.readAsBinaryString(file);
  });
};

// Parse plain text files in the browser
export const parseTextFile = (file) => {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = function () {
      resolve(this.result);
    };
    fileReader.readAsText(file);
  });
};

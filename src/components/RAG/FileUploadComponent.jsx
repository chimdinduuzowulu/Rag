import React, { useState } from 'react';
import { parsePdf, parseDocx, parseXlsx, parseTextFile } from './documentParser';

const FileUploadComponent = ({ setDocumentText }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    
    let parsedText = '';
    const fileType = file.type;

    try {
      if (fileType === 'application/pdf') {
        parsedText = await parsePdf(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        parsedText = await parseDocx(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        parsedText = await parseXlsx(file);
      } else if (fileType === 'text/plain') {
        parsedText = await parseTextFile(file);
      } else {
        setError('Unsupported file type');
        return;
      }

      // Set the parsed text in the parent component
      setDocumentText(parsedText);
      setError(null);
    } catch (err) {
      setError('Error processing the file');
    }
  };

  return (
    <div>
      <h3>Upload a Document (PDF, Word, Excel, Text)</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload and Parse</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUploadComponent;

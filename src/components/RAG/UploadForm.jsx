import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadForm = ({ setDocumentText }) => {
  const [uploadError, setUploadError] = useState(null);

  const handleDrop = async (acceptedFiles) => {
    setUploadError(null);
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target.result;
        setDocumentText(content);  // Send the extracted content to the parent component
      } catch (error) {
        setUploadError("Error reading the file");
      }
    };

    if (file.type === 'application/pdf') {
      // Handle PDF parsing (use pdfjs-dist or similar)
      reader.readAsArrayBuffer(file);  // Parse PDF to text here
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Handle Word document parsing
      reader.readAsBinaryString(file);  // Use mammoth.js for parsing
    } else if (file.type === 'text/plain') {
      reader.readAsText(file);  // For text files
    } else if (file.type === 'text/html') {
      // Handle web page parsing
      reader.readAsText(file);  // Use DOMParser to parse HTML
    } else {
      setUploadError("Unsupported file type");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
  });

  return (
    <div className="upload-container bg-gray-100 p-4 rounded-md">
      <h3 className="text-lg font-bold mb-2">Upload Document (Optional)</h3>
      <div {...getRootProps()} className="border-dashed border-2 p-4 rounded-lg">
        <input {...getInputProps()} />
        <p>Drag & drop your file here, or click to select a file</p>
      </div>
      {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
    </div>
  );
};

export default UploadForm;

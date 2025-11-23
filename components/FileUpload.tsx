import React, { useCallback, useState } from 'react';
import { Upload, FileAudio, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndPassFile = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      setError("Please upload a valid audio file (MP3, WAV, etc.)");
      return;
    }
    // Basic size check - 20MB is a safe inline limit for base64 in many browsers/APIs, 
    // though Gemini supports more via File API, inline is restricted.
    if (file.size > 20 * 1024 * 1024) {
      setError("File size too large. Please use a file under 20MB for this demo.");
      return;
    }
    setError(null);
    onFileSelected(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-blue-50'}
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={!disabled ? handleDrop : undefined}
      >
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {error ? (
               <AlertCircle className="w-10 h-10 mb-3 text-red-500" />
            ) : (
               <Upload className={`w-10 h-10 mb-3 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            )}
            <p className="mb-2 text-sm text-gray-500 font-semibold">
              {error ? <span className="text-red-500">{error}</span> : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500">MP3, WAV, M4A (Max 20MB)</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="audio/*"
            onChange={handleChange}
            disabled={disabled}
          />
        </label>
      </div>
    </div>
  );
};

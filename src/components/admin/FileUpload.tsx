import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface FileUploadProps {
  onFilesAccepted: (files: File[]) => void;
}

export default function FileUpload({ onFilesAccepted }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAccepted(acceptedFiles);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': [],
      'video/mp4': [],
      'audio/mpeg': [],
    },
  } as any);

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-yellow-500 bg-yellow-50' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
        {isDragActive ? (
          <p className="mt-4 text-slate-600">Drop the files here ...</p>
        ) : (
          <p className="mt-4 text-slate-600">Drag & drop files here, or click to select files</p>
        )}
        <p className="text-xs text-slate-500 mt-2">Supported formats: JPG, PNG, PDF, MP4, MP3</p>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold">Accepted files:</h4>
          <ul className="list-disc pl-5 mt-2 text-sm text-slate-700">
            {acceptedFiles.map(file => (
              <li key={file.name} className="flex items-center justify-between">
                <span>{file.name} - {(file.size / 1024).toFixed(2)} KB</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-red-600">Rejected files:</h4>
          <ul className="list-disc pl-5 mt-2 text-sm text-red-500">
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name}>
                {file.name} - {errors.map(e => e.message).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

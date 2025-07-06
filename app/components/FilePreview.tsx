
"use client";
import React from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileAlt,
  FaFile,
} from "react-icons/fa";

type FilePreviewProps = {
  fileName: string;
  fileUrl?: string; // optional when used before upload
};

const getFileIcon = (fileName?: string) => {
  if (!fileName) return <FaFile className="text-gray-600 w-5 h-5" />;

  const lower = fileName.toLowerCase();
  if (lower.match(/\.(jpg|jpeg|png|gif)$/)) return <FaFileImage className="text-blue-500 w-5 h-5" />;
  if (lower.endsWith(".pdf")) return <FaFilePdf className="text-red-500 w-5 h-5" />;
  if (lower.match(/\.(doc|docx)$/)) return <FaFileWord className="text-blue-700 w-5 h-5" />;
  if (lower.endsWith(".txt")) return <FaFileAlt className="text-gray-500 w-5 h-5" />;
  return <FaFile className="text-gray-600 w-5 h-5" />;
};

export default function FilePreview({ fileName, fileUrl }: FilePreviewProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 space-x-2 border border-gray-300">
      {getFileIcon(fileName)}
      <div className="text-sm truncate max-w-[180px]">
        {fileUrl ? (
          <a href={fileUrl} download target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {fileName}
          </a>
        ) : (
          <span>{fileName}</span>
        )}
      </div>
    </div>
  );
}

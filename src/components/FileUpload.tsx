import React, { useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
  error?: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading, error }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto px-4 sm:px-0"
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative group"
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`
            block w-full p-8 sm:p-12 border-2 border-dashed rounded-xl sm:rounded-2xl
            transition-all duration-300 cursor-pointer
            ${isLoading 
              ? 'border-gray-300 bg-gray-50' 
              : 'border-indigo-300 hover:border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100'
            }
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-indigo-500 border-t-transparent"></div>
                <p className="text-sm sm:text-base text-gray-600">Processing document...</p>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500" />
                </motion.div>
                <div className="text-center">
                  <p className="text-base sm:text-lg font-semibold text-gray-700">
                    Drop your study material here
                  </p>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                    or tap to browse
                  </p>
                  <div className="mt-3 sm:mt-4 flex items-center justify-center space-x-3 sm:space-x-4 text-xs text-gray-400">
                    <div className="flex items-center">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span>PDF</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span>DOCX</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </label>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2"
        >
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-red-700">{error}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FileUpload;
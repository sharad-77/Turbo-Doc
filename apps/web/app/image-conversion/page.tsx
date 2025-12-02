'use client';

import { useState, useRef } from 'react';

export default function ImageConversionPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState('png');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Drag and Drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    alert(`Ready to convert ${files.length} images to ${targetFormat}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-slate-800 bg-slate-900/50">
          <h1 className="text-3xl font-bold text-white tracking-tight">Image Conversion</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Upload your images and convert them to your preferred format instantly.
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Drop Zone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                Upload Files
              </label>
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out
                  flex flex-col items-center justify-center py-12 px-4 text-center
                  ${
                    isDragging
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Upload Icon (Inline SVG) */}
                <div
                  className={`mb-4 p-4 rounded-full transition-colors duration-200 ${isDragging ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>

                <h3 className="text-lg font-medium text-slate-200">
                  Drop images here or click to upload
                </h3>
                <p className="text-sm text-slate-500 mt-1">Supports JPG, PNG, WEBP, AVIF</p>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                    Selected Files ({files.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setFiles([])}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800 max-h-64 overflow-y-auto">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {/* File Icon */}
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-slate-200 truncate pr-4">
                            {file.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
                        title="Remove file"
                      >
                        {/* Close Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
              {/* Select Dropdown */}
              <div className="md:col-span-1 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                  Convert To
                </label>
                <div className="relative">
                  <select
                    value={targetFormat}
                    onChange={e => setTargetFormat(e.target.value)}
                    className="w-full appearance-none bg-slate-800 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none p-3 pr-10 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                    <option value="webp">WEBP</option>
                    <option value="avif">AVIF</option>
                  </select>
                  {/* Chevron Icon */}
                  <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={files.length === 0}
                  className={`
                    w-full py-3 px-6 rounded-xl font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition-all duration-200
                    ${
                      files.length > 0
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 active:scale-[0.98]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }
                  `}
                >
                  <span>Start Conversion</span>
                  {files.length > 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

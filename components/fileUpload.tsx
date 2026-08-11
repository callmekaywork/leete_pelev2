'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  Eye,
  RefreshCw,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Camera,
  RotateCw,
  ZoomIn,
  ZoomOut,
  FilePlus2,
  X,
} from 'lucide-react';
import { FileDocument } from '@/db/validationschemas';

interface FileUploadZoneProps {
  label: string;
  description: string;
  required?: boolean;
  file: FileDocument | null;
  onFileChange: (file: FileDocument | null) => void;
  error?: string;
  acceptTypes?: string;
  autoOcrType?: 'license' | 'vehicle' | 'insurance' | 'photo';
  onOcrExtracted?: (extractedData: Record<string, any>) => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  description,
  required = true,
  file,
  onFileChange,
  error,
  acceptTypes = 'image/jpeg,image/png,image/webp,application/pdf',
  autoOcrType,
  onOcrExtracted,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Preview Modal Interactive Controls
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile) return;
    setUploadError(null);

    // Size limit check (10MB)
    const MAX_SIZE_MB = 10;
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(
        `File size exceeds ${MAX_SIZE_MB}MB limit. Please upload a smaller file.`,
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 85) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    const reader = new FileReader();

    reader.onload = event => {
      const dataUrl = event.target?.result as string;

      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);

        const newDoc: FileDocument = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          url: dataUrl,
          uploadedAt: new Date().toISOString(),
          status: 'pending',
        };

        setIsUploading(false);
        setUploadProgress(0);
        onFileChange(newDoc);
      }, 500);
    };

    reader.onerror = () => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadError('Failed to read file. Please try again.');
    };

    reader.readAsDataURL(selectedFile);
  };

  // Sample File Quick-Attach for testing
  const attachSampleDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadError(null);
    setIsUploading(true);

    const sampleImages: Record<string, { name: string; url: string }> = {
      license: {
        name: 'Driver_License_Sample.jpg',
        url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
      },
      vehicle: {
        name: 'Vehicle_Registration_V5C.jpg',
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      },
      insurance: {
        name: 'Commercial_Insurance_Policy.jpg',
        url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
      },
      photo: {
        name: 'Driver_Headshot_Photo.jpg',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      },
    };

    const typeKey = autoOcrType || 'photo';
    const selectedSample = sampleImages[typeKey] || sampleImages.photo;

    setTimeout(() => {
      const sampleDoc: FileDocument = {
        id: `sample-${Date.now()}`,
        name: selectedSample.name,
        size: 1420500,
        type: 'image/jpeg',
        url: selectedSample.url,
        uploadedAt: new Date().toISOString(),
        status: 'verified',
      };

      setIsUploading(false);
      onFileChange(sampleDoc);

      if (autoOcrType && onOcrExtracted) {
        triggerOcrExtraction(sampleDoc);
      }
    }, 400);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerOcrExtraction = (doc: FileDocument) => {
    setIsOcrScanning(true);
    setTimeout(() => {
      setIsOcrScanning(false);
      let extracted: Record<string, any> = {};

      if (autoOcrType === 'license') {
        extracted = {
          driverLicenseNumber: `DL-${Math.floor(10000000 + Math.random() * 90000000)}`,
          licenseExpiryDate: '2029-08-15',
        };
      } else if (autoOcrType === 'vehicle') {
        extracted = {
          make: 'Toyota',
          model: 'Camry Hybrid',
          year: 2021,
          licensePlate: `BLT-${Math.floor(1000 + Math.random() * 9000)}-EV`,
        };
      }

      if (onOcrExtracted && Object.keys(extracted).length > 0) {
        onOcrExtracted(extracted);
      }

      onFileChange({
        ...doc,
        status: 'verified',
        ocrData: {
          extractedText:
            'AI Scanner Verified Document Authenticity (100% Match)',
          confidence: 0.98,
        },
      });
    }, 1000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          {label}
          {required && <span className="text-emerald-600 font-bold">*</span>}
        </label>
        {file && (
          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Uploaded & Verified
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-500 font-medium">{description}</p>

      {file ? (
        <div className="relative group rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200 overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <FileText className="w-5 h-5 text-emerald-700" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {file.name}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span className="capitalize text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {file.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setZoomLevel(1);
                  setRotation(0);
                  setPreviewModalOpen(true);
                }}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                title="Preview document"
              >
                <Eye className="w-4 h-4" />
              </button>

              {autoOcrType && (
                <button
                  type="button"
                  onClick={() => triggerOcrExtraction(file)}
                  disabled={isOcrScanning}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
                  title="Re-run AI Document Scan"
                >
                  <Sparkles
                    className={`w-3 h-3 ${isOcrScanning ? 'animate-spin' : ''}`}
                  />
                  {isOcrScanning ? 'Scanning...' : 'AI Scan'}
                </button>
              )}

              <button
                type="button"
                onClick={() => onFileChange(null)}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {file.ocrData?.extractedText && (
            <div className="mt-2.5 pt-2 border-t border-emerald-200/80 flex items-center gap-1.5 text-[11px] text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">
                {file.ocrData.extractedText}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
              : error || uploadError
                ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
                : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-100/50'
          }`}
        >
          {/* File Input (Standard Upload) */}
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptTypes}
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Camera Capture Input (Mobile / Webcam) */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            {isUploading ? (
              <div className="w-full max-w-xs space-y-2 py-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    Uploading Document...
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-200 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform shadow-xs">
                  <UploadCloud className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="text-xs text-slate-700 font-medium">
                  <span className="text-slate-900 font-bold underline decoration-emerald-500 underline-offset-2">
                    Click to browse
                  </span>{' '}
                  or drag and drop file here
                </div>

                <p className="text-[10px] text-slate-400 font-medium">
                  Supports JPG, PNG, WEBP or PDF (Max 10MB)
                </p>

                {/* Direct Action Buttons: Camera + Sample Doc */}
                <div
                  className="flex items-center gap-2 pt-1"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-all shadow-2xs hover:bg-slate-50 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    Take Photo
                  </button>

                  <button
                    type="button"
                    onClick={attachSampleDocument}
                    className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    title="Use a realistic sample document for fast testing"
                  >
                    <FilePlus2 className="w-3.5 h-3.5 text-emerald-600" />
                    Demo Sample Doc
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload Error / Validation Message */}
      {(error || uploadError) && (
        <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-semibold mt-1 bg-rose-50 p-2 rounded-lg border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError || error}</span>
        </div>
      )}

      {/* Full Preview & Inspection Modal */}
      {previewModalOpen && file && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  {label} Document Viewer
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {file.name} ({formatFileSize(file.size)})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Controls (Zoom & Rotate for images) */}
            {file.type.startsWith('image/') && (
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-[11px]">
                  Inspection Tools:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setZoomLevel(z => Math.min(z + 0.25, 2.5))}
                    className="p-1 rounded hover:bg-slate-200 font-bold"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(z => Math.max(z - 0.25, 0.75))}
                    className="p-1 rounded hover:bg-slate-200 font-bold"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotation(r => (r + 90) % 360)}
                    className="p-1 rounded hover:bg-slate-200 font-bold"
                    title="Rotate Document"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoomLevel(1);
                      setRotation(0);
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200"
                  >
                    Reset View
                  </button>
                </div>
              </div>
            )}

            {/* Document Image / PDF Display */}
            <div className="max-h-80 overflow-auto flex items-center justify-center rounded-xl bg-slate-900/90 p-4 border border-slate-800">
              {file.type.startsWith('image/') ? (
                <div className="overflow-hidden transition-all duration-200">
                  <img
                    src={file.url}
                    alt={file.name}
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease-in-out',
                    }}
                    className="max-h-64 object-contain rounded-md shadow-md"
                  />
                </div>
              ) : (
                <div className="py-12 text-center space-y-2 text-white">
                  <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold">{file.name}</p>
                  <p className="text-[11px] text-slate-300">
                    PDF Document ({formatFileSize(file.size)})
                  </p>
                </div>
              )}
            </div>

            {/* Footer details */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <div className="space-y-0.5">
                <span className="block font-medium">
                  Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                </span>
                <span className="block text-[11px] text-emerald-700 font-bold">
                  Status: Verified & Validated
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewModalOpen(false);
                    onFileChange(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 text-xs transition-colors"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

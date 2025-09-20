"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { useMedical } from "@/contexts/MedicalContext";
import { Label } from "@/components/ui/label";
import { MEDICAL_CONSTANTS } from "@/lib/constants";
import { validateMedicalImage, formatFileSize } from "@/lib/medicalUtils";

export default function UploadImage() {
  const { uploadedImage, setUploadedImage, symptoms, setSymptoms, clearImageAndResults } = useMedical();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    setError("");

    const validation = validateMedicalImage(file);
    if (!validation.isValid) {
      setError(validation.error);
      toast.error(validation.error);
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadedImage({ file, previewUrl, name: file.name });
    toast.success("Image uploaded successfully!");
  };

  const removeImage = () => {
    if (uploadedImage?.previewUrl) {
      URL.revokeObjectURL(uploadedImage.previewUrl);
    }
    // Clear both image and analysis results
    clearImageAndResults();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Image removed successfully!");
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Upload Medical Image
      </h2>
      
      {!uploadedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload medical image"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Select medical image file"
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-500">
            X-ray, MRI, CT scan images (JPEG, PNG up to 5MB)
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Uploaded Image</h3>
              <button
                onClick={removeImage}
                className="text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Remove uploaded image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <img
                src={uploadedImage.previewUrl}
                alt="Medical scan preview"
                className="w-20 h-20 object-cover rounded border"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {uploadedImage.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(uploadedImage.file.size)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {error}
        </div>
      )}

      <div className="mt-6">
        <Label htmlFor="symptoms" className="text-sm font-medium text-gray-900">
          Additional Symptoms (Optional)
        </Label>
        <div className="mt-2 relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe any symptoms, pain, or medical history that might help with diagnosis..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {symptoms.length}/500
          </div>
        </div>
      </div>
    </div>
  );
}
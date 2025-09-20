"use client";

import { CheckCircle, AlertTriangle, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getConfidenceLevel, getConfidenceColor } from "@/lib/medicalUtils";
import InfoTooltip from "@/components/InfoTooltip";

export default function ResultCard({ result }) {
  if (!result) return null;

  const confidenceLevel = getConfidenceLevel(result.confidence);

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.8) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (confidence >= 0.6) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const getSeverityBadge = (confidence) => {
    const level = getConfidenceLevel(confidence);
    const variants = {
      high: "default",
      medium: "secondary", 
      low: "destructive"
    };
    
    const labels = {
      high: "High Confidence",
      medium: "Moderate Confidence",
      low: "Low Confidence"
    };

    return (
      <Badge variant={variants[level]}>
        {labels[level]}
      </Badge>
    );
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Analysis Results
        </h2>
        {getSeverityBadge(result.confidence)}
      </div>

      <div className="space-y-6">
        {/* Diagnosis */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Diagnosis</h3>
          <div className="flex items-start space-x-3">
            {getConfidenceIcon(result.confidence)}
            <div className="flex-1">
              <p className="text-lg font-medium text-gray-900">{result.diagnosis}</p>
              <p className="text-sm text-gray-600 mt-1">
                Based on medical image analysis using AI
              </p>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-sm font-medium text-gray-700">Confidence Score</h3>
            <InfoTooltip content="AI confidence level based on pattern recognition and medical image analysis algorithms. Higher confidence indicates stronger pattern matches in the training data." />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                {Math.round(result.confidence * 100)}%
              </span>
              <span className="text-xs text-gray-500">
                Based on pattern recognition
              </span>
            </div>
            <Progress 
              value={result.confidence * 100} 
              className="h-2"
            />
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              {result.recommendation}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        {result.additionalInfo && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {result.additionalInfo}
              </p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="border-t pt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only 
              and should not replace professional medical diagnosis. Please consult with a qualified 
              healthcare provider for proper medical evaluation and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
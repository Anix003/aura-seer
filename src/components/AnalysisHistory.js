"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Activity, FileText, Clock, User } from "lucide-react";

export default function AnalysisHistory({ history = [] }) {
  const [expandedItem, setExpandedItem] = useState(null);

  const handleItemClick = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
    toast.success("Analysis details loaded");
  };

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Analysis History
        </h3>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No previous analyses found</p>
          <p className="text-sm text-gray-500 mt-1">
            Your analysis history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-600" />
        Analysis History
      </h3>
      
      <Accordion type="single" collapsible className="w-full">
        {history.map((item, index) => (
          <AccordionItem key={item.id || index} value={`item-${index}`}>
            <AccordionTrigger 
              className="hover:no-underline"
              onClick={() => handleItemClick(item.id || index)}
            >
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center space-x-3">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {item.diagnosis || "Medical Analysis"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.date || new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      item.confidence >= 0.8 ? "default" : 
                      item.confidence >= 0.6 ? "secondary" : "destructive"
                    }
                  >
                    {Math.round((item.confidence || 0) * 100)}% confidence
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <Separator />
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                  <p className="text-sm text-gray-700">{item.diagnosis}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                  <p className="text-sm text-gray-700">{item.recommendation}</p>
                </div>
                
                {item.additionalInfo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                    <p className="text-sm text-gray-700">{item.additionalInfo}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Analyzed by AI System
                  </span>
                  <span>{item.date || new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
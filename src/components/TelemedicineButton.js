"use client";

import { useState } from "react";
import { Video, MessageCircle, Phone, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TelemedicineButton() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleVideoCall = () => {
    setIsVideoOpen(true);
    // In a real implementation, this would integrate with a video calling service
    // like Twilio, Agora, or WebRTC
  };

  const handleChat = () => {
    setIsChatOpen(true);
    // In a real implementation, this would open a chat interface
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Consult with Healthcare Professionals
      </h2>

      <p className="text-gray-600 mb-6">
        Connect with certified medical professionals for personalized
        consultation and treatment recommendations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video Call Button */}
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogTrigger asChild>
            <button
              onClick={handleVideoCall}
              className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Video className="h-5 w-5 mr-2" />
              Video Consultation
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-[600px]">
            <DialogHeader>
              <DialogTitle>Video Consultation</DialogTitle>
            </DialogHeader>
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Video consultation interface would be integrated here
                </p>
                <p className="text-sm text-gray-500">
                  Integration with Twilio, Agora, or similar video calling
                  service
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Chat Button */}
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogTrigger asChild>
            <button
              onClick={handleChat}
              className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Text Chat
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl h-[500px]">
            <DialogHeader>
              <DialogTitle>Text Chat with Medical Professional</DialogTitle>
            </DialogHeader>
            <div className="flex-1 flex flex-col">
              <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm">
                      Hello! I{"'"}m Dr. Smith. How can I help you today?
                    </p>
                    <span className="text-xs text-gray-500">2 min ago</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 max-w-xs ml-auto">
                    <p className="text-sm">
                      I have some questions about my medical scan results.
                    </p>
                    <span className="text-xs text-gray-500">1 min ago</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Send
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Contact Options */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Quick Contact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="tel:102">
            <button className="flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              Emergency: 102
            </button>
          </a>
          <button className="flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Phone className="h-4 w-4 mr-2" />
            Nurse Hotline
          </button>
          <button className="flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <MessageCircle className="h-4 w-4 mr-2" />
            Schedule Appointment
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Available 24/7:</strong> Our telemedicine platform connects
          you with licensed healthcare professionals. Response times may vary
          based on urgency and availability.
        </p>
      </div>
    </div>
  );
}

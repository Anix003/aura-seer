import { Loader2 } from "lucide-react";

export default function Loading({ message = "Analyzing image..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}
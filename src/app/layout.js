import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/contexts/QueryProvider";
import { MedicalProvider } from "@/contexts/MedicalContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aura Seer",
  description: "AURA Seer - AI-Powered Disease Detection and Analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <MedicalProvider>
            {children}
            <Toaster />
          </MedicalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

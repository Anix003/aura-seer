import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/contexts/QueryProvider";
import { MedicalProvider } from "@/contexts/MedicalContext";
import { AuthProvider } from "@/contexts/AuthContext";
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
          <AuthProvider>
            <MedicalProvider>
              {children}
              <Toaster />
            </MedicalProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

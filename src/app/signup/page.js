"use client";

import Link from "next/link";
import { Brain, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Aura Seer</h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Coming Soon</h2>
            <p className="text-muted-foreground">
              Sign up functionality will be available soon!
            </p>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link href="/login">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Button>
          </Link>
        </div>

        {/* Additional info */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
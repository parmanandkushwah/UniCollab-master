'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    
    // Simulate email resend
    setTimeout(() => {
      toast.success('Verification email sent!');
      setIsResending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <GraduationCap className="h-12 w-12 text-blue-600" />
          <span className="ml-3 text-2xl font-bold text-gray-900">UniCollab</span>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription>
              We've sent a verification link to your university email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Click the link in your email to verify your account and start collaborating 
                with your university community.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Email verification required
                    </p>
                    <p className="text-xs text-blue-700">
                      This ensures you're connected with verified students from your university
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleResendEmail}
                variant="outline" 
                className="w-full"
                disabled={isResending}
              >
                {isResending ? 'Sending...' : 'Resend verification email'}
              </Button>
              
              <Link href="/dashboard">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>
                Wrong email address?{' '}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-500">
                  Go back
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function TestEmailPage() {
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to send test email');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          Email System Test
        </h1>
        <p className="text-center text-sm text-gray-600">
          Test your email configuration before going live
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Test Email Configuration</CardTitle>
            <CardDescription>
              Enter an email address to test your SMTP setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTestEmail} className="space-y-4">
              <div>
                <Label htmlFor="test-email">Test Email Address</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Email...
                  </>
                ) : (
                  'Send Test Email'
                )}
              </Button>
            </form>

            {/* Results */}
            {result && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Test Successful!</span>
                </div>
                <p className="text-green-800 mb-3">{result.message}</p>
                
                <div className="bg-white p-3 rounded border">
                  <h4 className="font-medium text-green-900 mb-2">Configuration Details:</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Host:</span> {result.details.smtpHost}</div>
                    <div><span className="font-medium">Port:</span> {result.details.smtpPort}</div>
                    <div><span className="font-medium">User:</span> {result.details.smtpUser}</div>
                    <div><span className="font-medium">From:</span> {result.details.smtpFrom}</div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-900">Test Failed</span>
                </div>
                <p className="text-red-800">{error}</p>
                <div className="mt-3 text-sm text-red-700">
                  <p>Common issues:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Check your SMTP credentials in .env.local</li>
                    <li>Verify 2FA is enabled and app password is correct</li>
                    <li>Ensure your email provider allows SMTP access</li>
                    <li>Check firewall/network restrictions</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Configuration Help */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>Gmail Setup:</strong></p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Enable 2-Factor Authentication</li>
                  <li>Generate App Password (not regular password)</li>
                  <li>Use smtp.gmail.com:587</li>
                </ol>
                <p className="mt-2"><strong>Other Providers:</strong> Check their SMTP documentation for credentials.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
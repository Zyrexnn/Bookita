"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";

export default function TestFirebasePage() {
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const testFirebaseConfig = () => {
    const results = {
      // Environment Variables
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
      
      // Firebase Auth Status
      authInitialized: !!auth,
      authConfig: auth?.config,
      currentUser: auth?.currentUser,
      
      // Validation Checks
      validations: {
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        apiKeyLength: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.length,
        authDomainFormat: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.includes('.firebaseapp.com'),
      }
    };
    setTestResults(results);
  };

  const testMagicLinkSend = async () => {
    setIsLoading(true);
    try {
      const testEmail = "test@example.com";
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/verify-login`,
        handleCodeInApp: true,
      };

      console.log('=== Testing Magic Link Send ===');
      console.log('Email:', testEmail);
      console.log('Action code settings:', actionCodeSettings);
      console.log('Current URL:', window.location.href);
      console.log('Environment URL:', process.env.NEXT_PUBLIC_VERCEL_URL);

      // This will likely fail but we want to see the error
      await sendSignInLinkToEmail(auth, testEmail, actionCodeSettings);
      
      setTestResults(prev => ({
        ...prev,
        magicLinkTest: 'SUCCESS - Magic link sent!',
      }));
    } catch (error) {
      console.error('=== Magic Link Test Error ===');
      console.error('Error object:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      
      setTestResults(prev => ({
        ...prev,
        magicLinkTest: {
          error: error.message,
          code: error.code,
          stack: error.stack,
          fullError: JSON.stringify(error, null, 2),
          customMessage: getErrorMessage(error.code),
        },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    const errorMessages = {
      'auth/invalid-api-key': 'API Key tidak valid. Periksa kembali API Key di Firebase Console.',
      'auth/api-key-not-valid': 'API Key tidak valid atau sudah kadaluarsa.',
      'auth/network-request-failed': 'Masalah jaringan. Periksa koneksi internet Anda.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/operation-not-allowed': 'Operasi tidak diizinkan. Periksa pengaturan Firebase Authentication.',
      'auth/user-disabled': 'Pengguna dinonaktifkan.',
      'auth/too-many-requests': 'Terlalu banyak permintaan. Coba lagi nanti.',
    };
    return errorMessages[errorCode] || 'Error tidak diketahui.';
  };

  useEffect(() => {
    testFirebaseConfig();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Firebase Magic Link Debugging</h1>
          <p className="text-gray-600">Halaman ini untuk membantu mendiagnosis masalah Firebase Magic Link authentication</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables & Config</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Configuration Status:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>API Key:</span>
                      <span className={testResults.validations?.hasApiKey ? 'text-green-600' : 'text-red-600'}>
                        {testResults.validations?.hasApiKey ? '✓ Loaded' : '✗ Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auth Domain:</span>
                      <span className={testResults.validations?.hasAuthDomain ? 'text-green-600' : 'text-red-600'}>
                        {testResults.validations?.hasAuthDomain ? '✓ Loaded' : '✗ Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Project ID:</span>
                      <span className={testResults.validations?.hasProjectId ? 'text-green-600' : 'text-red-600'}>
                        {testResults.validations?.hasProjectId ? '✓ Loaded' : '✗ Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Firebase Auth:</span>
                      <span className={testResults.authInitialized ? 'text-green-600' : 'text-red-600'}>
                        {testResults.authInitialized ? '✓ Initialized' : '✗ Not Initialized'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Full Configuration:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
                    {JSON.stringify(testResults, null, 2)}
                  </pre>
                </div>
                
                <Button onClick={testFirebaseConfig} variant="outline" className="w-full">
                  Refresh Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Magic Link Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Test Results:</h3>
                  <div className="bg-gray-100 p-4 rounded text-sm">
                    {testResults.magicLinkTest ? (
                      <pre className="overflow-auto max-h-60">
                        {typeof testResults.magicLinkTest === 'string' 
                          ? testResults.magicLinkTest 
                          : JSON.stringify(testResults.magicLinkTest, null, 2)
                        }
                      </pre>
                    ) : (
                      <p className="text-gray-500">No test results yet. Click "Test Magic Link" to run the test.</p>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={testMagicLinkSend} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Testing...' : 'Test Magic Link Send'}
                </Button>
                
                <div className="text-xs text-gray-500">
                  <p>💡 Note: This test will attempt to send a magic link to test@example.com</p>
                  <p>📋 Check the browser console for detailed logs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Troubleshooting Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">1. Check Firebase Console Settings:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Go to Firebase Console → Authentication → Sign-in method</li>
                  <li>Enable "Email/Password" sign-in method</li>
                  <li>Enable "Email link (passwordless sign-in)" option</li>
                  <li>Make sure authorized domains include "localhost" and your production domain</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">2. Check Environment Variables:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Verify all NEXT_PUBLIC_FIREBASE_* variables are set correctly</li>
                  <li>API Key should start with "AIzaSy"</li>
                  <li>Auth Domain should end with ".firebaseapp.com"</li>
                  <li>Restart the development server after changing .env.local</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">3. Common Issues:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>auth/invalid-api-key</strong>: API Key is incorrect or malformed</li>
                  <li><strong>auth/operation-not-allowed</strong>: Email link sign-in not enabled in Firebase Console</li>
                  <li><strong>auth/network-request-failed</strong>: Network connectivity issues</li>
                  <li><strong>auth/unauthorized-domain</strong>: Domain not authorized in Firebase Console</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
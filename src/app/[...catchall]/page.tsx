"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CatchAllProps {
  params: {
    catchall: string[];
  };
}

export default function CatchAllPage({ params }: CatchAllProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if this is a subdomain request
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      if (hostname.includes('.nubarber.com') && !hostname.startsWith('www.')) {
        const subdomain = hostname.split('.')[0];
        
        // Skip reserved subdomains
        if (!['www', 'api', 'admin', 'app', 'dashboard', 'auth', 'login', 'signup'].includes(subdomain)) {
          // Redirect to the public page
          router.replace(`/public/${subdomain}`);
          return;
        }
      }
    }
    
    // If not a subdomain request, redirect to home
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <p className="text-gray-600">Redirecting you to the right place...</p>
      </div>
    </div>
  );
}

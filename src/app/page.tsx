'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import LandingPage from '@/components/landing-page';
import CreatorStudio from '@/components/creator-studio';
import Logo from '@/components/icons/logo';

function LoadingScreen() {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-background">
            <div className="relative flex items-center justify-center h-24 w-24">
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-50"></div>
                <div className="relative bg-background rounded-full p-2">
                    <Logo className="h-16 w-16" />
                </div>
            </div>
            <h1 className="text-xl font-headline text-primary mt-6">Loading EventFlow...</h1>
        </div>
    );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }
  
  if (user) {
    return <CreatorStudio />;
  }

  return <LandingPage />;
}

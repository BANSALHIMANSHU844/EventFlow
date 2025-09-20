'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import CreatorStudio from '@/components/creator-studio';
import LandingPage from '@/components/landing-page';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    // You can return a loading spinner here if you want
    return null;
  }

  if (user) {
    return <CreatorStudio />;
  }
  
  return <LandingPage />;
}

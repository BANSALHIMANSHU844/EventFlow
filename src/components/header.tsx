'use client';

import Link from 'next/link';
import * as React from 'react';
import Logo from '@/components/icons/logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold font-headline sm:inline-block">
              EventFlow
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

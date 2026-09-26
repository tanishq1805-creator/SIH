import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import CopilotWidget from '../components/CopilotWidget';
import React, { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CoalSentinel AI | National Coal Mine Safety & DGMS Compliance Intelligence',
  description: 'Smart India Hackathon (SIH 2026) Final Round Coal Mine Compliance & Contradiction Detection Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950`}>
        <Suspense fallback={<div className="h-16 bg-[#0b1120] border-b border-slate-800" />}>
          <Navbar />
        </Suspense>
        
        <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        <Suspense fallback={null}>
          <CopilotWidget />
        </Suspense>
      </body>
    </html>
  );
}

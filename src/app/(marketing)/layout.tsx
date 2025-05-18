'use client';

import React from 'react';
import Header from '@/components/layout/Header/Header'; // 임시 헤더
import Footer from '@/components/layout/Footer/Footer'; // 임시 푸터

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
} 
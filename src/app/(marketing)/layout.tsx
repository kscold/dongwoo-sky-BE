'use client';

import React from 'react';
import Header from '@/components/layout/Header/Header'; 
import Footer from '@/components/layout/Footer/Footer'; 

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
} 
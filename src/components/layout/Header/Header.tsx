'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as styles from './Header.css';

const navItems = [
  { href: '/service-guide', label: '서비스 안내' },
  { href: '/pricing', label: '이용 요금' },
  { href: '/contact', label: '견적 문의' },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <Link href="/" className={styles.logoLink}>
          <span className={styles.logoText}>DONGWOO SKY</span>
        </Link>
      </div>
      <nav className={styles.navContainer}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.ctaButtonContainer}>
        <button className={styles.ctaButton}>
          빠른상담: 010-1234-5678
        </button>
      </div>
    </header>
  );
};

export default Header; 
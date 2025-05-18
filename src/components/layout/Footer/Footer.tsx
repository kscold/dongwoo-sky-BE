import React from 'react';
import * as styles from './Footer.css';
import { vars } from '@/styles/theme.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <p className={styles.copyrightText}>
          &copy; {currentYear} SKY WORK. All rights reserved.
        </p>
        <div className={styles.footerLinks}>
          <a href="/privacy" className={styles.footerLink}>
            개인정보처리방침
          </a>
          <a href="/terms" className={styles.footerLink}>
            이용약관
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
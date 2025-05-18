'use client';

import React from 'react';
import {
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/solid';

import * as styles from '../../../styles/contact.css';

export default function ContactPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('동우스카이로 문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다!');
    // 여기에 실제 폼 제출 로직 추가 (예: API 호출)
  };

  const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_YOUR_CHANNEL_ID';

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          동우스카이 견적 및 작업 문의
        </h1>
        <p className={styles.heroSubtitle}>
          신속하고 정확한 서비스, 지금 바로 문의하세요!
        </p>
        <a 
          href="tel:1666-2400" 
          className={styles.phoneLinkButton}
        >
          전화 문의: 010-1234-5678
        </a>
        <a 
          href={KAKAO_CHANNEL_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.kakaoButton} 
        >
          <ChatBubbleLeftEllipsisIcon className={styles.kakaoIconStyle} />
          카카오톡 문의하기
        </a>
      </div>

      {/* Form Section */}
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>
            온라인 문의
          </h2>
          <p className={styles.formDescription}>
            아래 양식을 작성해주시면 신속하게 확인 후 연락드리겠습니다.
            <br />
            급한 용무는 언제든지{' '}
            <a href="tel:1666-2400" className={styles.formDescriptionLink}>
              010-1234-5678
            </a>
            {' '}
            으로 전화 주시면 친절히 상담해 드립니다.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formField}>
              <label htmlFor="name" className={styles.formLabel}>성함/회사명</label>
              <input type="text" name="name" id="name" required className={styles.formInput} placeholder="예: 홍길동 또는 동우스카이" />
            </div>
            <div className={styles.formField}>
              <label htmlFor="phone" className={styles.formLabel}>연락처</label>
              <input type="tel" name="phone" id="phone" required className={styles.formInput} placeholder="예: 010-0000-0000" />
            </div>
            <div className={styles.formField}>
              <label htmlFor="location" className={styles.formLabel}>작업 현장 주소</label>
              <input type="text" name="location" id="location" className={styles.formInput} placeholder="예: 서울시 강남구 테헤란로 123" />
            </div>
            <div className={styles.formField}>
              <label htmlFor="details" className={styles.formLabel}>문의 내용</label>
              <textarea name="details" id="details" rows={5} required className={styles.formTextarea} placeholder="예: 이삿짐 운반, 5층, 2월 30일 오전 10시"></textarea>
            </div>
            <div className={styles.submitButtonContainer}>
              <button 
                type="submit" 
                className={styles.submitButton}
              >
                문의 접수하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
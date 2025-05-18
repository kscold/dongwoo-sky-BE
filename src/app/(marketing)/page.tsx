'use client';

import React, { useState, useEffect } from 'react';
// import Image from 'next/image'; // HeroSection에서만 사용, 여기서는 제거 가능
import Link from 'next/link';
import * as heroStyles from '@/components/sections/landing/HeroSection/HeroSection.css';
import * as noticeStyles from '@/components/sections/landing/NoticeSection/NoticeSection.css'; // 공지 스타일 임포트

const placeholderImages = [
  'https://images.unsplash.com/photo-1506784983877-45594efa4c88?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?q=80&w=2117&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % placeholderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={heroStyles.heroSection}>
      <div 
        className={heroStyles.heroBackgroundImage}
        style={{ backgroundImage: `url('${placeholderImages[currentImageIndex]}')` }}
      />
      <div className={heroStyles.heroOverlay} />
      <div className={heroStyles.heroContent}>
        <h1 className={heroStyles.heroTitle}>
          하늘 위 모든 솔루션, <span className={heroStyles.heroTitleHighlight}>동우스카이</span>가 함께합니다.
        </h1>
        <p className={heroStyles.heroSubtitle}>
          최신 스카이 장비로 어떤 높이의 작업이든 신속하고 안전하게! 지금 바로 전문가와 상담하세요.
        </p>
        <div className={heroStyles.heroButtonContainer}>
          <Link href="/contact" className={heroStyles.primaryButton}>
            무료 견적 받기
          </Link>
          <Link href="/service-guide" className={heroStyles.secondaryButton}>
            서비스 더보기
          </Link>
        </div>
      </div>
    </section>
  );
};

// 공지사항 목업 데이터
const mockNotices = [
  {
    id: '1',
    title: '동우스카이, 2024년 여름맞이 안전 점검 강화 안내',
    date: '2024년 5월 15일',
    excerpt: '고객님의 안전을 최우선으로 생각하는 동우스카이입니다. 여름철 장비 특별 안전 점검을 실시하여 더욱 안전한 서비스를 제공하겠습니다. 많은 관심 부탁드립니다.',
  },
  {
    id: '2',
    title: '신규 75m 스카이차 도입! 더 높은 곳도 문제없이!',
    date: '2024년 4월 28일',
    excerpt: '최신형 75m 스카이차가 새롭게 현장에 투입됩니다. 이전보다 더 높은 곳의 작업도 신속하고 안전하게 수행 가능해졌습니다. 자세한 사항은 문의해주세요.',
  },
  {
    id: '3',
    title: '홈페이지 리뉴얼 기념, 첫 이용 고객 할인 이벤트 안내',
    date: '2024년 4월 10일',
    excerpt: '동우스카이 홈페이지가 새롭게 단장되었습니다. 이를 기념하여 첫 이용 고객님께 특별 할인 혜택을 제공합니다. 기간 한정으로 진행되오니 많은 참여 바랍니다.',
  },
];

const NoticeSection = () => {
  // 실제로는 API 호출 등을 통해 데이터를 가져옵니다.
  const notices = mockNotices;

  return (
    <section className={noticeStyles.noticeSection}>
      <h2 className={noticeStyles.sectionTitle}>공지사항</h2>
      {notices && notices.length > 0 ? (
        <ul className={noticeStyles.noticeList}>
          {notices.map((notice) => (
            <li key={notice.id} className={noticeStyles.noticeItem}>
              <Link href={`/notice/${notice.id}`} className={noticeStyles.noticeLink}>
                <h3 className={noticeStyles.noticeTitle}>{notice.title}</h3>
                <p className={noticeStyles.noticeDate}>{notice.date}</p>
                <p className={noticeStyles.noticeExcerpt}>{notice.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={noticeStyles.noticeEmptyMessage}>등록된 공지사항이 없습니다.</p>
      )}
    </section>
  );
};

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <NoticeSection /> {/* 기존 컨텐츠 영역을 공지사항 섹션으로 대체 */}
    </>
  );
} 
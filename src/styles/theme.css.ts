import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  colors: {
    primary: '#1A3A6D', // 딥 인디고
    primaryDark: '#122B53', // primary 보다 어둡게
    primaryLight: '#E8EFFC', // primary 보다 매우 밝게 (배경용)
    primaryTransparent: 'rgba(26, 58, 109, 0.2)', // primary의 투명 버전 (포커스 링 등)
    secondary: '#00BFA6', // 새로운 강조색: 틸
    accent: '#E9ECEF', // 밝은 회색
    background: '#FFFFFF',
    backgroundLight: '#F8F9FA', // 매우 밝은 배경색
    text: '#212529',
    textLight: '#495057',
    textStrong: '#1A202C', // 기본 text보다 조금 더 강조
    white: '#FFFFFF',
    black: '#000000',
    error: '#DC3545',
    success: '#28A745',
    border: '#DEE2E6', // 일반적인 테두리 색
    borderLight: '#E9ECEF', // 더 밝은 테두리 색
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
    },
    gradientFrom: '#EFF6FF', // pricing 페이지 배경 그라데이션 시작색 (밝은 하늘색 계열)
    gradientTo: '#DBEAFE',   // pricing 페이지 배경 그라데이션 끝색 (더 밝은 하늘색 계열)
    gradientUtil: 'linear-gradient(to bottom right, #EFF6FF, #DBEAFE)', // 실제 그라데이션 값
    gradientTextFrom: '#2563EB', // 텍스트 그라데이션 시작 (파랑 계열)
    gradientTextTo: '#38BDF8',   // 텍스트 그라데이션 끝 (하늘색 계열)
  },
  fonts: {
    heading: 'Pretendard, Inter, Noto Sans KR, sans-serif',
    body: 'Pretendard, Inter, Noto Sans KR, sans-serif',
  },
  fontSizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    md: '1rem',     // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem',  // 20px
    xxl: '1.5rem',  // 24px
    xxxl: '2rem',   // 32px
    xxxxl: '2.5rem', // 40px
    xxxxxl: '3rem',  // 48px
    xxxxxxl: '3.75rem',// 60px
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    normal: '1.5',
    relaxed: '1.75', // 좀 더 여유있는 줄간격
    heading: '1.2',
  },
  space: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    xxl: '3rem',    // 48px
    xxxl: '4rem',   // 64px
    xxxxl: '5rem',  // 80px
  },
  radii: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem', // 기존 1rem에서 약간 줄임
    xl: '1rem',   // 새로운 xl 값
    xxl: '1.5rem', // 더 큰 둥근 모서리
    round: '50%',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  zIndices: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    skipLink: '1600',
    toast: '1700',
    tooltip: '1800',
  },
}); 
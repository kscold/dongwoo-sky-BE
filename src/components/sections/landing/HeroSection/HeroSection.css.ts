import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const heroSection = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  overflow: 'hidden',
  color: vars.colors.white,
  textAlign: 'center',
});

export const heroBackgroundImage = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  zIndex: -2, // 오버레이보다 뒤에 위치
});

export const heroOverlay = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)', // 오버레이 약간 더 어둡게 조정
  zIndex: -1,
});

export const heroContent = style({
  position: 'relative',
  zIndex: 1,
  padding: vars.space.lg,
  maxWidth: '800px', // 콘텐츠 최대 너비 조정
  margin: '0 auto',
});

export const heroTitle = style({
  fontSize: vars.fontSizes.xxxxl,
  fontWeight: vars.fontWeights.bold,
  marginBottom: vars.space.lg,
  lineHeight: vars.lineHeights.heading,
  color: vars.colors.white,
  textShadow: '2px 2px 8px rgba(0,0,0,0.7)', // 텍스트 쉐도우 강화
  '@media': {
    '(max-width: 768px)': { // vars.breakpoints.md 대신 실제 값 사용 및 올바른 구문 적용
      fontSize: vars.fontSizes.xxxl,
    },
  }
});

export const heroTitleHighlight = style({
  color: vars.colors.secondary, // 새로운 강조색 적용
});

export const heroSubtitle = style({
  fontSize: vars.fontSizes.xl,
  marginBottom: vars.space.xl,
  color: vars.colors.accent, // 밝은 회색 계열 유지
  textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
  '@media': {
    '(max-width: 768px)': { // vars.breakpoints.md 대신 실제 값 사용 및 올바른 구문 적용
      fontSize: vars.fontSizes.lg,
    },
  }
});

export const heroButtonContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  alignItems: 'center',
  '@media': {
    '(min-width: 640px)': { // vars.breakpoints.sm 대신 실제 값 사용 및 올바른 구문 적용
      flexDirection: 'row',
      justifyContent: 'center',
    },
  }
});

const baseButton = style({
  padding: `${vars.space.md} ${vars.space.xl}`,
  fontSize: vars.fontSizes.lg,
  fontWeight: vars.fontWeights.semibold,
  borderRadius: vars.radii.md,
  transition: 'all 0.3s ease-in-out',
  border: '2px solid transparent',
  selectors: {
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
});

export const primaryButton = style([baseButton, {
  backgroundColor: vars.colors.secondary,
  color: vars.colors.white,
  selectors: {
    '&:hover': {
      backgroundColor: vars.colors.primary, // 호버 시 주 색상으로 변경 (예시)
      color: vars.colors.white,
    },
  },
}]);

export const secondaryButton = style([baseButton, {
  backgroundColor: 'transparent',
  color: vars.colors.white, // 초기 글자색 흰색으로 변경
  borderColor: vars.colors.secondary,
  selectors: {
    '&:hover': {
      backgroundColor: vars.colors.secondary,
      color: vars.colors.white, // 호버 시 글자색 흰색 유지
      borderColor: vars.colors.secondary,
    },
  },
}]); 
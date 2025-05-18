import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const sectionContainer = style({
  padding: `${vars.space.xxl} ${vars.space.lg}`,
  backgroundColor: vars.colors.background, // 밝은 배경
});

export const sectionTitle = style({
  textAlign: 'center',
  fontSize: vars.fontSizes.xxxl,
  fontWeight: vars.fontWeights.bold,
  color: vars.colors.primary,
  marginBottom: vars.space.xl,
});

export const processGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: vars.space.xl,
  maxWidth: '1000px',
  margin: '0 auto',
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});

export const processStep = style({
  backgroundColor: vars.colors.white,
  padding: vars.space.lg,
  borderRadius: vars.radii.lg,
  textAlign: 'center',
  boxShadow: vars.shadows.lg,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: vars.shadows.xl, // 좀 더 입체적인 그림자 효과
    }
  }
});

export const stepIconContainer = style({
  marginBottom: vars.space.md,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '80px',
  height: '80px',
  borderRadius: vars.radii.round,
  backgroundColor: vars.colors.secondary,
  color: vars.colors.white,
  margin: '0 auto ${vars.space.md}',
  fontSize: vars.fontSizes.xxxl, // 아이콘 크기
});

export const stepTitle = style({
  fontSize: vars.fontSizes.xl,
  fontWeight: vars.fontWeights.semibold,
  color: vars.colors.primary,
  marginBottom: vars.space.sm,
});

export const stepDescription = style({
  fontSize: vars.fontSizes.md,
  color: vars.colors.textLight,
  lineHeight: vars.lineHeights.normal,
});

// SVG 아이콘 스타일 (필요시)
globalStyle(`${stepIconContainer} svg`, {
  width: '40px',
  height: '40px',
}); 
import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const footerContainer = style({
  padding: `${vars.space.lg} ${vars.space.lg}`,
  backgroundColor: vars.colors.primary, // 푸터는 주요 색상 배경
  color: vars.colors.white,
  borderTop: `1px solid ${vars.colors.accent}`,
});

export const footerContent = style({
  maxWidth: '1280px', // 컨텐츠 최대 너비 제한
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
  textAlign: 'center',
  '@media': {
    '(min-width: 768px)': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      textAlign: 'left',
    },
  },
});

export const copyrightText = style({
  fontSize: vars.fontSizes.sm,
});

export const footerLinks = style({
  display: 'flex',
  gap: vars.space.md,
});

export const footerLink = style({
  fontSize: vars.fontSizes.sm,
  color: vars.colors.white,
  textDecoration: 'none',
  transition: 'opacity 0.2s ease-in-out',
  selectors: {
    '&:hover': {
      opacity: 0.8,
    },
  },
}); 
import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const headerContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.md} ${vars.space.lg}`,
  backgroundColor: vars.colors.white,
  borderBottom: `1px solid ${vars.colors.accent}`,
  position: 'sticky',
  top: 0,
  zIndex: vars.zIndices.sticky,
});

export const logoContainer = style({});

export const logoLink = style({
  textDecoration: 'none',
});

export const logoText = style({
  fontSize: vars.fontSizes.xl,
  fontWeight: vars.fontWeights.bold,
  color: vars.colors.primary,
});

export const navContainer = style({
  display: 'flex',
  gap: vars.space.lg,
  alignItems: 'center',
  '@media': {
    '(max-width: 768px)': {
      display: 'none', // 모바일에서는 숨김 (햄버거 메뉴로 대체 예정)
    },
  },
});

export const navLink = style({
  fontSize: vars.fontSizes.md,
  color: vars.colors.text,
  textDecoration: 'none',
  transition: 'color 0.2s ease-in-out',
  selectors: {
    '&:hover': {
      color: vars.colors.primary,
    },
  },
});

export const activeLink = style({
  color: vars.colors.primary,
  fontWeight: vars.fontWeights.bold,
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
});

export const ctaButtonContainer = style({});

export const ctaButton = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontSize: vars.fontSizes.sm,
  fontWeight: vars.fontWeights.medium,
  borderRadius: vars.radii.md,
  border: 'none',
  cursor: 'pointer',
  backgroundColor: vars.colors.primary,
  color: vars.colors.white,
  transition: 'opacity 0.2s ease-in-out',
  selectors: {
    '&:hover': {
      opacity: 0.85,
    },
  },
}); 
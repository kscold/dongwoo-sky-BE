import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const noticeSection = style({
  paddingTop: vars.space.xxxl,
  paddingBottom: vars.space.xxxxl,
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  backgroundColor: vars.colors.backgroundLight, // 약간 밝은 배경
});

export const sectionTitle = style({
  fontSize: vars.fontSizes.xxxl,
  fontWeight: vars.fontWeights.bold,
  color: vars.colors.textStrong,
  textAlign: 'center',
  marginBottom: vars.space.xxxl,
  borderBottom: `2px solid ${vars.colors.accent}`,
  paddingBottom: vars.space.md,
});

export const noticeList = style({
  listStyle: 'none',
  padding: 0,
  maxWidth: vars.breakpoints.md, // 공지사항 목록 최대 너비
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg, // 공지사항 간 간격
});

export const noticeItem = style({
  backgroundColor: vars.colors.white,
  paddingTop: vars.space.lg,
  paddingBottom: vars.space.lg,
  paddingLeft: vars.space.xl,
  paddingRight: vars.space.xl,
  borderRadius: vars.radii.lg,
  boxShadow: vars.shadows.md,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  selectors: {
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: vars.shadows.lg,
    }
  }
});

export const noticeLink = style({
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
});

export const noticeTitle = style({
  fontSize: vars.fontSizes.xl,
  fontWeight: vars.fontWeights.semibold,
  color: vars.colors.primary,
  marginBottom: vars.space.sm,
});

export const noticeDate = style({
  fontSize: vars.fontSizes.sm,
  color: vars.colors.textLight,
  marginBottom: vars.space.md,
});

export const noticeExcerpt = style({
  fontSize: vars.fontSizes.md,
  color: vars.colors.text,
  lineHeight: vars.lineHeights.relaxed,
});

export const noticeEmptyMessage = style({
  textAlign: 'center',
  fontSize: vars.fontSizes.lg,
  color: vars.colors.textLight,
  paddingTop: vars.space.xl,
  paddingBottom: vars.space.xl,
}); 
import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const pageWrapper = style({
  backgroundColor: vars.colors.gray[50],
  minHeight: '100vh',
  fontFamily: vars.fonts.body,
});

export const heroSection = style({
  background: `linear-gradient(to right, ${vars.colors.primary}, ${vars.colors.secondary})`,
  color: vars.colors.white,
  paddingTop: vars.space.xxxxl,
  paddingBottom: vars.space.xxxxl,
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  textAlign: 'center',
});

export const heroTitle = style({
  fontSize: vars.fontSizes.xxxxl,
  fontWeight: vars.fontWeights.bold,
  marginBottom: vars.space.lg,
  '@media': {
    '(min-width: 768px)': {
      fontSize: vars.fontSizes.xxxxxl,
    }
  }
});

export const heroSubtitle = style({
  fontSize: vars.fontSizes.xl,
  marginBottom: vars.space.xxl,
  '@media': {
    '(min-width: 768px)': {
      fontSize: vars.fontSizes.xxl,
    }
  }
});

export const phoneLinkButton = style({
  backgroundColor: vars.colors.white,
  color: vars.colors.primary,
  fontWeight: vars.fontWeights.bold,
  paddingTop: vars.space.lg,
  paddingBottom: vars.space.lg,
  paddingLeft: vars.space.xxl,
  paddingRight: vars.space.xxl,
  borderRadius: vars.radii.lg,
  fontSize: vars.fontSizes.xl,
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  boxShadow: vars.shadows.lg,
  textDecoration: 'none',
  display: 'inline-block',
  selectors: {
    '&:hover': {
      backgroundColor: vars.colors.gray[100],
      boxShadow: vars.shadows.xl,
    }
  }
});

export const formSection = style({
  paddingTop: vars.space.xxxxl,
  paddingBottom: vars.space.xxxxl,
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
});

export const formContainer = style({
  backgroundColor: vars.colors.white,
  padding: vars.space.xl,
  borderRadius: vars.radii.xl,
  boxShadow: vars.shadows.xl,
  maxWidth: vars.breakpoints.md,
  marginLeft: 'auto',
  marginRight: 'auto',
  '@media': {
    '(min-width: 768px)': {
      padding: vars.space.xxl,
    }
  }
});

export const formTitle = style({
  fontSize: vars.fontSizes.xxxl,
  fontWeight: vars.fontWeights.semibold,
  textAlign: 'center',
  marginBottom: vars.space.xxl,
  color: vars.colors.primary,
  borderBottom: `2px solid ${vars.colors.accent}`,
  paddingBottom: vars.space.md,
});

export const formDescription = style({
  fontSize: vars.fontSizes.lg,
  color: vars.colors.textLight,
  marginBottom: vars.space.xxl,
  textAlign: 'center',
  lineHeight: vars.lineHeights.relaxed,
});

export const formDescriptionLink = style({
  color: vars.colors.secondary,
  fontWeight: vars.fontWeights.semibold,
  textDecoration: 'none',
  selectors: {
    '&:hover': {
      textDecoration: 'underline',
    }
  }
});

export const form = style({
  display: 'grid',
  gap: vars.space.xl,
});

export const formField = style({
  display: 'flex',
  flexDirection: 'column',
});

export const formLabel = style({
  display: 'block',
  fontSize: vars.fontSizes.lg,
  fontWeight: vars.fontWeights.medium,
  color: vars.colors.textStrong,
  marginBottom: vars.space.sm,
});

export const formInput = style({
  marginTop: vars.space.xs,
  display: 'block',
  width: '100%',
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  paddingTop: vars.space.md,
  paddingBottom: vars.space.md,
  border: `1px solid ${vars.colors.border}`,
  borderRadius: vars.radii.lg,
  boxShadow: vars.shadows.sm,
  fontSize: vars.fontSizes.lg,
  backgroundColor: vars.colors.white,
  color: vars.colors.text,
  selectors: {
    '&:focus': {
      outline: 'none',
      borderColor: vars.colors.primary,
      boxShadow: `0 0 0 2px ${vars.colors.primaryTransparent}`,
    }
  }
});

export const formTextarea = style([
  formInput,
  {
    minHeight: '120px',
    resize: 'vertical',
  }
]);

export const submitButtonContainer = style({
  textAlign: 'center',
  paddingTop: vars.space.lg,
});

export const submitButton = style({
  width: '100%',
  paddingTop: vars.space.lg,
  paddingBottom: vars.space.lg,
  paddingLeft: vars.space.xl,
  paddingRight: vars.space.xl,
  fontSize: vars.fontSizes.lg,
  fontWeight: vars.fontWeights.bold,
  borderRadius: vars.radii.xl,
  backgroundColor: vars.colors.primary,
  color: vars.colors.white,
  transition: 'all 0.3s ease-in-out',
  boxShadow: vars.shadows.lg,
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: vars.colors.primaryDark,
      transform: 'scale(1.05)',
      opacity: 1,
    },
    '&:focus-visible': {
       boxShadow: `0 0 0 4px ${vars.colors.primaryTransparent}`,
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'scale(1)',
      boxShadow: vars.shadows.md,
    }
  },
  '@media': {
    '(min-width: 640px)': {
      width: 'auto',
      padding: `${vars.space.lg} ${vars.space.xxxl}`,
      fontSize: vars.fontSizes.xl,
    }
  }
});

export const kakaoButton = style([
  phoneLinkButton,
  {
    backgroundColor: '#FEE500',
    color: '#3C1E1E',
    marginTop: vars.space.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space.sm,
    width: 'auto',
    maxWidth: '320px',
    selectors: {
      '&:hover': {
        backgroundColor: '#F0D900',
        boxShadow: vars.shadows.xl,
      }
    }
  }
]);

export const kakaoIconStyle = style({
  width: '24px',
  height: '24px',
});

export const serviceProcessSection = style({
  paddingTop: vars.space.xxxxl,
  paddingBottom: vars.space.xxxxl,
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  backgroundColor: vars.colors.backgroundLight,
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

export const processGrid = style({
  display: 'grid',
  gap: vars.space.xl,
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: vars.space.xxl,
    },
    '(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    }
  }
});

export const processStep = style({
  backgroundColor: vars.colors.white,
  borderRadius: vars.radii.xl,
  padding: vars.space.xl,
  boxShadow: vars.shadows.lg,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
});

export const processStepIcon = style({
  width: vars.fontSizes.xxxxl,
  height: vars.fontSizes.xxxxl,
  color: vars.colors.primary,
  marginBottom: vars.space.sm,
});

export const processStepNumber = style({
  fontSize: vars.fontSizes.lg,
  fontWeight: vars.fontWeights.bold,
  color: vars.colors.secondary,
  backgroundColor: vars.colors.primaryLight,
  borderRadius: vars.radii.full,
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: vars.space.md,
});

export const processStepTitle = style({
  fontSize: vars.fontSizes.xl,
  fontWeight: vars.fontWeights.semibold,
  color: vars.colors.textStrong,
  marginBottom: vars.space.sm,
});

export const processStepDescription = style({
  fontSize: vars.fontSizes.md,
  color: vars.colors.textLight,
  lineHeight: vars.lineHeights.relaxed,
});

// globalStyle 블록들은 theme.css 수정 없이 직접 값을 사용하도록 변경했으므로 제거합니다.
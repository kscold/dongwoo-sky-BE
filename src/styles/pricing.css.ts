import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const pageWrapper = style({
  backgroundColor: vars.colors.gradientUtil,
  minHeight: '100vh',
  paddingTop: vars.space.xxxl,
  paddingBottom: vars.space.xxxl,
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  fontFamily: vars.fonts.body,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const container = style({
  width: '100%',
  maxWidth: vars.breakpoints.md,
  margin: '0 auto',
});

export const header = style({
  textAlign: 'center',
  marginBottom: vars.space.xxxxl,
});

export const mainTitle = style({
  fontSize: vars.fontSizes.xxxxl,
  fontWeight: vars.fontWeights.extrabold,
  color: vars.colors.primary,
  marginBottom: vars.space.md,
  lineHeight: '1.2',
  '@media': {
    '(min-width: 768px)': {
      fontSize: vars.fontSizes.xxxxxl,
    }
  }
});

export const subTitle = style({
  fontSize: vars.fontSizes.lg,
  color: vars.colors.text,
  maxWidth: '600px',
  margin: '0 auto',
  lineHeight: vars.lineHeights.relaxed,
  '@media': {
    '(min-width: 768px)': {
      fontSize: vars.fontSizes.xl,
    }
  }
});

export const card = style({
  backgroundColor: vars.colors.white,
  borderRadius: vars.radii.xl,
  padding: vars.space.xl,
  boxShadow: vars.shadows.xl,
  marginBottom: vars.space.xxxl,
  border: `1px solid ${vars.colors.border}`,
  '@media': {
    '(min-width: 768px)': {
      padding: vars.space.xxl,
    }
  }
});

export const cardTitle = style({
  fontSize: vars.fontSizes.xxl,
  fontWeight: vars.fontWeights.bold,
  color: vars.colors.textStrong,
  marginBottom: vars.space.xl,
  textAlign: 'center',
  letterSpacing: '-0.02em',
  borderBottom: `2px solid ${vars.colors.accent}`,
  paddingBottom: vars.space.md,
  '@media': {
    '(min-width: 768px)': {
      fontSize: vars.fontSizes.xxxl,
    }
  }
});

// --- 상세 옵션 카드 내부 --- 
export const optionHeaderContainer = style([ 
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vars.space.xxl, 
    fontSize: vars.fontSizes.xxl,
    fontWeight: vars.fontWeights.bold,
    color: vars.colors.textStrong,
    textAlign: 'center',
    letterSpacing: '-0.02em',
    '@media': {
        '(min-width: 768px)': {
          fontSize: vars.fontSizes.xxxl,
        }
      }
  }
]);

export const optionHeaderIcon = style({
  width: vars.fontSizes.xxxl,
  height: vars.fontSizes.xxxl,
  marginRight: vars.space.md,
  color: vars.colors.primary,
  flexShrink: 0,
  '@media': {
    '(min-width: 640px)': {
      width: vars.fontSizes.xxxxl,
      height: vars.fontSizes.xxxxl,
    }
  }
});

export const optionsSectionContainer = style({
  maxWidth: vars.breakpoints.sm,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xxl, 
});

export const optionItem = style({
  borderBottom: `1px solid ${vars.colors.border}`,
  paddingBottom: vars.space.xl,
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    }
  }
});

export const optionLabel = style({
  display: 'block',
  fontSize: vars.fontSizes.lg,
  fontWeight: vars.fontWeights.semibold,
  color: vars.colors.textStrong,
  marginBottom: vars.space.lg,
  textAlign: 'left',
  borderBottom: `1px dashed ${vars.colors.borderLight}`,
  paddingBottom: vars.space.sm,
  '@media': {
    '(min-width: 640px)': {
      fontSize: vars.fontSizes.xl,
    }
  }
});

// 슬라이더 스타일
export const sliderContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
});

export const sliderInput = style({
  width: '100%',
  height: '0.75rem',
  borderRadius: vars.radii.full,
  backgroundColor: vars.colors.gray[200],
  appearance: 'none',
  cursor: 'pointer',
  outline: 'none',
  vars: {
    '--slider-thumb-color': vars.colors.primary,
    '--slider-thumb-hover-color': vars.colors.primaryDark,
  },
  selectors: {
    '&::-webkit-slider-thumb': {
      appearance: 'none',
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: vars.radii.round,
      backgroundColor: 'var(--slider-thumb-color)',
      border: `2px solid ${vars.colors.white}`,
      boxShadow: vars.shadows.sm,
      transition: 'background-color 0.2s ease',
    },
    '&::-moz-range-thumb': {
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: vars.radii.round,
      backgroundColor: 'var(--slider-thumb-color)',
      border: `2px solid ${vars.colors.white}`,
      boxShadow: vars.shadows.sm,
      transition: 'background-color 0.2s ease',
    },
    '&:focus::-webkit-slider-thumb': {
        boxShadow: `0 0 0 3px ${vars.colors.primaryTransparent}` 
    },
    '&:focus::-moz-range-thumb': {
        boxShadow: `0 0 0 3px ${vars.colors.primaryTransparent}`
    },
     '&:hover::-webkit-slider-thumb': {
      backgroundColor: 'var(--slider-thumb-hover-color)',
    },
    '&:hover::-moz-range-thumb': {
      backgroundColor: 'var(--slider-thumb-hover-color)',
    },
  }
});

export const sliderValueDisplay = style({
  fontSize: vars.fontSizes.lg,
  fontWeight: vars.fontWeights.bold,
  color: vars.colors.primary,
  minWidth: '8rem',
  textAlign: 'center',
  backgroundColor: vars.colors.primaryLight,
  paddingTop: vars.space.sm,
  paddingBottom: vars.space.sm,
  paddingLeft: vars.space.md,
  paddingRight: vars.space.md,
  borderRadius: vars.radii.md,
  boxShadow: vars.shadows.xs,
  '@media': {
    '(min-width: 640px)': {
      fontSize: vars.fontSizes.xl,
    }
  }
});

// Select (드롭다운) 스타일
export const selectContainer = style({
  position: 'relative',
});

export const selectInput = style({
  width: '100%',
  padding: vars.space.lg,
  border: `1px solid ${vars.colors.border}`,
  borderRadius: vars.radii.lg,
  boxShadow: vars.shadows.sm,
  fontSize: vars.fontSizes.md,
  appearance: 'none',
  backgroundColor: vars.colors.white,
  color: vars.colors.text,
  cursor: 'pointer',
  selectors: {
    '&:focus': {
      outline: 'none',
      borderColor: vars.colors.primary,
      boxShadow: `0 0 0 2px ${vars.colors.primaryTransparent}`,
    },
  },
  '@media': {
    '(min-width: 640px)': {
        fontSize: vars.fontSizes.lg,
    }
  }
});

export const selectIcon = style({
  position: 'absolute',
  right: vars.space.lg,
  top: '50%',
  transform: 'translateY(-50%)',
  width: vars.fontSizes.lg,
  height: vars.fontSizes.lg,
  color: vars.colors.textLight,
  pointerEvents: 'none',
});

// 라디오 버튼 그룹 스타일
export const radioGroup = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: vars.space.md,
  '@media': {
    '(min-width: 640px)': {
      gap: vars.space.lg,
    }
  }
});

export const radioButtonBase = style({
  flex: '1 1 auto',
  minWidth: '120px',
  padding: vars.space.md,
  borderRadius: vars.radii.lg,
  border: `2px solid ${vars.colors.border}`,
  fontWeight: vars.fontWeights.semibold,
  fontSize: vars.fontSizes.md,
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  textAlign: 'center',
  outline: 'none',
  selectors: {
    '&:focus-visible': {
        boxShadow: `0 0 0 2px ${vars.colors.primaryTransparent}`
    }
  },
  '@media': {
    '(min-width: 640px)': {
      flexBasis: 'auto',
      paddingTop: vars.space.lg,
      paddingBottom: vars.space.lg,
      paddingLeft: vars.space.lg,
      paddingRight: vars.space.lg,
      fontSize: vars.fontSizes.lg,
    },
  }
});

export const radioButtonSelected = style([
  radioButtonBase,
  {
    backgroundColor: vars.colors.primary,
    color: vars.colors.white,
    borderColor: vars.colors.primaryDark,
    boxShadow: vars.shadows.md,
  }
]);

export const radioButtonDefault = style([
  radioButtonBase,
  {
    backgroundColor: vars.colors.gray[100],
    color: vars.colors.text,
    selectors: {
      '&:hover': {
        borderColor: vars.colors.primary,
        backgroundColor: vars.colors.primaryLight,
      }
    }
  }
]);

// 가격 표시부 스타일
export const priceDisplaySection = style({
  marginTop: vars.space.xxxl,
  paddingTop: vars.space.xxl,
  borderTop: `2px dashed ${vars.colors.borderLight}`,
});

export const priceDisplayCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: vars.colors.gray[50],
  paddingTop: vars.space.xl,
  paddingBottom: vars.space.xl,
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  borderRadius: vars.radii.xl,
  boxShadow: vars.shadows.inner,
  border: `1px solid ${vars.colors.border}`,
  textAlign: 'center',
  '@media': {
    '(min-width: 640px)': {
      padding: vars.space.xxl,
    }
  }
});

export const priceIcon = style({
  width: vars.fontSizes.xxxxxl,
  height: vars.fontSizes.xxxxxl,
  color: vars.colors.primary,
  marginBottom: vars.space.lg,
  '@media': {
    '(min-width: 640px)': {
      width: vars.fontSizes.xxxxxxl,
      height: vars.fontSizes.xxxxxxl,
    }
  }
});

export const priceLabel = style({
  fontSize: vars.fontSizes.xl,
  color: vars.colors.textStrong,
  fontWeight: vars.fontWeights.semibold,
  marginBottom: vars.space.sm,
  '@media': {
    '(min-width: 640px)': {
      fontSize: vars.fontSizes.xxl,
    }
  }
});

export const priceValue = style({
  fontSize: vars.fontSizes.xxxxl,
  fontWeight: vars.fontWeights.extrabold,
  color: vars.colors.primary,
  paddingTop: vars.space.xs,
  paddingBottom: vars.space.xs,
  lineHeight: '1.1',
  '@media': {
    '(min-width: 640px)': {
      fontSize: vars.fontSizes.xxxxxxl,
    }
  }
});

export const priceInfoText = style({
  fontSize: vars.fontSizes.sm,
  color: vars.colors.textLight,
  marginTop: vars.space.lg,
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  maxWidth: '450px',
  '@media': {
    '(min-width: 640px)': {
      fontSize: vars.fontSizes.md,
    }
  }
});

export const infoIcon = style({
  marginRight: vars.space.sm,
  flexShrink: 0,
  width: vars.fontSizes.md,
  height: vars.fontSizes.md,
});

// 견적 문의 버튼 스타일
export const inquiryButtonContainer = style({
  marginTop: vars.space.xxxl,
  textAlign: 'center',
});

export const inquiryButton = style({
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
      transform: 'scale(1.05)',
      opacity: 0.9,
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
    },
  }
}); 

export const truckSelectorGrid = style({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: vars.space.lg,
    '@media': {
        '(min-width: 640px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: vars.space.xl,
        }
    }
});

export const truckButtonBase = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: vars.space.lg,
    borderRadius: vars.radii.lg,
    border: `2px solid ${vars.colors.border}`,
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    '@media': {
        '(min-width: 640px)': {
            padding: vars.space.xl,
        }
    }
});

export const truckButtonSelected = style([
    truckButtonBase,
    {
        borderColor: vars.colors.primary,
        backgroundColor: vars.colors.primary,
        color: vars.colors.white,
        boxShadow: vars.shadows.lg,
    }
]);

export const truckButtonDefault = style([
    truckButtonBase,
    {
        backgroundColor: vars.colors.gray[50],
        color: vars.colors.text,
        selectors: {
            '&:hover': {
                borderColor: vars.colors.secondary,
                backgroundColor: vars.colors.background,
            }
        }
    }
]);

export const truckIcon = style({
    width: vars.fontSizes.xxxxl,
    height: vars.fontSizes.xxxxl,
    marginBottom: vars.space.md,
    transition: 'transform 0.3s ease-in-out',
    selectors: {
        [`${truckButtonBase}:hover &`]: {
            transform: 'scale(1.1)',
        },
    },
    '@media': {
        '(min-width: 640px)': {
            width: vars.fontSizes.xxxxxl,
            height: vars.fontSizes.xxxxxl,
        }
    }
});

export const truckIconSelected = style({
    color: vars.colors.white,
});

export const truckIconDefault = style({
    color: vars.colors.primary,
});

export const truckButtonText = style({
    fontSize: vars.fontSizes.lg,
    fontWeight: vars.fontWeights.semibold,
    '@media': {
        '(min-width: 640px)': {
            fontSize: vars.fontSizes.xl,
        }
    }
}); 
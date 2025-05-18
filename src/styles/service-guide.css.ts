import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

// 페이지 전체 래퍼 (contact.css.ts와 유사)
export const pageWrapper = style({
  backgroundColor: vars.colors.backgroundLight, // 전체 배경은 약간 밝게
  minHeight: '100vh',
  fontFamily: vars.fonts.body,
});

// Hero 섹션 (contact.css.ts와 유사)
export const heroSection = style({
  background: `linear-gradient(to right, ${vars.colors.primary}, ${vars.colors.secondary})`,
  color: vars.colors.white,
  paddingTop: vars.space.xxxxl,
  paddingBottom: vars.space.xxxxl,
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  textAlign: 'center',
  marginBottom: vars.space.xxxl, // 다음 섹션과의 간격
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
  maxWidth: '700px',
  marginLeft: 'auto',
  marginRight: 'auto',
  lineHeight: vars.lineHeights.relaxed,
  '@media': {
    '(min-width: 768px)': {
      fontSize: vars.fontSizes.xxl,
    }
  }
});

// 공통 섹션 컨테이너
export const sectionContainer = style({
  maxWidth: vars.breakpoints.lg, // 콘텐츠 최대 너비
  margin: `0 auto ${vars.space.xxxl} auto`,
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
});

// 공통 섹션 제목 (contact.css.ts의 sectionTitle과 유사)
export const sectionTitle = style({
  fontSize: vars.fontSizes.xxxl,
  fontWeight: vars.fontWeights.bold,
  color: vars.colors.textStrong,
  textAlign: 'center',
  marginBottom: vars.space.xxxl,
  borderBottom: `2px solid ${vars.colors.accent}`,
  paddingBottom: vars.space.md,
});

// 장비 소개 섹션
export const equipmentGrid = style({
  display: 'grid',
  gap: vars.space.xl,
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)', // 화면이 넓으면 3개씩
    }
  }
});

export const equipmentCard = style({
  backgroundColor: vars.colors.white,
  borderRadius: vars.radii.xl,
  boxShadow: vars.shadows.lg,
  overflow: 'hidden', // 이미지 삐져나옴 방지
  display: 'flex',
  flexDirection: 'column',
});

export const equipmentImagePlaceholder = style({
  width: '100%',
  height: '200px',
  backgroundColor: vars.colors.gray[200],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.colors.gray[300], // placeholder 텍스트 색상
  fontSize: vars.fontSizes.lg,
  fontWeight: vars.fontWeights.medium,
});

export const equipmentContent = style({
  padding: vars.space.xl,
});

export const equipmentTitle = style({
  fontSize: vars.fontSizes.xxl,
  fontWeight: vars.fontWeights.bold,
  color: vars.colors.textStrong,
  marginBottom: vars.space.md,
});

export const equipmentDescription = style({
  fontSize: vars.fontSizes.md,
  color: vars.colors.text,
  lineHeight: vars.lineHeights.relaxed,
  marginBottom: vars.space.lg,
});

// 추가된 스타일
export const equipmentAssignableCrew = style({
  fontSize: vars.fontSizes.sm,
  color: vars.colors.textLight,
  marginTop: vars.space.md,
});

// 작업 가능 범위 섹션
export const capabilitiesList = style({
  listStyle: 'none',
  padding: 0,
  display: 'grid',
  gap: vars.space.md,
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: vars.space.lg,
    },
  }
});

export const capabilityItem = style({
  backgroundColor: vars.colors.white,
  paddingTop: vars.space.lg,
  paddingBottom: vars.space.lg,
  paddingLeft: vars.space.xl,
  paddingRight: vars.space.xl,
  borderRadius: vars.radii.lg,
  boxShadow: vars.shadows.md,
  fontSize: vars.fontSizes.lg,
  color: vars.colors.textStrong,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
});

export const capabilityIcon = style({
  width: vars.fontSizes.xl,
  height: vars.fontSizes.xl,
  color: vars.colors.primary,
  flexShrink: 0,
});

// --- 기존 작업팀 소개 섹션 스타일 제거 또는 주석 처리 ---
/*
export const teamGrid = style({...});
export const teamMemberCard = style({...});
export const teamMemberImagePlaceholder = style({...});
export const teamMemberName = style({...});
export const teamMemberRole = style({...});
export const teamMemberBio = style({...});
export const teamMemberExpertiseContainer = style({...});
export const teamMemberExpertiseList = style({...});
*/

// --- 새로운 작업자 프로필 섹션 스타일 ---
export const operatorProfileSection = style([
  sectionContainer, // 공통 섹션 컨테이너 스타일 재활용
  {
    backgroundColor: vars.colors.white, // 프로필 섹션 배경은 흰색으로
    paddingTop: vars.space.xxxl,
    paddingBottom: vars.space.xxxl,
    borderRadius: vars.radii.xl, // 섹션 자체에 둥근 모서리 추가
    boxShadow: vars.shadows.xl, // 섹션에 큰 그림자 효과
  }
]);

export const profileCard = style({ // 카드 형태가 아닌, 섹션 내부 컨텐츠 레이아웃용
  display: 'grid',
  gap: vars.space.xxl,
  alignItems: 'flex-start', // 상단 정렬
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: '300px 1fr', // 이미지 영역과 정보 영역 분리
    }
  }
});

export const profileImageContainer = style({
  width: '100%',
  maxWidth: '300px', // 이미지 최대 너비 (모바일에서는 중앙 정렬될 수 있도록)
  margin: '0 auto', // 모바일에서 중앙 정렬
  '@media': {
    '(min-width: 768px)': {
      margin: '0', // 데스크탑에서는 그리드 아이템이므로 auto 마진 제거
    }
  }
});

export const profileImagePlaceholder = style({
  width: '100%',
  paddingBottom: '100%', // 정사각형 비율 유지 (이미지 대신 사용)
  backgroundColor: vars.colors.gray[200],
  borderRadius: vars.radii.xl,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.colors.gray[300],
  fontSize: vars.fontSizes.xxl, // 아이콘 크기 키움
  fontWeight: vars.fontWeights.medium,
  boxShadow: vars.shadows.inner, // 안쪽 그림자
});

export const profileInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

export const profileName = style({
  fontSize: vars.fontSizes.xxxxl,
  fontWeight: vars.fontWeights.extrabold,
  color: vars.colors.primary,
  lineHeight: vars.lineHeights.heading,
  textAlign: 'center', // 모바일에서는 중앙
  '@media': {
    '(min-width: 768px)': {
      textAlign: 'left', // 데스크탑에서는 좌측
    }
  }
});

export const profileRole = style({
  fontSize: vars.fontSizes.xl,
  fontWeight: vars.fontWeights.semibold,
  color: vars.colors.primary,
  textAlign: 'center',
  marginBottom: vars.space.md,
  '@media': {
    '(min-width: 768px)': {
      textAlign: 'left',
    }
  }
});

export const profileSectionTitle = style({
  fontSize: vars.fontSizes.xxl,
  fontWeight: vars.fontWeights.bold,
  color: vars.colors.textStrong,
  borderBottom: `2px solid ${vars.colors.accent}`,
  paddingBottom: vars.space.sm,
  marginBottom: vars.space.md,
});

export const profileList = style({
  listStyle: 'none',
  padding: 0,
  marginLeft: vars.space.md, // 약간의 들여쓰기
});

export const profileListItem = style({
  fontSize: vars.fontSizes.lg,
  color: vars.colors.text,
  paddingBottom: vars.space.sm,
  position: 'relative',
  paddingLeft: vars.space.lg,
  selectors: {
    '&::before': {
      content: '"\u2713"',
      color: vars.colors.primary,
      position: 'absolute',
      left: 0,
      fontWeight: vars.fontWeights.bold,
    }
  }
});

export const profileBio = style({
  fontSize: vars.fontSizes.lg,
  color: vars.colors.text,
  lineHeight: vars.lineHeights.relaxed,
  whiteSpace: 'pre-wrap', // 줄바꿈 유지
});

// 이용 요금 안내 버튼 (contact.css.ts의 submitButton과 유사하게)
export const pricingButtonContainer = style({
  textAlign: 'center',
  marginTop: vars.space.xxxl, // 위 섹션과의 간격
  paddingBottom: vars.space.xxxl, // 페이지 하단 여백
});

export const pricingButton = style([
  // contact.css.ts의 submitButton 스타일과 유사하게 가져오되, 일부 수정
  {
    display: 'inline-block', // submitButton은 block이었으므로 변경
    paddingTop: vars.space.lg,
    paddingBottom: vars.space.lg,
    paddingLeft: vars.space.xxxl,
    paddingRight: vars.space.xxxl,
    fontSize: vars.fontSizes.xl,
    fontWeight: vars.fontWeights.bold,
    borderRadius: vars.radii.xl,
    backgroundColor: vars.colors.secondary, // primary 대신 secondary 사용
    color: vars.colors.white,
    textDecoration: 'none', // Link 용
    transition: 'all 0.3s ease-in-out',
    boxShadow: vars.shadows.lg,
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    selectors: {
      '&:hover:not(:disabled)': {
        backgroundColor: vars.colors.primaryDark, // secondaryDark가 없으므로 primaryDark로 대체 (theme.css에 추가 고려)
        transform: 'scale(1.05)',
      },
      '&:focus-visible': {
         boxShadow: `0 0 0 4px ${vars.colors.primaryTransparent}`, // secondaryTransparent 제거, primaryTransparent로 통일
      },
    },
    '@media': {
      '(min-width: 640px)': {
        padding: `${vars.space.xl} ${vars.space.xxxxl}`, // 패딩을 더 크게
      },
    }
  }
]); 
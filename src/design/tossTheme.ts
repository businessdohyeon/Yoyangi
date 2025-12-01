// Toss-like color theme for the app
// Note: "Toss" 브랜드의 정확한 색상은 상업적 저작권에 보호될 수 있으므로
// 실무에서 사용 시 브랜드 가이드라인을 확인하세요.

import { DefaultTheme as PaperDefaultTheme } from 'react-native-paper';

const toss = {
    // 토스 분위기의 그린 계열 기반 팔레트
    primary: '#00C17A', // 메인 액센트 그린 — 필요 시 변경
    primaryDark: '#00A66A',
    primaryLight: '#B8FFE7',

    // 보조 색상
    success: '#00C17A',
    info: '#17A2FF',
    warning: '#FFC107',
    error: '#FF5252',

    // 중립 그레이
    gray900: '#121212',
    gray800: '#1F2933',
    gray700: '#374151',
    gray600: '#4B5563',
    gray500: '#6B7280',
    gray400: '#9CA3AF',
    gray300: '#D1D5DB',
    gray200: '#E5E7EB',
    gray100: '#F3F4F6',

    // 배경/표면
    backgroundLight: '#FFFFFF',
    surfaceLight: '#FFFFFF',
    backgroundDark: '#0B0B0B',
    surfaceDark: '#0F1720',
};

export const lightTheme = {
    ...PaperDefaultTheme,
    dark: false,
    colors: {
        // start from react-native-paper defaults then override
        ...(PaperDefaultTheme.colors as any),
        primary: toss.primary,
        onPrimary: '#ffffff',
        primaryContainer: toss.primaryLight,
        onPrimaryContainer: toss.gray900,

        secondary: toss.gray700,
        onSecondary: toss.gray100,
        secondaryContainer: toss.gray200,
        onSecondaryContainer: toss.gray900,

        tertiary: toss.info,
        onTertiary: '#ffffff',

        error: toss.error,
        onError: '#ffffff',

        background: toss.backgroundLight,
        onBackground: toss.gray900,

        surface: toss.surfaceLight,
        onSurface: toss.gray900,

        surfaceVariant: toss.gray200,
        onSurfaceVariant: toss.gray700,

        outline: toss.gray400,
        outlineVariant: toss.gray300,

        inverseSurface: toss.gray900,
        inverseOnSurface: toss.backgroundLight,
        inversePrimary: toss.primaryDark,

        disabled: toss.gray300,
        backdrop: 'rgba(0,0,0,0.5)',
        notification: toss.primary,
    },
};

export const darkTheme = {
    ...PaperDefaultTheme,
    dark: true,
    colors: {
        ...(PaperDefaultTheme.colors as any),
        primary: toss.primaryDark,
        onPrimary: '#000000',
        primaryContainer: toss.primary,
        onPrimaryContainer: toss.gray100,

        secondary: toss.gray500,
        onSecondary: toss.gray900,
        secondaryContainer: toss.gray700,
        onSecondaryContainer: toss.gray100,

        tertiary: toss.info,
        onTertiary: '#000000',

        error: toss.error,
        onError: '#000000',

        background: toss.backgroundDark,
        onBackground: toss.gray100,

        surface: toss.surfaceDark,
        onSurface: toss.gray100,

        surfaceVariant: toss.gray800,
        onSurfaceVariant: toss.gray300,

        outline: toss.gray600,
        outlineVariant: toss.gray700,

        inverseSurface: toss.backgroundLight,
        inverseOnSurface: toss.gray900,
        inversePrimary: toss.primary,

        disabled: toss.gray700,
        backdrop: 'rgba(0,0,0,0.7)',
        notification: toss.primary,
    },
};

export default {
    toss,
    lightTheme,
    darkTheme,
};

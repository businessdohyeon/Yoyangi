import { DefaultTheme as PaperDefaultTheme } from 'react-native-paper';

const custom = {
    primary: '#00C17A',
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
        ...(PaperDefaultTheme.colors as Record<string, string>),
        primary: custom.primary,
        onPrimary: '#ffffff',
        primaryContainer: custom.primaryLight,
        onPrimaryContainer: custom.gray900,

        secondary: custom.gray700,
        onSecondary: custom.gray100,
        secondaryContainer: custom.gray200,
        onSecondaryContainer: custom.gray900,

        tertiary: custom.info,
        onTertiary: '#ffffff',

        error: custom.error,
        onError: '#ffffff',

        background: custom.backgroundLight,
        onBackground: custom.gray900,

        surface: custom.surfaceLight,
        onSurface: custom.gray900,

        surfaceVariant: custom.gray200,
        onSurfaceVariant: custom.gray700,

        outline: custom.gray400,
        outlineVariant: custom.gray300,

        inverseSurface: custom.gray900,
        inverseOnSurface: custom.backgroundLight,
        inversePrimary: custom.primaryDark,

        disabled: custom.gray300,
        backdrop: 'rgba(0,0,0,0.5)',
        notification: custom.primary,
    },
};

export const darkTheme = {
    ...PaperDefaultTheme,
    dark: true,
    colors: {
        ...(PaperDefaultTheme.colors as Record<string, string>),
        primary: custom.primaryDark,
        onPrimary: '#000000',
        primaryContainer: custom.primary,
        onPrimaryContainer: custom.gray100,

        secondary: custom.gray500,
        onSecondary: custom.gray900,
        secondaryContainer: custom.gray700,
        onSecondaryContainer: custom.gray100,

        tertiary: custom.info,
        onTertiary: '#000000',

        error: custom.error,
        onError: '#000000',

        background: custom.backgroundDark,
        onBackground: custom.gray100,

        surface: custom.surfaceDark,
        onSurface: custom.gray100,

        surfaceVariant: custom.gray800,
        onSurfaceVariant: custom.gray300,

        outline: custom.gray600,
        outlineVariant: custom.gray700,

        inverseSurface: custom.backgroundLight,
        inverseOnSurface: custom.gray900,
        inversePrimary: custom.primary,

        disabled: custom.gray700,
        backdrop: 'rgba(0,0,0,0.7)',
        notification: custom.primary,
    },
};

export default {
    toss: custom,
    lightTheme,
    darkTheme,
};

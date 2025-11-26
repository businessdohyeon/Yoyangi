import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import apis from '../apis';
import { LoginInfoSchema, LoginInfo } from '../Context';

// Context 업데이트를 위한 콜백 함수 (Context에서 설정)
let onLogoutCallback: (() => Promise<void>) | null = null;
let onTokenRefreshCallback: (() => Promise<void>) | null = null;

/**
 * 로그아웃 콜백 함수 설정 (Context에서 호출)
 */
export function setLogoutCallback(callback: () => Promise<void>) {
    onLogoutCallback = callback;
}

/**
 * 토큰 갱신 콜백 함수 설정 (Context에서 호출)
 */
export function setTokenRefreshCallback(callback: () => Promise<void>) {
    onTokenRefreshCallback = callback;
}

/**
 * RefreshToken을 사용하여 새로운 AccessToken을 발급받는 함수
 * @returns {Promise<string | null>} - 새로운 토큰 또는 null (실패 시)
 */
export async function refreshAccessToken(): Promise<string | null> {
    try {
        const loginInfoData = await AsyncStorage.getItem('loginInfo');
        
        if (!loginInfoData) {
            console.log('No loginInfo found in storage');
            return null;
        }

        const loginInfo = LoginInfoSchema.parse(JSON.parse(loginInfoData));
        
        if (!loginInfo.refreshToken) {
            console.log('No refreshToken found');
            return null;
        }

        // refresh-token API는 axios 인스턴스가 아닌 직접 호출 (인터셉터 무한 루프 방지)
        const response = await axios.post(
            `${apis.urls.server}/user/sns/login/refresh-token`,
            {
                refreshToken: loginInfo.refreshToken,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.data && response.data.token) {
            const newToken = response.data.token;
            
            // 새 토큰을 AsyncStorage에 저장
            const updatedLoginInfo: LoginInfo = {
                ...loginInfo,
                token: newToken,
            };
            
            await AsyncStorage.setItem('loginInfo', JSON.stringify(updatedLoginInfo));
            
            // Context 업데이트 (콜백이 설정되어 있으면 호출)
            if (onTokenRefreshCallback) {
                await onTokenRefreshCallback();
            }
            
            console.log('Token refreshed successfully');
            return newToken;
        }

        return null;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
    }
}

/**
 * 로그아웃 처리 (토큰 제거 및 Context 업데이트)
 */
export async function handleLogout(): Promise<void> {
    try {
        // AsyncStorage에서 로그인 정보 제거
        await AsyncStorage.removeItem('loginInfo');
        console.log('Logged out successfully');
        
        // Context 업데이트 (콜백이 설정되어 있으면 호출)
        if (onLogoutCallback) {
            await onLogoutCallback();
        }
    } catch (error) {
        console.error('Failed to logout:', error);
    }
}



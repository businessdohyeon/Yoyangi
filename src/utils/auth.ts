import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import apis from '../apis';
import { LoginInfoSchema, LoginInfo } from '../Context';

// TODO: 중앙화된 Auth 서비스로 리팩토링 검토
// - 현재 유틸 파일은 AsyncStorage와 네트워크 호출을 직접 다룹니다.
// - 반환 타입과 에러 처리를 더 명확히 하고, retry/backoff 정책을 적용하세요.
// - Context 업데이트 콜백 외에 이벤트 기반 구독/발행 모델을 고려할 수 있습니다.

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
  // TODO: 개선 아이디어
  // - 실패 시 재시도(backoff) 로직 고려
  // - refreshToken이 만료된 경우 앱의 재인증(re-login) 흐름으로 유도
  // - 에러 유형별로 로깅/분기 처리 강화
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

    // TODO: 필요 시 상세 에러 처리 추가 (예: 401 -> 재로그인 유도)
    return null;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // TODO: 에러 시 필요한 사용자 알림 또는 재시도 로직 추가
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

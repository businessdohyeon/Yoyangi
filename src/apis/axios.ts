import axios from 'axios';
import apis from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginInfoSchema, LoginInfo } from '../Context';
import { refreshAccessToken, handleLogout } from '../utils/auth';
import { navigateToLogin } from '../utils/navigationRef';

const axiosInstance = axios.create({
    baseURL: apis.urls.server,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 리프레시 토큰 재시도 추적 (무한 루프 방지)
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
}> = [];

// 대기 중인 요청들 처리
function processQueue(error: any, token: string | null = null) {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
}

// 요청 인터셉터 - 토큰 추가
axiosInstance.interceptors.request.use(
    async (config) => {
        // 요청에 Authorization 헤더가 없으면 AsyncStorage에서 토큰 가져와서 추가
        // 이미 Authorization 헤더가 있으면 사용자가 명시적으로 설정한 것이므로 그대로 사용
        if (config.headers && !config.headers.Authorization) {
            try {
                const loginInfoData = await AsyncStorage.getItem('loginInfo');
                if (loginInfoData) {
                    const loginInfo = LoginInfoSchema.parse(JSON.parse(loginInfoData));
                    if (loginInfo.token && loginInfo.token.length > 0) {
                        config.headers.Authorization = `Bearer ${loginInfo.token}`;
                    }
                }
            } catch (error) {
                console.error('Failed to get token from storage:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 응답 인터셉터 - 401 처리 및 토큰 갱신
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고, Authorization 헤더가 있었으며, 아직 재시도하지 않은 경우
        if (
            error.response?.status === 401 &&
            originalRequest.headers?.Authorization &&
            !originalRequest._retry
        ) {
            console.log("401 에러이고, Authorization 헤더가 있었으며, 아직 재시도하지 않은 경우");

            // 이미 리프레시 중이면 대기열에 추가
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // 토큰 갱신 시도
                const newToken = await refreshAccessToken();

                if (newToken) {
                    // 새 토큰으로 원래 요청 재시도
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    
                    // 대기 중인 요청들 처리
                    processQueue(null, newToken);
                    isRefreshing = false;

                    return axiosInstance(originalRequest);
                } else {
                    // 토큰 갱신 실패 - 로그아웃 처리
                    throw new Error('Token refresh failed');
                }
            } catch (refreshError) {
                // 토큰 갱신 실패 - 로그아웃 처리
                processQueue(refreshError, null);
                isRefreshing = false;

                // 로그아웃 처리
                await handleLogout();

                // LoginPage로 리다이렉션
                // 현재 route 정보를 가져올 수 없으므로 기본적으로 로그인 페이지로 이동
                navigateToLogin();

                return Promise.reject(refreshError);
            }
        }

        // 다른 에러 처리
        if (error.response) {
            // 서버 응답이 있는 경우
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // 요청은 보냈지만 응답이 없는 경우
            console.error('Network Error:', error.request);
        } else {
            // 요청 설정 중 에러가 발생한 경우
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;


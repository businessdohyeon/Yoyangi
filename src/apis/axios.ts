import axios from 'axios';
import apis from './index';

const axiosInstance = axios.create({
    baseURL: apis.urls.server,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 - 토큰 추가 (필요시)
axiosInstance.interceptors.request.use(
    (config) => {
        // 토큰이 필요한 경우 여기서 추가
        // const token = getToken();
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 응답 인터셉터 - 에러 처리
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 에러 처리 로직
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


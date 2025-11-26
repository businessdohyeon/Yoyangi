import { useContext, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LoginInfoContext } from '../Context';

/**
 * 로그인이 필요한 페이지에서 사용하는 훅
 * 로그인 정보가 없으면 LoginPage로 리다이렉션
 * @param redirectIfNotLoggedIn - 로그인하지 않았을 때 리다이렉션 여부 (기본값: true)
 * @returns { isAuthenticated: boolean } - 로그인 여부
 */
export function useRequireAuth(redirectIfNotLoggedIn: boolean = true) {
    const { loginInfo } = useContext(LoginInfoContext);
    const navigation = useNavigation();
    const route = useRoute();
    const hasRedirected = useRef(false);

    const isAuthenticated = loginInfo?.token && loginInfo?.token.length > 0 && loginInfo?.userId > 0;

    useEffect(() => {
        if (!redirectIfNotLoggedIn) {
            return;
        }

        if (!isAuthenticated && !hasRedirected.current) {
            hasRedirected.current = true;
            // 현재 route params를 저장하여 로그인 후 돌아올 수 있도록 함
            navigation.navigate('LoginPage', {
                returnScreen: route.name,
                returnParams: route.params,
            });
        } else if (isAuthenticated) {
            hasRedirected.current = false;
        }
    }, [isAuthenticated, redirectIfNotLoggedIn, navigation, route]);

    return { isAuthenticated };
}


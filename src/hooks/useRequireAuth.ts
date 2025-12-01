import { useContext, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackNavProp } from '../types/Navigation';
import { LoginInfoContext } from '../Context';

export function useRequireAuth(redirectIfNotLoggedIn: boolean = true) {
    const { loginInfo } = useContext(LoginInfoContext);
    const navigation = useNavigation<RootStackNavProp<'Tabs'>>();
    const route = useRoute();
    const hasRedirected = useRef(false);

    const isAuthenticated =
        loginInfo?.token &&
        loginInfo?.token.length > 0 &&
        loginInfo?.userId > 0;

    useEffect(() => {
        if (!redirectIfNotLoggedIn) {
            return;
        }

        if (!isAuthenticated && !hasRedirected.current) {
            hasRedirected.current = true;
            // 현재 route params를 저장하여 로그인 후 돌아올 수 있도록 함
            // TODO: `route.name`과 `route.params`의 구체적 타입을 정의하세요.
            // 현재는 `any`로 캐스팅하여 안전하지 않으므로, 앱의 네비게이션 타입을
            // `RootStackParamList`에 맞춰 업데이트하면 타입 안정성이 높아집니다.
            navigation.navigate('LoginPage', {
                returnScreen: route.name as any,
                returnParams: route.params,
            });
        } else if (isAuthenticated) {
            hasRedirected.current = false;
        }
    }, [isAuthenticated, redirectIfNotLoggedIn, navigation, route]);

    return { isAuthenticated };
}

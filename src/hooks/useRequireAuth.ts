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

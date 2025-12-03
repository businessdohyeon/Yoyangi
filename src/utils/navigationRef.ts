import {
    createNavigationContainerRef,
    CommonActions,
} from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * 전역 navigation 참조를 사용하여 LoginPage로 리다이렉션
 * 현재 route 정보를 가져와서 returnScreen과 returnParams에 전달
 */
// TODO: 현재 returnParams에 임시 타입이 사용되고 있습니다. 가능한 경우
// `RootStackParamList`에서 올바른 타입을 추출하여 명시적으로 지정해주세요.
// 또한, 로그인 이후 복귀할 경로 타입을 강하게 하는 것이 안전합니다.
export function navigateToLogin(
    returnScreen?: string,
    returnParams?: RootStackParamList[keyof RootStackParamList] | undefined,
) {
    if (navigationRef.isReady()) {
        // 현재 route 정보가 없으면 navigation state에서 가져오기
        let currentRoute = returnScreen;
        let currentParams = returnParams;

        if (!currentRoute) {
            try {
                const state = navigationRef.getState();
                if (state && state.routes && state.routes.length > 0) {
                    const activeRoute =
                        state.routes[state.index || state.routes.length - 1];
                    if (activeRoute) {
                        currentRoute = activeRoute.name;
                        currentParams = activeRoute.params as
                            | RootStackParamList[keyof RootStackParamList]
                            | undefined;
                    }
                }
            } catch (error) {
                console.error('Failed to get current route:', error);
            }
        }

        navigationRef.navigate('LoginPage', {
            returnScreen: currentRoute as keyof RootStackParamList | undefined,
            returnParams: currentParams,
        });
    }
}

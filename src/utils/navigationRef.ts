import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * 전역 navigation 참조를 사용하여 LoginPage로 리다이렉션
 * 현재 route 정보를 가져와서 returnScreen과 returnParams에 전달
 */
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

import { Image, Linking, useWindowDimensions, View } from 'react-native';
import { Button, TouchableRipple, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useContext, useEffect } from 'react';

import apis from '../../apis';
import { LoginInfoContext } from '../../Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import naverLoginBtnImg from './btnG_완성형.png';
import kakaoLoginBtnImg from './kakao_login_medium_narrow.png';
import googleLoginBtnImg from './web_light_sq_SI.png';

const LoginPage = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const { width, height } = useWindowDimensions();
    const { loginInfo, storeLoginInfo } = useContext(LoginInfoContext);
    const route = useRoute();

    console.log('loginInfo', loginInfo);

    const handleUrl = useCallback((event) => {
        const url = event.url || event;

        console.log('url', url);

        const urlobj = new URL(url);
        const params = urlobj.searchParams;
        const provider = params.get('provider');
        const token = params.get('token');
        const refreshToken = params.get('refreshToken');
        const userId = params.get('userId');

        console.log({ urlobj, params, token, userId });

        if (
            provider != null &&
            token !== null &&
            refreshToken !== null &&
            userId !== null
        ) {
            storeLoginInfo({ provider, token, refreshToken, userId });
            
            // 로그인 성공 후 원래 페이지로 돌아가기
            const returnScreen = route.params?.returnScreen;
            const returnParams = route.params?.returnParams;
            
            if (returnScreen) {
                // 원래 페이지로 돌아가기
                navigation.navigate(returnScreen, returnParams || {});
            } else {
                navigation.goBack();
            }
        } else {
        }
    }, [route.params]);

    const refreashToken = async () => {
        try {
            const res = await fetch(
                `${apis.urls.server}/user/sns/login/refresh-token`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },

                    body: JSON.stringify({
                        refreshToken: loginInfo.refreshToken,
                    }),
                },
            );

            if (!res.ok) {
                console.log(res);
                return;
            }

            const json = await res.json();

            console.log(json);

            storeLoginInfo({
                ...loginInfo,
                token: json.token,
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // 콜드 스타트 처리
        Linking.getInitialURL().then((initialUrl) => {
            if (initialUrl) handleUrl(initialUrl);
        });

        // 포그라운드에서 돌아왔을 때 처리
        const sub = Linking.addEventListener('url', handleUrl);
        return () => {
            sub.remove();
        };
    }, [handleUrl]);

    const openAuth = async (provider) => {
        try {
            // await Linking.openURL(authUrl);
            await Linking.openURL(
                `${apis.urls.server}/user/sns/login/${provider}`,
            );
        } catch (e) {
            console.warn('openURL failed', e);
        }
    };

    const buttonSize = {
        width: 300,
        height: 60,
    };

    return (
        <>
            <View
                style={{
                    gap: 30,
                    backgroundColor: theme.colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width,
                    height: height,
                }}
            >
                {[
                    { id: 'naver', src: naverLoginBtnImg },
                    { id: 'kakao', src: kakaoLoginBtnImg },
                    { id: 'google', src: googleLoginBtnImg },
                ].map(({ id, src }) => (
                    <TouchableRipple
                        key={id}
                        style={{
                            ...buttonSize,
                            borderRadius: 8,
                            overflow: 'hidden',
                        }}
                        onPress={() => openAuth(id)}
                    >
                        <Image
                            style={{ ...buttonSize }}
                            resizeMode="contain"
                            source={src}
                        />
                    </TouchableRipple>
                ))}
                {/* TODO
                <Button mode="outlined" onPress={_handleMore}>
                    전화번호 login
                </Button> */}
                {/* <Button mode="outlined" onPress={refreashToken}>
                    refresh token
                </Button>
                <Button mode="outlined" onPress={() => AsyncStorage.clear()}>
                    async clear
                </Button> */}
            </View>
        </>
    );
};

export default LoginPage;

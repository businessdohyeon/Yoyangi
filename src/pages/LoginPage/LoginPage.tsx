import { Image, Linking, useWindowDimensions, View } from 'react-native';
import {
    TouchableRipple,
    useTheme,
    Text,
    Card,
    Title,
    Paragraph,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useContext, useEffect } from 'react';

import apis from '../../apis';
import { LoginInfoContext } from '../../Context';
import naverLoginBtnImg from './btnG_완성형.png';
import kakaoLoginBtnImg from './kakao_login_medium_narrow.png';
import googleLoginBtnImg from './web_light_sq_SI.png';

const LoginPage = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const { width } = useWindowDimensions();
    const { loginInfo, storeLoginInfo } = useContext(LoginInfoContext);
    const route = useRoute();

    const handleUrl = useCallback(
        (event: any) => {
            const url = event?.url ?? event;
            try {
                const getQueryParam = (u: string, name: string) => {
                    const m = u.match(new RegExp('[?&]' + name + '=([^&]+)'));
                    return m ? decodeURIComponent(m[1]) : null;
                };

                const provider = getQueryParam(url, 'provider');
                const token = getQueryParam(url, 'token');
                const refreshToken = getQueryParam(url, 'refreshToken');
                const userId = getQueryParam(url, 'userId');

                if (provider && token && refreshToken && userId) {
                    storeLoginInfo({
                        provider: provider as any,
                        token,
                        refreshToken,
                        userId: Number(userId),
                    } as any);

                    const returnScreen = (route as any).params?.returnScreen;
                    const returnParams = (route as any).params?.returnParams;
                    if (returnScreen) {
                        (navigation as any).navigate(
                            returnScreen as any,
                            returnParams || {},
                        );
                    } else {
                        navigation.goBack();
                    }
                }
            } catch (error) {
                console.log('handleUrl error', error);
            }
        },
        [storeLoginInfo, route, navigation],
    );

    useEffect(() => {
        Linking.getInitialURL().then((initialUrl) => {
            if (initialUrl) handleUrl(initialUrl);
        });

        const sub = Linking.addEventListener('url', handleUrl as any);
        return () => {
            // @ts-ignore
            sub.remove();
        };
    }, [handleUrl]);

    const openAuth = async (provider: string) => {
        try {
            await Linking.openURL(
                `${apis.urls.server}/api/user/sns/login/${provider}`,
            );
        } catch (e) {
            console.warn('openURL failed', e);
        }
    };

    return (
        <View
            style={{
                backgroundColor: theme.colors.background,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
            }}
        >
            <Card
                style={{ width: Math.min(width - 40, 420), borderRadius: 12 }}
            >
                <Card.Content
                    style={{ alignItems: 'center', paddingVertical: 18 }}
                >
                    <Title style={{ marginBottom: 6 }}>요양이</Title>
                    <Paragraph
                        style={{
                            color: '#666',
                            textAlign: 'center',
                            marginBottom: 18,
                        }}
                    >
                        간편하고 안전한 회원가입 · 로그인
                    </Paragraph>

                    <View style={{ width: '100%', rowGap: 12 }}>
                        {[
                            { id: 'naver', src: naverLoginBtnImg },
                            { id: 'kakao', src: kakaoLoginBtnImg },
                            { id: 'google', src: googleLoginBtnImg },
                        ].map(({ id, src }) => (
                            <TouchableRipple
                                key={id}
                                onPress={() => openAuth(id)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 52,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    backgroundColor:
                                        id === 'naver'
                                            ? '#06C755'
                                            : id === 'kakao'
                                            ? '#FEE500'
                                            : '#FFFFFF',
                                    borderWidth: id === 'google' ? 1 : 0,
                                    borderColor: '#E0E0E0',
                                    marginBottom: 10,
                                }}
                            >
                                <Image
                                    source={src}
                                    style={{
                                        height: 28,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </TouchableRipple>
                        ))}
                    </View>
                </Card.Content>

                <Card.Actions
                    style={{ justifyContent: 'center', paddingBottom: 12 }}
                >
                    <Text style={{ color: '#999', fontSize: 12 }}>
                        계정 생성 또는 로그인 시 이용약관 및 개인정보처리방침에
                        동의합니다.
                    </Text>
                </Card.Actions>
            </Card>
        </View>
    );
};

export default LoginPage;

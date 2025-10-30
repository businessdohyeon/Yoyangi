import { Linking, useWindowDimensions, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';

import apis from '../../apis';
import { LoginTokenContext } from '../../Context';

const _goBack = () => console.log('Went back');
const _handleSearch = () => console.log('Searching');
const _handleMore = () => console.log('Shown more');

const parseTokenFromUrl = (url) => {
    const m = url.match(/[?&]token=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : null;
};

const LoginPage = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const { width, height } = useWindowDimensions();
    const {loginToken, setLoginToken} = useContext(LoginTokenContext);

    const [code, setCode] = useState<String | null>(null);

    console.log("loginToken", loginToken)

    const handleUrl = useCallback((event) => {
        const url = event.url || event;

        console.log('url', url);

        const receivedCode = parseTokenFromUrl(url);

        if (receivedCode) {
            setCode(receivedCode);
            setLoginToken(receivedCode);

            // fetch(
            //     `${apis.urls.server}/user/sns/login/naver/callback?code=${receivedCode}`,
            // )
            //     .then((res) => res.json())
            //     .then((json) => {
            //         console.log(json);
            //     });
        }
    }, []);

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

    const openAuth = async () => {
        try {
            // await Linking.openURL(authUrl);
            await Linking.openURL(apis.urls.loginNaver);
        } catch (e) {
            console.warn('openURL failed', e);
        }
    };

    return (
        <>
            <View
                style={{
                    gap: 10,
                    backgroundColor: theme.colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width,
                    height: height,
                }}
            >
                <View style={{ padding: 16 }}>
                    <Button mode="outlined" onPress={openAuth}>
                        naver login
                    </Button>
                    <Text style={{ marginTop: 12 }}>
                        authorization_code: {code ?? 'none'}
                    </Text>
                </View>
                <Button mode="outlined" onPress={_handleMore}>
                    kakao login
                </Button>
                <Button mode="outlined" onPress={_handleMore}>
                    google login
                </Button>
                <Button mode="outlined" onPress={_handleMore}>
                    전화번호 login
                </Button>
            </View>
        </>
    );
};

export default LoginPage;

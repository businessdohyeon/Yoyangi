import { Image, Linking, useWindowDimensions, View, Alert } from 'react-native';
import {
    TouchableRipple,
    useTheme,
    Text,
    Card,
    Title,
    Paragraph,
    Portal,
    Dialog,
    TextInput,
    Button,
} from 'react-native-paper';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { ScreenProps } from '../../types/Navigation';
import apis from '../../apis';
import { LoginInfoContext } from '../../Context';
import naverLoginBtnImg from './btnG_완성형.png';
import kakaoLoginBtnImg from './kakao_login_medium_narrow.png';
import googleLoginBtnImg from './web_light_sq_SI.png';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../apis/axios';

function LoginPage({ navigation, route }: ScreenProps<'LoginPage'>) {
    const theme = useTheme();
    const { width } = useWindowDimensions();
    const { storeLoginInfo } = useContext(LoginInfoContext);
    const [phoneModalVisible, setPhoneModalVisible] = useState(false);
    const [phoneInput, setPhoneInput] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [step, setStep] = useState<1 | 2>(1);
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const rawPhone = (formatted: string) => formatted.replace(/\D/g, '');

    // format phone number as Korean style while typing: 010-1234-5678 etc.
    const formatPhone = (text: string) => {
        const digits = text.replace(/\D/g, '');
        if (digits.startsWith('02')) {
            if (digits.length <= 2) return digits;
            if (digits.length <= 5)
                return `${digits.slice(0, 2)}-${digits.slice(2)}`;
            if (digits.length <= 9)
                return `${digits.slice(0, 2)}-${digits.slice(
                    2,
                    digits.length - 4,
                )}-${digits.slice(-4)}`;
            return `${digits.slice(0, 2)}-${digits.slice(
                2,
                digits.length - 4,
            )}-${digits.slice(-4)}`;
        }
        // default: 3-4-4 grouping
        if (digits.length <= 3) return digits;
        if (digits.length <= 7)
            return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        if (digits.length <= 11)
            return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(
                7,
            )}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(
            7,
            11,
        )}`;
    };

    // mutations
    const sendMutation = useMutation({
        mutationFn: async (payload: { phone: string }) => {
            return axiosInstance.post(apis.urls.sendTelNo, payload);
        },
        onSuccess: () => {
            setStep(2);
        },
        onError: (err) => {
            console.warn('send code error', err);
            Alert.alert('오류', '인증번호 전송에 실패했습니다.');
        },
    });

    // response body type for /api/user/phone/verify
    type VerifyApiData = {
        Message: string;
        ResultCode: string;
        user: { id: number; name: string; phone: string };
        token: string;
        refreshToken: string;
    };

    const verifyMutation = useMutation<
        VerifyApiData,
        unknown,
        { name: string; phone: string; code: string }
    >({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post<VerifyApiData>(
                apis.urls.verifyTel,
                payload,
            );
            return res.data;
        },
        onSuccess: (data) => {
            setPhoneModalVisible(false);
            Alert.alert('인증 완료', '전화번호 인증이 완료되었습니다.');
            try {
                storeLoginInfo({
                    provider: 'phone' as any,
                    token: data.token,
                    refreshToken: data.refreshToken,
                    userId: Number(data.user.id),
                } as any);
            } catch (e) {
                console.warn('storeLoginInfo failed', e);
            }
            navigation.goBack();
        },
        onError: (err) => {
            console.warn('verify code error', err);
            Alert.alert('오류', '인증에 실패했습니다.');
        },
    });

    const verifyPhoneCode = async (phoneFormatted: string, code: string) => {
        const phone = rawPhone(phoneFormatted);
        const name = nameInput || '';
        if (!phone || !code) {
            Alert.alert('입력 필요', '전화번호와 인증번호를 확인해주세요.');
            return;
        }
        setVerifying(true);
        try {
            await verifyMutation.mutateAsync({ name, phone, code });
        } finally {
            setVerifying(false);
        }
    };

    // helper wrapper that calls sendMutation with correct body
    const sendPhoneCode = async (phoneFormatted: string) => {
        const phone = rawPhone(phoneFormatted);
        if (!phone) {
            Alert.alert('입력 필요', '전화번호를 입력해주세요.');
            return;
        }
        setSending(true);
        try {
            await sendMutation.mutateAsync({ phone });
        } finally {
            setSending(false);
        }
    };

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

                    const returnScreen = (route as any)?.params?.returnScreen;
                    const returnParams = (route as any)?.params?.returnParams;
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
                        {/* 전화번호 인증 버튼 */}
                        <Button
                            mode="outlined"
                            icon="phone"
                            onPress={() => {
                                setPhoneModalVisible(true);
                                setStep(1);
                                setPhoneInput('');
                                setCodeInput('');
                            }}
                            contentStyle={{ height: 52 }}
                            style={{ borderRadius: 10, marginBottom: 10 }}
                        >
                            전화번호 인증으로 계속하기
                        </Button>
                    </View>
                </Card.Content>

                {/* 전화번호 인증 모달 */}
                <Portal>
                    <Dialog
                        visible={phoneModalVisible}
                        onDismiss={() => setPhoneModalVisible(false)}
                    >
                        <Dialog.Title>전화번호 인증</Dialog.Title>
                        <Dialog.Content>
                            {step === 1 ? (
                                <>
                                    <Paragraph>
                                        휴대폰 번호를 입력하면 인증번호를
                                        전송합니다.
                                    </Paragraph>
                                    <TextInput
                                        label="휴대폰 번호"
                                        value={phoneInput}
                                        onChangeText={(t: string) =>
                                            setPhoneInput(formatPhone(t))
                                        }
                                        keyboardType="phone-pad"
                                        style={{ marginTop: 12 }}
                                    />
                                </>
                            ) : (
                                <>
                                    <Paragraph>
                                        전송된 인증번호를 입력해주세요.
                                    </Paragraph>
                                    <TextInput
                                        label="휴대폰 번호"
                                        value={phoneInput}
                                        disabled
                                        style={{ marginTop: 12 }}
                                    />
                                    <TextInput
                                        label="이름 (선택)"
                                        value={nameInput}
                                        onChangeText={setNameInput}
                                        style={{ marginTop: 12 }}
                                    />
                                    <TextInput
                                        label="인증번호"
                                        value={codeInput}
                                        onChangeText={setCodeInput}
                                        keyboardType="number-pad"
                                        style={{ marginTop: 12 }}
                                    />
                                </>
                            )}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setPhoneModalVisible(false)}>
                                취소
                            </Button>
                            {step === 1 ? (
                                <Button
                                    mode="contained"
                                    loading={sending}
                                    disabled={
                                        sending ||
                                        rawPhone(phoneInput).length < 9
                                    }
                                    onPress={async () =>
                                        await sendPhoneCode(phoneInput)
                                    }
                                >
                                    인증번호 전송
                                </Button>
                            ) : (
                                <Button
                                    mode="contained"
                                    loading={verifying}
                                    disabled={
                                        verifying || codeInput.trim().length < 4
                                    }
                                    onPress={async () =>
                                        await verifyPhoneCode(
                                            phoneInput,
                                            codeInput,
                                        )
                                    }
                                >
                                    인증 완료
                                </Button>
                            )}
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

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
}

export default LoginPage;

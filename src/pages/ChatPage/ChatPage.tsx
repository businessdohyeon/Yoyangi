import React, { useEffect, useState, useRef, useContext } from 'react';
import { ScreenProps } from '../../types/Navigation';
import {
    View,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import {
    TextInput,
    Button,
    Text,
    useTheme,
    Snackbar,
} from 'react-native-paper';
import io from 'socket.io-client';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import apis from '../../apis';

import { useRequireAuth } from '../../hooks/useRequireAuth';
import { LoginInfoContext } from '../../Context';

export default function ChatPage({ route }: ScreenProps<'ChatPage'>) {
    console.log(route.params);
    const { facility_id, facility_name } =
        route.params as any;
    const sender_type = "guardian";
    const {loginInfo} = useContext(LoginInfoContext);
    const guardian_id = loginInfo?.userId;
    const sender = loginInfo?.userId;

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const socketRef = useRef<any | null>(null);
    const theme = useTheme();
    const [socketConnected, setSocketConnected] = useState(false);
    const [socketError, setSocketError] = useState<string | null>(null);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    const { isAuthenticated } = useRequireAuth();

    useEffect(() => {
        // Use centralized socket URL from config
        const url = apis.urls.chatSocketUrl;
        console.log('init socket url', url);

        try {
            socketRef.current = io(url, { transports: ['websocket'] });

            socketRef.current.on('connect', () => {
                console.log('socket connected', socketRef.current?.id);

                setSocketConnected(true);
                setSocketError(null);
                setSnackbarVisible(false);
            });

            socketRef.current.on('connect_error', (err: any) => {
                console.warn('socket connect_error', err);
                setSocketConnected(false);
                setSocketError('서버 연결에 실패했습니다.');
                setSnackbarVisible(true);
            });

            socketRef.current.on('disconnect', (reason: any) => {
                console.warn('socket disconnected', reason);
                setSocketConnected(false);
                setSocketError('서버와의 연결이 끊겼습니다.');
                setSnackbarVisible(true);
            });

            socketRef.current.emit?.('joinRoom', { facility_id, guardian_id });

            socketRef.current.on('chatHistory', (data: any) => {
                console.log('chatHistory', data);
                setMessages(data ?? []);
            });

            socketRef.current.on('receiveMessage', (data: any) => {
                setMessages((prev) => [...prev, data]);
            });
        } catch (e) {
            console.warn('socket init failed', e);
            setTimeout(() => {
                setSocketError('소켓 초기화 중 오류가 발생했습니다.');
                setSnackbarVisible(true);
            }, 0);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off?.('connect');
                socketRef.current.off?.('connect_error');
                socketRef.current.off?.('disconnect');
                socketRef.current.off?.('chatHistory');
                socketRef.current.off?.('receiveMessage');
                socketRef.current.disconnect?.();
            }
        };
    }, [facility_id, guardian_id]);

    // 인증이 안되면 렌더링 중단 (훅은 이미 모두 호출됨)
    if (!isAuthenticated) return null;

    const sendMessage = () => {
        if (!input.trim()) return;

        const payload = {
            facility_id,
            guardian_id,
            sender,
            sender_type,
            content: input,
        };
        if (!socketConnected) {
            Alert.alert(
                '연결 오류',
                '서버에 연결되어 있지 않습니다. 잠시 후 다시 시도해주세요.',
            );
            setSocketError('서버에 연결되어 있지 않습니다.');
            setSnackbarVisible(true);
            return;
        }

        socketRef.current?.emit('sendMessage', payload);
        setInput('');
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={'상담채팅'} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                // 헤더 높이만큼 오프셋을 주어 입력창이 키보드 바로 위에 붙도록 함
            >
                <View style={styles.container}>
                    <KeyboardAwareFlatList
                        data={messages}
                        keyboardShouldPersistTaps="handled"
                        enableOnAndroid={true}
                        extraHeight={headerHeight + 30}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 10,
                        }}
                        keyExtractor={(item) =>
                            item.id?.toString() || Math.random().toString()
                        }
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent:
                                        item.sender === sender ||
                                        item.sender_id === sender ||
                                        item.sender_id?.toString() ===
                                            String(sender)
                                            ? 'flex-end'
                                            : 'flex-start',
                                }}
                            >
                                <View
                                    style={
                                        item.sender === sender ||
                                        item.sender_id === sender ||
                                        item.sender_id?.toString() ===
                                            String(sender)
                                            ? [
                                                  styles.bubble,
                                                  {
                                                      backgroundColor:
                                                          theme.colors.primary,
                                                  },
                                              ]
                                            : [
                                                  styles.bubble,
                                                  styles.bubbleOther,
                                              ]
                                    }
                                >
                                    {!(
                                        item.sender === sender ||
                                        item.sender_id === sender ||
                                        item.sender_id?.toString() ===
                                            String(sender)
                                    ) && (
                                        <Text style={styles.sender}>
                                            {`${facility_name} (#${item.sender_id})`}
                                        </Text>
                                    )}
                                    <Text
                                        style={
                                            item.sender === sender ||
                                            item.sender_id === sender ||
                                            item.sender_id?.toString() ===
                                                String(sender)
                                                ? styles.myText
                                                : styles.otherText
                                        }
                                    >
                                        {item.content}
                                    </Text>
                                </View>
                            </View>
                        )}
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            mode="outlined"
                            value={input}
                            onChangeText={setInput}
                            style={styles.input}
                            placeholder="메시지를 입력하세요"
                        />
                        <Button
                            mode="contained"
                            onPress={sendMessage}
                            style={styles.sendButton}
                        >
                            전송
                        </Button>
                    </View>

                    <Snackbar
                        visible={snackbarVisible}
                        onDismiss={() => setSnackbarVisible(false)}
                        action={{
                            label: '닫기',
                            onPress: () => setSnackbarVisible(false),
                        }}
                    >
                        {socketError ??
                            (socketConnected ? '연결됨' : '연결 안됨')}
                    </Snackbar>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    messageCard: {
        marginVertical: 5,
    },
    sender: {
        fontSize: 12,
        marginBottom: 2,
    },
    bubble: {
        padding: 10,
        borderRadius: 14,
        maxWidth: '80%',
        marginVertical: 6,
    },
    bubbleOther: {
        backgroundColor: '#eee',
    },
    myText: {
        color: '#fff',
    },
    otherText: {
        color: '#000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        marginRight: 10,
    },
    sendButton: {
        height: 50,
        justifyContent: 'center',
    },
});

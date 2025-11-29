import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
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
// import apis from '../../apis'; (not used — using direct URL for socket)

export default function ChatPage({ route }: any) {
    console.log(route.params);
    const { facility_id, guardian_id, sender, sender_type } = route.params;

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const socketRef = useRef<any | null>(null);
    const theme = useTheme();
    const [socketConnected, setSocketConnected] = useState(false);
    const [socketError, setSocketError] = useState<string | null>(null);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    useEffect(() => {
        const url = `http://43.201.248.108:8080`;
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
    };

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={'상담채팅'} />
            <View style={styles.container}>
                <FlatList
                    data={messages}
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
                                        : [styles.bubble, styles.bubbleOther]
                                }
                            >
                                {!(
                                    item.sender === sender ||
                                    item.sender_id === sender ||
                                    item.sender_id?.toString() ===
                                        String(sender)
                                ) && (
                                    <Text style={styles.sender}>
                                        ({item.sender_type}) {item.sender_id}
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
                    {socketError ?? (socketConnected ? '연결됨' : '연결 안됨')}
                </Snackbar>
            </View>
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

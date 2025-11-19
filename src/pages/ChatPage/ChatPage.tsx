import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import io from 'socket.io-client';
import apis from '../../apis';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';

export default function ChatPage({ route }) {
    console.log(route.params);
    const { facility_id, guardian_id, sender, sender_type } = route.params;

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const socketRef = useRef(null);


    useEffect(() => {
        socketRef.current = io(`${apis.urls.server}`, {
            transports: ['websocket'],
        });

        socketRef.current.emit('joinRoom', { facility_id, guardian_id });

        socketRef.current.on('chatHistory', (data) => {
            console.log("chatHistory");
            console.log(data);
            setMessages(data);
        });

        socketRef.current.on('receiveMessage', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;

        const payload = {
            facility_id,
            guardian_id,
            sender,
            sender_type,
            content: input,
        };

        socketRef.current.emit('sendMessage', payload);

        setInput('');
    };

    return (
        <>
        <GoBackHeader title={"????"}/>
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) =>
                    item.id?.toString() || Math.random().toString()
                }
                renderItem={({ item }) => (
                    <Card style={styles.messageCard}>
                        <Card.Content>
                            <Text style={styles.sender}>
                                ({item.sender_type}) {item.sender_id}
                            </Text>
                            <Text>{item.content}</Text>
                        </Card.Content>
                    </Card>
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
        </View>
        </>
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

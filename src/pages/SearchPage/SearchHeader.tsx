import { useEffect, useState, useRef } from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
    ActivityIndicator,
    Appbar,
    Button,
    Chip,
    Icon,
    IconButton,
    Searchbar,
    Text,
    Portal,
    Dialog,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import {
    start,
    stop,
    requestPermissions,
    isAvailable,
    addSpeechResultListener,
    addSpeechErrorListener,
    addSpeechEndListener,
    type SpeechResult,
} from '@dbkable/react-native-speech-to-text';
import { useNavigation } from '@react-navigation/native';
import { TabAndStackCompositeNav } from '../../types/Navigation';
import apis from '../../apis';
import axiosInstance from '../../apis/axios';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function SearchHeader({
    setSearchResults,
    kind,
    setKind,
    resetSignal,
}: {
    setSearchResults: (data: any) => void;
    kind: string[];
    setKind: React.Dispatch<React.SetStateAction<string[]>>;
    resetSignal?: number;
}) {
    const navigation =
        useNavigation<TabAndStackCompositeNav<'SearchPage', 'Tabs'>>();
    const theme = useTheme();
    const { width } = useWindowDimensions();
    const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // reset external signal: clear the search box
        setSearchQuery('');
    }, [resetSignal]);

    const searchMutation = useMutation({
        mutationFn: async (keyword: string) => {
            const response = await axiosInstance.get(apis.urls.facilities, {
                params: { keyword },
            });
            return response.data.Response;
        },
        onSuccess: (data) => {
            setSearchResults(data);
            queryClient.setQueryData(
                ['facilities', 'search', searchQuery],
                data,
            );
        },
    });

    const onSearchQuerySubmit = () => {
        console.log(`${apis.urls.facilities}?keyword=${searchQuery}`);
        searchMutation.mutate(searchQuery);
        console.log('onSubmit', searchMutation.data);
    };

    const toggleKind = (value: string) => {
        setKind((cur: string[]) => {
            if (cur.includes(value)) {
                // Prevent removing last remaining filter
                if (cur.length === 1) {
                    return cur;
                }
                return cur.filter((v) => v !== value);
            }
            return [...cur, value];
        });
    };

    console.group('SearchHeader rerendered');
    console.log({ kind });
    console.groupEnd();

    return (
        <Appbar.Header
            elevated
            style={{
                flexDirection: 'column',
                height: 'auto',
                backgroundColor: theme.colors.background,
            }}
        >
            {/* 검색박스 + 음성 버튼 */}
            <View style={{ flexDirection: 'row', alignItems: 'center', width }}>
                <View style={{ flex: 1 }}>
                    <Searchbar
                        placeholder="증상, 진료과, 병원을 검색해보세요"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        mode="view"
                        icon={'magnify'}
                        showDivider={false}
                        style={{
                            backgroundColor: theme.colors.background,
                        }}
                        onSubmitEditing={onSearchQuerySubmit}
                    />
                </View>
                <VoiceButton setSearchResults={setSearchResults} />
            </View>
            {/* 검색관련 */}
            <View style={{}}>
                {/* 위치설정 */}
                {/* TODO: ripple이 안되는데.. 흠... */}
                <TouchableRipple
                    onPress={() => {
                        navigation.navigate('EditLocationPage');
                    }}
                    style={{
                        backgroundColor: '#eeeeee',
                        paddingHorizontal: 10,
                        width: width,
                    }}
                    rippleColor="rgba(0, 0, 0, .32)"
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            marginVertical: 10,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Icon source={'map-marker'} size={20} />
                        </View>
                        <View style={{ flex: 6, justifyContent: 'center' }}>
                            <Text>현재위치</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text>변경</Text>
                        </View>
                    </View>
                </TouchableRipple>
                {/* 필터 */}
                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: theme.colors.background,
                        padding: 10,
                        paddingHorizontal: 10,
                        justifyContent: 'space-around',
                        width: width,
                    }}
                >
                    {['요양병원', '요양원', '주간보호케어센터'].map((k) => {
                        const selected = kind.includes(k);
                        return (
                            <Chip
                                key={k}
                                onPress={() => toggleKind(k)}
                                selected={selected}
                                style={{
                                    borderRadius: 16,
                                }}
                                selectedColor={
                                    selected
                                        ? theme.colors.primary
                                        : theme.colors.secondary
                                }
                            >
                                {k}
                            </Chip>
                        );
                    })}
                </View>
            </View>
        </Appbar.Header>
    );
}

function VoiceButton({
    setSearchResults,
}: {
    setSearchResults: (data: any) => void;
}) {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const theme = useTheme();

    // Listen for STT events
    useEffect(() => {
        const resultListener = addSpeechResultListener(
            (result: SpeechResult) => {
                setTranscript(result.transcript);
                console.log('Confidence:', result.confidence);
            },
        );

        const errorListener = addSpeechErrorListener((error) => {
            console.error('Speech error:', error);
            setIsListening(false);
        });

        const endListener = addSpeechEndListener(() => {
            console.log('ended');
            setIsListening(false);
        });

        return () => {
            resultListener.remove();
            errorListener.remove();
            endListener.remove();
        };
    }, []);

    // When listening stops and we have a transcript, show a preview modal briefly
    // then perform the search. This prevents immediate search and gives user feedback.
    const [showModal, setShowModal] = useState(false);
    const [listeningStarted, setListeningStarted] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isListening && (transcript || listeningStarted)) {
            // show transcript preview
            setShowModal(true);
            timerRef.current = setTimeout(async () => {
                try {
                    const usersentence = transcript;
                    const response = await axiosInstance.post(
                        apis.urls.searchVoice,
                        {
                            usersentence,
                        },
                    );
                    const result = response.data?.Response ?? response.data;

                    setSearchResults(result);
                } catch (e) {
                    console.error('voice search failed', e);
                } finally {
                    setShowModal(false);
                    setListeningStarted(false);
                    timerRef.current = null;
                }
            }, 1200);
        } else if (!isListening && transcript === '' && listeningStarted) {
            // nothing heard — briefly show modal then hide
            setShowModal(true);
            timerRef.current = setTimeout(() => {
                setShowModal(false);
                setListeningStarted(false);
                timerRef.current = null;
            }, 800);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current as any);
                timerRef.current = null;
            }
        };
    }, [isListening, transcript, setSearchResults]);

    const cancelVoice = async () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current as any);
            timerRef.current = null;
        }

        try {
            if (isListening) await stop();
        } catch (e) {
            console.error('stop failed', e);
        }

        setIsListening(false);
        setListeningStarted(false);
        setShowModal(false);
        setTranscript('');
    };

    const handleStart = async () => {
        try {
            const available = await isAvailable();
            if (!available) {
                console.log('Speech recognition not available');
                return;
            }

            const hasPermission = await requestPermissions();
            if (!hasPermission) {
                console.log('Permission denied');
                return;
            }

            await start({ language: 'ko-KR' });
            setIsListening(true);
            setTranscript('');
            setShowModal(true);
            setListeningStarted(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStop = async () => {
        try {
            await stop();
            // ensure modal stays visible until transcript is processed
            setShowModal(true);
            setIsListening(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <IconButton
                icon={isListening ? 'microphone' : 'microphone-outline'}
                size={30}
                iconColor={isListening ? theme.colors.primary : undefined}
                onPress={isListening ? handleStop : handleStart}
            />
            <Portal>
                <Dialog
                    visible={showModal}
                    onDismiss={() => setShowModal(false)}
                >
                    <Dialog.Content>
                        {isListening ? (
                            <View style={{ alignItems: 'center', padding: 12 }}>
                                <ActivityIndicator
                                    animating
                                    size={24}
                                    color={theme.colors.primary}
                                />
                                <Text style={{ marginTop: 12 }}>
                                    듣는 중...
                                </Text>
                            </View>
                        ) : transcript ? (
                            <View style={{ padding: 12 }}>
                                <Text variant="titleMedium">인식 내용</Text>
                                <Text style={{ marginTop: 8 }}>
                                    {transcript}
                                </Text>
                            </View>
                        ) : (
                            <View style={{ padding: 12 }}>
                                <Text>아무 소리를 인식하지 못했습니다.</Text>
                            </View>
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={cancelVoice}>취소</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}

import { useContext, useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Divider,
    FAB,
    Icon,
    IconButton,
    Text,
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
import apis from '../../apis';
import SearchHeader from './SearchHeader';

import { LocationInfoContext, LoginInfoContext } from '../../Context';
import {
    NaverMapMarkerOverlay,
    NaverMapView,
} from '@mj-studio/react-native-naver-map';
import {
    FacilityData_t,
    FacilityDataSchema,
} from '../../types/FacilityDataScheme';
import { FlatList } from 'react-native';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const LIMIT = 10;
const KIND_DEFAULT_VALUE = ['요양병원', '요양원', '주간보호케어센터'];

export default function SearchPage({ route }) {
    const navigation = useNavigation();
    const theme = useTheme();
    const { locationInfo } = useContext(LocationInfoContext);
    const queryClient = useQueryClient();

    console.group('SearchPage rendered');
    console.log(route.params);
    console.log(route.params?.page);
    console.log(locationInfo);
    console.groupEnd();

    const [isMapShown, setIsMapShown] = useState(false);
    const [kind, setKind] = useState<string[]>(KIND_DEFAULT_VALUE);
    const [searchResults, setSearchResults] = useState<FacilityData_t[] | null>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['facilities', locationInfo?.latitude, locationInfo?.longitude, kind],
        queryFn: async ({ pageParam = 1 }) => {
            if (!locationInfo) {
                return [];
            }

            const url =
                `${apis.urls.facilities}` +
                `?limit=${LIMIT}` +
                `&page=${pageParam}` +
                `&latitude=${locationInfo?.latitude}` +
                `&longitude=${locationInfo?.longitude}` +
                `&kind=${kind.join(',')}`;

            const res = await fetch(url);
            const json = await res.json();
            const { Response } = json;

            return Response !== null && Response !== undefined ? Response : [];
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === LIMIT ? allPages.length + 1 : undefined;
        },
        enabled: !!locationInfo && searchResults === null,
        initialPageParam: 1,
    });

    const facilityArray = searchResults !== null ? searchResults : (data?.pages.flat() || []);

    const getMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    useEffect(() => {
        console.log('!');
        setKind(route.params?.kind || KIND_DEFAULT_VALUE);
    }, [route.params]);

    useEffect(() => {
        setSearchResults(null); // 검색 결과를 초기화하고 일반 쿼리로 돌아감
        refetch();
    }, [kind]);

    return (
        <>
            <SearchHeader
                setSearchResults={setSearchResults}
                kind={kind}
                setKind={setKind}
            />
            <VoiceButton
                setSearchResults={setSearchResults}
            />
            {/* 지도 */}
                    {/* 지도 */}
            <View
                style={{
                    display: isMapShown ? 'flex' : 'none',
                    flex: 1,
                }}
            >
                {locationInfo && (
                    <NaverMapView
                        style={{ flex: 1 }}
                        initialCamera={{
                            latitude: locationInfo.latitude,
                            longitude: locationInfo.longitude,
                            zoom: 14,
                        }}
                    >
                    {facilityArray.map((facilityData) => {
                        try {
                            const parsed =
                                FacilityDataSchema.parse(facilityData);
                            console.log(parsed);

                            return (
                                <NaverMapMarkerOverlay
                                    key={parsed.id}
                                    latitude={parsed.latitude}
                                    longitude={parsed.longitude}
                                    anchor={{ x: 0.5, y: 1 }}
                                    caption={{ text: parsed.name }}
                                    onTap={() => {
                                        navigation.navigate(
                                            'FacilityDetailPage',
                                            {
                                                id: parsed.id,
                                            },
                                        );
                                    }}
                                />
                            );
                        } catch (error) {
                            console.log(facilityData);
                            console.log(error);
                            return null;
                        }
                    })}
                    </NaverMapView>
                )}
            </View>
            {/* 검색결과 목록 */}
            {!isMapShown && (
                isFetching && facilityArray.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator
                            animating={true}
                            color={theme.colors.primary}
                        />
                    </View>
                ) : (
                    <FlatList
                        data={facilityArray}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <SearchResult facilityData={item} />
                        )}
                        contentContainerStyle={{
                            padding: 10,
                            backgroundColor: '#eeeeee',
                            gap: 20,
                        }}
                        // onEndReached={getMore}
                        // onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            isFetchingNextPage ? (
                                <ActivityIndicator
                                    animating={true}
                                    color={theme.colors.primary}
                                    style={{ marginVertical: 30 }}
                                />
                            ) : hasNextPage ? (
                                <View style={{ marginBottom: 30 }}>
                                    <Button mode="outlined" onPress={getMore}>
                                        더보기
                                    </Button>
                                </View>
                            ) : null
                        }
                    />
                )
            )}
            <FAB
                icon="map"
                label="지도보기"
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                }}
                onPress={() => {
                    setIsMapShown((cur) => !cur);
                }}
            />
        </>
    );
}

function SearchResult({ facilityData }: { facilityData: FacilityData_t }) {
    const navigation = useNavigation();
    const theme = useTheme();
    const { loginInfo } = useContext(LoginInfoContext);
    const queryClient = useQueryClient();

    const userLikeMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(
                `${apis.urls.server}/user/${loginInfo.userId}/favorites/${facilityData.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${loginInfo.token}`,
                    },
                },
            );

            if (!res.ok) {
                throw new Error('Failed to like facility');
            }

            return await res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
    });

    const userLike = () => {
        userLikeMutation.mutate();
    };

    return (
        <Card
            style={{
                marginBottom: 10,
                backgroundColor: theme.colors.background,
            }}
            onPress={() => {
                navigation.navigate('FacilityDetailPage', {
                    id: facilityData.id,
                });
            }}
        >
            <Card.Content>
                <View
                    style={{
                        flexDirection: 'row',
                        marginBottom: 20,
                    }}
                >
                    <View style={{ flex: 6 }}>
                        {facilityData.approval_status ? (
                            <View>
                                <Text>"인증시설입니다"</Text>
                            </View>
                        ) : null}
                        <View>
                            <Text variant="titleMedium">
                                {facilityData.name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginRight: 10 }}>
                                <Text>별점</Text>
                            </View>
                            <View style={{ marginRight: 10 }}>
                                <Text>{`${facilityData.sggu_name} ${facilityData.sido_name}`}</Text>
                            </View>
                            <View style={{ marginRight: 10 }}>
                                <Text>{facilityData.kind}</Text>
                            </View>
                        </View>
                        <View>
                            <Text>오늘 0700-2100</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <IconButton icon={'heart-outline'} onPress={userLike} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            color="gray"
                            size={30}
                            source={'hand-heart-outline'}
                        />
                        <Text>파킨슨</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon color="gray" size={30} source={'brain'} />
                        <Text>치매</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            color="gray"
                            size={30}
                            source={'shield-cross-outline'}
                        />
                        <Text>암</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon color="gray" size={30} source={'heart'} />
                        <Text>중풍</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon size={30} source={'medication'} />
                        <Text>힌방</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
}

function VoiceButton({ setSearchResults }) {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [serverResponse, setServerResponse] = useState({});

    const voiceSearchMutation = useMutation({
        mutationFn: async (userSentence: string) => {
            const res = await fetch(`${apis.urls.server}/search/voice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usersentence: userSentence,
                }),
            });
            
            if (!res.ok) {
                throw new Error('Voice search failed');
            }
            
            const json = await res.json();
            return json.Response;
        },
        onSuccess: (data) => {
            if (data !== null && data !== undefined) {
                setSearchResults(data);
                setServerResponse(data);
            }
        },
        onError: (error) => {
            console.error('Voice search error:', error);
        },
    });

    const sendSTTResultToServer = useCallback((userSentence: string) => {
        if (!userSentence) {
            return;
        }
        voiceSearchMutation.mutate(userSentence);
    }, [voiceSearchMutation]);

    useEffect(() => {
        // Listen for results
        const resultListener = addSpeechResultListener(
            (result: SpeechResult) => {
                setTranscript(result.transcript);
                console.log('Confidence:', result.confidence);
            },
        );

        // Listen for errors
        const errorListener = addSpeechErrorListener((error) => {
            console.error('Speech error:', error);
            setIsListening(false);
        });

        // Listen for end of speech
        const endListener = addSpeechEndListener(() => {
            console.log('ended');
            setIsListening(false);
        });

        // Cleanup
        return () => {
            resultListener.remove();
            errorListener.remove();
            endListener.remove();
        };
    }, []);

    // transcript가 변경되고 listening이 끝나면 검색 실행
    useEffect(() => {
        if (!isListening && transcript) {
            sendSTTResultToServer(transcript);
        }
    }, [isListening, transcript, sendSTTResultToServer]);

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

            console.log('right before test');

            await start({ language: 'ko-KR' });
            setIsListening(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStop = async () => {
        try {
            await stop();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View>
            <Text>{'text'}</Text>
            <Text>{transcript || 'Press start to begin'}</Text>
            <Divider />
            <Text>{'결과'}</Text>
            <Text>{JSON.stringify(serverResponse)}</Text>
            <Divider />
            <Button onPress={isListening ? handleStop : handleStart}>
                {isListening ? 'Stop' : 'Start'}
            </Button>
        </View>
    );
}

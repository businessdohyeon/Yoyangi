import { useContext, useEffect, useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
    ActivityIndicator,
    Appbar,
    Button,
    Card,
    Chip,
    FAB,
    Icon,
    IconButton,
    Searchbar,
    Text,
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
import apis from '../../apis';
import axiosInstance from '../../apis/axios';

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
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

const LIMIT = 10;
const KIND_DEFAULT_VALUE = ['요양병원', '요양원', '주간보호케어센터'];

export default function SearchPage({ route }: any) {
    const navigation = useNavigation();
    const theme = useTheme();
    const { locationInfo } = useContext(LocationInfoContext);
    // queryClient not used in this component

    console.group('SearchPage rendered');
    console.log(route.params);
    console.log(route.params?.page);
    console.log(locationInfo);
    console.groupEnd();

    const [isMapShown, setIsMapShown] = useState(false);
    const [kind, setKind] = useState<string[]>(
        route?.params?.kind || KIND_DEFAULT_VALUE,
    );
    const [searchResults, setSearchResults] = useState<FacilityData_t[] | null>(
        null,
    );

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: [
            'facilities',
            locationInfo?.latitude,
            locationInfo?.longitude,
            kind,
        ],
        queryFn: async ({ pageParam = 1 }) => {
            if (!locationInfo) {
                return [];
            }

            const params = {
                limit: LIMIT,
                page: pageParam,
                latitude: locationInfo.latitude,
                longitude: locationInfo.longitude,
                kind: kind.join(','),
            };

            const response = await axiosInstance.get(apis.urls.facilities, { params });
            const { Response } = response.data;

            return Response !== null && Response !== undefined ? Response : [];
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === LIMIT ? allPages.length + 1 : undefined;
        },
        enabled: !!locationInfo && searchResults === null,
        initialPageParam: 1,
        staleTime: 30 * 1000, // 30초 캐싱
    });

    const facilityArray = useMemo(() => {
        return searchResults !== null
            ? searchResults
            : data?.pages.flat() || [];
    }, [searchResults, data]);

    const getMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    // route.params-based 초기값을 state 초기화에 반영했으므로 추가적인 effect는 제거

    // kind 변경시 검색 결과를 리셋하고 쿼리 재요청하는 helper
    const setKindAndReset = (updater: React.SetStateAction<string[]>) => {
        setKind((prev) =>
            typeof updater === 'function'
                ? (updater as Function)(prev)
                : (updater as string[]),
        );
        setSearchResults(null);
        refetch();
    };

    return (
        <>
            <SearchHeader
                setSearchResults={setSearchResults}
                kind={kind}
                setKind={setKindAndReset}
            />
            <VoiceButton setSearchResults={setSearchResults} />
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
                        {isMapShown &&
                            facilityArray.map((facilityData) => {
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
                                                (navigation as any).navigate(
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
            {!isMapShown &&
                (isFetching && facilityArray.length === 0 ? (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
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
                ))}
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
            const response = await axiosInstance.post(
                apis.urls.userLike(loginInfo.userId, facilityData.id),
                {},
                {
                    headers: {
                        Authorization: `Bearer ${loginInfo.token}`,
                    },
                },
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
    });

    const userLike = () => {
        if (!loginInfo?.token || loginInfo?.userId === 0) {
            (navigation as any).navigate('LoginPage', {
                returnScreen: 'SearchPage',
            });
            return;
        }
        userLikeMutation.mutate();
    };

    return (
        <Card
            style={{
                marginBottom: 10,
                backgroundColor: theme.colors.background,
            }}
            onPress={() => {
                (navigation as any).navigate('FacilityDetailPage', {
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

    // When listening stops and we have a transcript, perform a search using the transcript
    useEffect(() => {
        console.log(transcript);

        if (!isListening && transcript) {
            (async () => {
                try {
                    const searchQuery = transcript;
                    const url = `${
                        apis.urls.facilities
                    }?keyword=${encodeURIComponent(searchQuery)}`;
                    const response = await axiosInstance.get(url);
                    const result = response.data?.Response ?? response.data;

                    setSearchResults(result);
                } catch (e) {
                    console.error('voice search failed', e);
                }
            })();
        }
    }, [isListening, transcript, setSearchResults]);

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
        <View style={{ position: 'absolute', right: 16, top: 16, zIndex: 50 }}>
            <IconButton
                icon={isListening ? 'microphone' : 'microphone-outline'}
                size={30}
                iconColor={isListening ? theme.colors.primary : undefined}
                onPress={isListening ? handleStop : handleStart}
            />
        </View>
    );
}

export function SearchHeader({
    setSearchResults,
    kind,
    setKind,
}: {
    setSearchResults: (data: any) => void;
    kind: string[];
    setKind: React.Dispatch<React.SetStateAction<string[]>>;
}) {
    const navigation = useNavigation();
    const theme = useTheme();
    const { width } = useWindowDimensions();
    const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState('');

    const searchMutation = useMutation({
        mutationFn: async (keyword: string) => {
            const response = await axiosInstance.get(
                apis.urls.facilities,
                { params: { keyword } },
            );
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
        setKind((cur: string[]) =>
            cur.includes(value)
                ? cur.filter((v) => v !== value)
                : [...cur, value],
        );
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
            {/* 검색박스 */}
            <Searchbar
                placeholder="증상, 진료과, 병원을 검색해보세요"
                onChangeText={setSearchQuery}
                value={searchQuery}
                mode="view"
                icon={'magnify'}
                showDivider={false}
                style={{
                    backgroundColor: theme.colors.background,
                    // ...showBorder
                }}
                onSubmitEditing={onSearchQuerySubmit}
                // autoFocus={true}
            />
            {/* 검색관련 */}
            <View style={{}}>
                {/* 위치설정 */}
                {/* TODO: ripple이 안되는데.. 흠... */}
                <TouchableRipple
                    onPress={() => {
                        (navigation as any).navigate('EditLocationPage');
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
                    <Chip
                        onPress={() => toggleKind('요양병원')}
                        selected={kind.includes('요양병원')}
                    >
                        요양병원
                    </Chip>

                    <Chip
                        onPress={() => toggleKind('요양원')}
                        selected={kind.includes('요양원')}
                    >
                        요양원
                    </Chip>

                    <Chip
                        onPress={() => toggleKind('주간보호케어센터')}
                        selected={kind.includes('주간보호케어센터')}
                    >
                        주간보호케어센터
                    </Chip>
                </View>
            </View>
        </Appbar.Header>
    );
}

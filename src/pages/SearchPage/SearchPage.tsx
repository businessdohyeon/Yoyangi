import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    FAB,
    Icon,
    IconButton,
    Text,
    useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import apis from '../../apis';
import SearchHeader from './SearchHeader';

import { LocationInfoContext, LoginInfoContext } from '../../Context';
import {
    NaverMapMarkerOverlay,
    NaverMapView,
} from '@mj-studio/react-native-naver-map';
import { FacilityData_t } from '../../types/FacilityDataScheme';
import { FlatList } from 'react-native';

const LIMIT = 10;

export default function SearchPage() {
    const navigation = useNavigation();
    const theme = useTheme();
    const { locationInfo } = useContext(LocationInfoContext);

    const [isLoading, setIsLoading] = useState(true);
    const [facilityArray, setFacilityArray] = useState<FacilityData_t[]>([]);
    const [isMapShown, setIsMapShown] = useState(false);

    const [page, setPage] = useState(1);
    const [kind, setKind] = useState<string[]>(['요양병원']);

    const fetchFacilites = async (targetPage: number, resetFlag: boolean) => {
        setIsLoading(true);

        try {
            const url =
                `${apis.urls.facilities}` +
                `?limit=${LIMIT}` +
                `&page=${targetPage}` +
                `&latitude=${locationInfo?.latitude}` +
                `&longitude=${locationInfo?.longitude}` +
                `&kind=${kind.join(',')}`;

            const res = await fetch(url);
            const json = await res.json();
            const { Response } = json;

            if (Response !== null && Response !== undefined) {
                setFacilityArray((cur) =>
                    resetFlag ? Response : [...cur, ...Response],
                );
                setPage(targetPage + 1);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getMore = () => {
        fetchFacilites(page, false);
    };

    useEffect(() => {
        fetchFacilites(1, true);
    }, [kind, locationInfo]);

    return (
        <>
            <SearchHeader
                setFacilityArray={setFacilityArray}
                kind={kind}
                setKind={setKind}
            />
            {/* 지도 */}
            <View
                style={{
                    display: isMapShown ? 'flex' : 'none',
                    flex: 1,
                }}
            >
                <NaverMapView
                    style={{ flex: 1 }}
                    initialCamera={{
                        latitude: locationInfo.latitude,
                        longitude: locationInfo.longitude,
                        zoom: 14,
                    }}
                >
                    {Array.isArray(facilityArray) &&
                        facilityArray.map((facilityData) => {
                            return (
                                <NaverMapMarkerOverlay
                                    key={facilityData.id}
                                    latitude={facilityData.latitude}
                                    longitude={facilityData.longitude}
                                    anchor={{ x: 0.5, y: 1 }}
                                    caption={{ text: facilityData.name }}
                                    onTap={() => {
                                        navigation.navigate(
                                            'FacilityDetailPage',
                                            {
                                                id: facilityData.id,
                                            },
                                        );
                                    }}
                                />
                            );
                        })}
                </NaverMapView>
            </View>
            {/* 검색결과 목록 */}
            {!isMapShown && (
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
                        isLoading ? (
                            <ActivityIndicator
                                animating={true}
                                color={theme.colors.primary}
                                style={{ marginVertical: 30 }}
                            />
                        ) : (
                            <View style={{ marginBottom: 30 }}>
                                <Button mode="outlined" onPress={getMore}>
                                    더보기
                                </Button>
                            </View>
                        )
                    }
                />
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

    const userLike = async () => {
        try {
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

            const data = await res.json();

            if (!res.ok) {
                return;
            }
        } catch (err) {
            console.log(err);
        }
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

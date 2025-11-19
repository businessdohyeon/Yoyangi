import { useContext, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
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
// import { showBorder } from "./common.js"
import apis from '../../apis';
import SearchHeader from './SearchHeader';

import { LocationInfoContext, LoginInfoContext } from '../../Context';
import {
    NaverMapMarkerOverlay,
    NaverMapView,
} from '@mj-studio/react-native-naver-map';
import { FacilityData_t } from '../../types/FacilityDataScheme';

const LIMIT = 10;

// TODO: 라우팅 파라미터로 받아서 하는 게 좋나...?
// TODO: 앱바에서 검색버튼 클릭해서 들어오는 경우엔 searchbar에 autofocus?
export default function SearchPage() {
    const navigation = useNavigation();
    const theme = useTheme();
    const { locationInfo } = useContext(LocationInfoContext);

    const [isLoading, setIsLoading] = useState(true);
    const [facilityArray, setFacilityArray] = useState<FacilityData_t[]>([]);
    const [isMapShown, setIsMapShown] = useState(false);

    // query params
    const [page, setPage] = useState(1);
    const [kind, setKind] = useState('요양병원');
    // const [searchQuery, setSearchQuery] = useState('');

    console.group('SearchPage rerendered');
    console.log({ facilityArray });
    console.groupEnd();

    const fetchFacilites = async (targetPage: number, resetFlag: boolean) => {
        setIsLoading(true);

        try {
            const url =
                `${apis.urls.facilities}` +
                `?limit=${LIMIT}` +
                `&page=${targetPage}` +
                `&latitude=${locationInfo?.latitude}` +
                `&longitude=${locationInfo?.longitude}` +
                `&kind=${kind}`;

            const res = await fetch(url);
            const json = await res.json();

            // const json = apis.mock.getFacilities();

            console.log(url);
            console.log(json);

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
        } finally {
        }
    };

    const getMore = () => {
        fetchFacilites(page, false);
    };

    useEffect(() => {
        console.group('plain useEffect');

        fetchFacilites(1, true);

        console.groupEnd();
    }, [kind, locationInfo]);

    return (
        <>
            <SearchHeader
                setFacilityArray={setFacilityArray}
                kind={kind}
                setKind={setKind}
            />
            <View
                style={{
                    display: isMapShown ? 'flex' : 'none',
                    flex: 1,
                    // padding: 20,
                }}
            >
                <NaverMapView
                    style={{ flex: 1 }}
                    // initialRegion={{
                    //     latitudeDelta: 0.00,
                    //     longitudeDelta: 0.00,
                    // }}
                    initialCamera={{
                        latitude: locationInfo.latitude,
                        longitude: locationInfo.longitude,
                        zoom: 14,
                    }}
                >
                    {facilityArray.map((facilityData) => {
                        return (
                            <NaverMapMarkerOverlay
                                key={facilityData.id}
                                latitude={facilityData.latitude}
                                longitude={facilityData.longitude}
                                anchor={{ x: 0.5, y: 1 }}
                                caption={{ text: facilityData.name }}
                                onTap={() => {
                                    navigation.navigate('FacilityDetailPage', {
                                        id: facilityData.id,
                                    });
                                }}
                            />
                        );
                    })}
                </NaverMapView>
            </View>
            <ScrollView
                style={{ display: isMapShown ? 'none' : 'flex' }}
                contentContainerStyle={{
                    gap: 20,
                    backgroundColor: '#eeeeee',
                    columnGap: 30,
                }}
            >
                {/* 목록 */}
                <View style={{ padding: 10, gap: 10 }}>
                    {facilityArray.map((facilityData) => {
                        return (
                            <SearchResult
                                key={facilityData.id}
                                facilityData={facilityData}
                            />
                        );
                    })}
                    {isLoading && (
                        <ActivityIndicator
                            animating={true}
                            color={theme.colors.primary}
                            style={{ marginVertical: 30 }}
                        />
                    )}
                    {/* 검색결과 컴포넌트 */}
                </View>
                <MoreButton onPress={getMore} />
            </ScrollView>
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
    const { loginInfo} = useContext(LoginInfoContext);

    useEffect(() => {
        fetch(apis.urls.getFacilityById(facilityData.id))
            .then((res) => res.json())
            .then((json) => console.log(json));

        // const json = apis.mock.getFacilityById();
        // console.log(json);
    }, []);

    const userLike = async () => {
        // const res = await fetch(apis.urls.userLike())
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
            
            console.log(res);
            console.log(data);

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
                // fetch(apis.urls.getFacilityById(facility.id))
                //     .then((res) => res.json())
                //     .then((json) => console.log(json));
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
                            <View style={{}}>
                                <Text>"인증시설입니다"</Text>
                            </View>
                        ) : null}
                        <View style={{}}>
                            <Text variant="titleMedium">
                                {facilityData.name}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            {/* TODO: 별점 */}
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
                        <View style={{}}>
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

function MoreButton({ onPress }: any) {
    return (
        <View
            style={{
                marginTop: 10,
                marginBottom: 30,
                paddingHorizontal: 10,
            }}
        >
            <Button mode="outlined" onPress={onPress}>
                더보기
            </Button>
        </View>
    );
}

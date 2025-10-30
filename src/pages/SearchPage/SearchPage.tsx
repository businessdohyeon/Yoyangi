import { useEffect, useState } from 'react';
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
import { NaverMapView } from '@mj-studio/react-native-naver-map';

export default function SearchPage() {
    const navigation = useNavigation();
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState(true);
    const [facilityArray, setFacilityArray] = useState([]);
    const [isMapShown, setIsMapShown] = useState(false);

    useEffect(() => {
        // Geolocation.getCurrentPosition((info) => {
        //     console.log(info);
        //     const { coords } = info;
        //     const { latitude, longitude } = coords;

        //     console.log([latitude, longitude]);
        //     fetch(
        //         `${apis.urls.server}/facilities?latitude=${latitude}&longitude=${longitude}`,
        //     )
        //         .then((res) => res.json())
        //         .then((json) => {
        //             console.log("walalalaal")
        //             console.log(json)
        //         });
        // });

        // fetch(apis.urls.facilities)
        //     .then((res) => res.json())
        //     .then((json) => {
        //         console.log(json);
        //         setFacilityArray(json.Response);
        //         setIsLoading(false);
        //     });

        const res = apis.mock.getFacilities();
        setFacilityArray(res.Response);
        setIsLoading(false);
    }, []);

    console.log(facilityArray);

    // Geolocation.getCurrentPosition(info => console.log(info));

    // console.log(apiurl.facilities);

    return (
        <>
            <SearchHeader setFacilityArray={setFacilityArray} />
            {/* <View
                style={{
                    display: isMapShown ? 'flex' : 'none',
                    flex: 1,
                    // padding: 20,
                }}
            >
                <NaverMapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: 37.5665,
                        longitude: 126.978,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                />
            </View> */}
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
                    {isLoading ? (
                        <ActivityIndicator
                            animating={true}
                            color={theme.colors.primary}
                        />
                    ) : (
                        facilityArray.map((facilityData) => {
                            return (
                                <SearchResult
                                    key={facilityData.id}
                                    facilityData={facilityData}
                                />
                            );
                        })
                    )}
                    {/* 검색결과 컴포넌트 */}
                </View>
                <MoreButton />
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

function SearchResult({ facilityData }) {
    const navigation = useNavigation();
    const theme = useTheme();

    useEffect(() => {
        // fetch(apis.urls.getFacilityById(facility.id))
        //     .then((res) => res.json())
        //     .then((json) => console.log(json));

        const json = apis.mock.getFacilityById();
        // console.log(json);
    }, []);

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
                                <Text>요양병원</Text>
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
                        <IconButton icon={'heart-outline'} onPress={() => {}} />
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

function MoreButton() {
    return (
        <View
            style={{
                marginTop: 10,
                marginBottom: 30,
                paddingHorizontal: 10,
            }}
        >
            <Button
                mode="outlined"
                onPress={() => {
                    // TODO
                }}
            >
                더보기
            </Button>
        </View>
    );
}

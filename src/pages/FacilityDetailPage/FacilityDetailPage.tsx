import { useContext, useEffect, useRef, useState } from 'react';
import { Image, ScrollView, useWindowDimensions, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Icon,
    IconButton,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';

import { showBorder } from '../../common';
import apis from '../../apis';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GoBackHeader from './GoBackHeader';
import { LoginInfoContext } from '../../Context';
import {
    FacilityData_t,
    FacilityDataSchema,
} from '../../types/FacilityDataScheme';
import { FacilityNotice } from './FacilityNotice';
import { FacilityReview } from './FacilityReview';
import { tileData } from './data';

export default function FacilityDetailPage({ route }) {
    const theme = useTheme();
    const { loginInfo } = useContext(LoginInfoContext);
    const { id } = route.params;
    const scrollRef = useRef<ScrollView>();

    const [facilityData, setFacilityData] = useState<FacilityData_t>({});
    const [isLoading, setIsLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);

    console.group('[rerender]: FacilityDetailPage');
    console.log({ id });
    console.log(loginInfo);
    console.groupEnd();

    const fetchFacilityData = async () => {
        // setOsloading(ture) ??

        try {
            const res = await fetch(apis.urls.getFacilityById(id));
            const json = await res.json();
            const { Response } = json;
            const tmp = FacilityDataSchema.parse(Response);

            console.group('fetchFacilityData');
            console.log(tmp);
            console.groupEnd();

            setFacilityData(tmp);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        } finally {
        }
    };

    useEffect(() => {
        fetchFacilityData();
    }, []);

    return (
        <>
            <GoBackHeader title={facilityData.name} />
            <ScrollView
                contentContainerStyle={{
                    backgroundColor: '#eeeeee',
                }}
            >
                {isLoading ? (
                    <ActivityIndicator style={{ marginVertical: 50 }} />
                ) : (
                    <>
                        {/* kinda hero section */}
                        <View
                            style={{ backgroundColor: theme.colors.background }}
                        >
                            {/* banner */}
                            <View style={{}}>
                                <View style={{ height: 350, flex: 1 }}>
                                    <Image
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC"
                                        style={{ flex: 1 }}
                                    />
                                </View>
                            </View>
                            {/* 주요 정보들 */}
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: theme.colors.background,
                                }}
                            >
                                <View style={{ flex: 5, padding: 10 }}>
                                    {!facilityData.approval_status ? (
                                        <View style={{}}>
                                            <Text>"인증시설입니다"</Text>
                                        </View>
                                    ) : null}
                                    <View style={{}}>
                                        <Text variant="titleLarge">
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
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                    }}
                                >
                                    <IconButton
                                        icon={'heart'}
                                        onPress={() => console.log('Pressed')}
                                        size={30}
                                    />
                                </View>
                            </View>
                            {/* 주소랑 당일 운영시간 */}
                            {/* // TODO: add link to the part */}
                            <View style={{ padding: 10 }}>
                                <View>
                                    <Text>{facilityData.address}</Text>
                                </View>
                                <View>
                                    <Text>대충 운영시간</Text>
                                </View>
                                <View>
                                    <Text>{facilityData.url || 'url...'}</Text>
                                </View>
                            </View>
                            {/* 타일 정보판 */}
                            <View
                                style={{
                                    height: 250,
                                    backgroundColor: '#eeeeee',
                                    marginVertical: 20,
                                }}
                            >
                                {tileData.map((row, idx) => {
                                    return (
                                        <View
                                            key={`tileDataRow${idx}`}
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            {row.map((item) => (
                                                <View
                                                    key={item.label}
                                                    style={{
                                                        flex: 1,
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Icon
                                                        source={item.iconSource}
                                                        size={40}
                                                        color={item.iconColor}
                                                    />
                                                    <Text variant="labelSmall">
                                                        {item.label}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                        {/* 이동버튼 */}
                        <View
                            style={{
                                ...showBorder,
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                backgroundColor: theme.colors.background,
                                overflow: 'visible',
                            }}
                        >
                            <TouchableRipple
                                style={{
                                    flex: 1,
                                    borderBottomWidth: 10,
                                    borderBottomColor:
                                        tabIndex === 0
                                            ? theme.colors.primary
                                            : '#dddddd',
                                    backgroundColor: theme.colors.background,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setTabIndex(0);
                                }}
                            >
                                <Text
                                    style={{ marginVertical: 5 }}
                                    variant="titleMedium"
                                >
                                    병원정보
                                </Text>
                            </TouchableRipple>
                            <TouchableRipple
                                style={{
                                    flex: 1,
                                    borderBottomWidth: 10,
                                    borderBottomColor:
                                        tabIndex === 1
                                            ? theme.colors.primary
                                            : '#dddddd',
                                    backgroundColor: theme.colors.background,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setTabIndex(1);
                                }}
                            >
                                <Text
                                    style={{ marginVertical: 5 }}
                                    variant="titleMedium"
                                >
                                    병원소식
                                </Text>
                            </TouchableRipple>
                            <TouchableRipple
                                style={{
                                    flex: 1,
                                    borderBottomWidth: 10,
                                    borderBottomColor:
                                        tabIndex === 2
                                            ? theme.colors.primary
                                            : '#dddddd',
                                    backgroundColor: theme.colors.background,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setTabIndex(2);
                                }}
                            >
                                <Text
                                    style={{ marginVertical: 5 }}
                                    variant="titleMedium"
                                >
                                    후기
                                </Text>
                            </TouchableRipple>
                        </View>
                        {/* 구체적인 정보들 */}
                        <ScrollView
                            pagingEnabled
                            horizontal={true}
                            style={{
                                backgroundColor: '#eeeeee',
                                paddingBottom: 10,
                            }}
                            ref={scrollRef}
                        >
                            {/* 병원정보 */}
                            {tabIndex === 0 ? (
                                // <FacilityInfo facilityData={facilityData} />
                                <Text>adf</Text>
                            ) : tabIndex === 1 ? (
                                <FacilityNotice facilityData={facilityData} />
                            ) : (
                                <FacilityReview facilityData={facilityData} />
                            )}
                        </ScrollView>
                        {/* 버그신고등등등 */}
                        <View
                            style={{ paddingBottom: 50, paddingHorizontal: 10 }}
                        >
                            <TouchableRipple
                                onPress={() => {
                                    console.log('bla');
                                }}
                            >
                                <Text>알고계신 병원 정보와 다른가요?</Text>
                            </TouchableRipple>
                            <TouchableRipple
                                onPress={() => {
                                    console.log('bla');
                                }}
                            >
                                <Text>이 병원의 관계자이신가요?</Text>
                            </TouchableRipple>
                        </View>
                    </>
                )}
            </ScrollView>
            {/* footer */}
            <Footer facilityData={facilityData} />
        </>
    );
}

function Footer({ facilityData }: { facilityData: FacilityData_t }) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const theme = useTheme();

    return (
        <View
            style={{
                ...showBorder,
                flexDirection: 'row',
                height: 80,
                backgroundColor: theme.colors.background,
                paddingBottom: insets.bottom,
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <IconButton icon={'heart'} size={30} onPress={() => {}} />
            </View>
            <View
                style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button
                    icon={'heart'}
                    onPress={() => {
                        navigation.navigate('ReservationPage', {
                            facilityId: facilityData.id,
                            facilityName: facilityData.name,
                        });
                    }}
                    style={{}}
                >
                    예약
                </Button>
            </View>
            <View
                style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button icon={'phone'} onPress={() => {}}>
                    상담전화걸기
                </Button>
            </View>
            <View
                style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button
                    icon={'phone'}
                    onPress={() => {
                        navigation.navigate('ReviewForm', {
                            facilityId: facilityData.id,
                            facilityName: facilityData.name,
                        });
                    }}
                >
                    후기작성
                </Button>
            </View>
        </View>
    );
}

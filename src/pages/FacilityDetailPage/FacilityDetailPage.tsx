import { useContext, useEffect, useRef, useState } from 'react';
import { Image, ScrollView, useWindowDimensions, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Icon,
    IconButton,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';

// import { showBorder } from "./common.js"
import { showBorder } from '../../common';
import apis from '../../apis';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GoBackHeader from './GoBackHeader';
import { LoginTokenContext } from '../../Context';

const tileData = [
    [
        {
            label: '여가활동',
            iconSource: 'soccer',
            iconColor: 'gray',
        },
        {
            label: 'VIP병실',
            iconSource: 'star-circle',
            iconColor: 'gray',
        },
        {
            label: '최신장비',
            iconSource: 'monitor-dashboard',
            iconColor: 'gray',
        },
        {
            label: '셔틀운영',
            iconSource: 'bus',
            iconColor: 'gray',
        },
        {
            label: '보호자상주가능',
            iconSource: 'account-heart',
            iconColor: 'gray',
        },
    ],
    [
        {
            label: '여성병동',
            iconSource: 'gender-female',
            iconColor: 'gray',
        },
        {
            label: '산책로',
            iconSource: 'walk',
            iconColor: 'gray',
        },
        {
            label: '숲속병동',
            iconSource: 'tree',
            iconColor: 'gray',
        },
        {
            label: '근처병원위치',
            iconSource: 'hospital-building',
            iconColor: 'gray',
        },
        {
            label: '보험상담',
            iconSource: 'clipboard-account',
            iconColor: 'gray',
        },
    ],
    [
        {
            label: '파킨슨전문',
            iconSource: 'hand-heart-outline',
            iconColor: 'gray',
        },
        {
            label: '치매전문',
            iconSource: 'brain',
            iconColor: 'gray',
        },
        {
            label: '암전문',
            iconSource: 'shield-cross-outline',
            iconColor: 'gray',
        },
        {
            label: '중풍전문',
            iconSource: 'heart',
            iconColor: 'gray',
        },
        {
            label: '한방치료',
            iconSource: 'medication',
            iconColor: 'gray',
        },
    ],
];

const FacilityDetailPage = ({ route }) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const theme = useTheme();
    const { width: viewportWidth } = useWindowDimensions();
    const { loginToken } = useContext(LoginTokenContext);

    const [facilityData, setFacilityData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReview] = useState([]);
    const [value, setValue] = useState('walk');

    const [tabIndex, setTabIndex] = useState(0);

    const scrollRef = useRef<ScrollView>();

    const { id } = route.params;
    console.log('loginToken', loginToken);

    // 그냥 상태 하나 잡고 아예 랜더링 하는 항목을 바꾸거나 할까...
    useEffect(() => {
        console.log('value', value);

        if (value === 'walk') {
            scrollRef.current?.scrollTo({
                y: 0 * viewportWidth,
                animated: true,
            });
        } else if (value === 'train') {
            scrollRef.current?.scrollTo({
                y: 1 * viewportWidth,
                animated: true,
            });
        } else if (value === 'drive') {
            scrollRef.current?.scrollTo({
                y: 2 * viewportWidth,
                animated: true,
            });
        } else {
            // no nothin'
        }
    }, [value]);

    console.log(route.params);
    console.log(reviews);

    const tmp = async () => {
        {
            // const res = await fetch(apis.urls.getFacilityById(id));
            // const json = await res.json();
            // console.log(json);

            const json = apis.mock.getFacilityById();
            console.log('getFacilityById', json);
            setFacilityData(json);
        }

        // {
        //     const res = await fetch(apis.urls.getFacilityReviewById(id));
        //     const json = await res.json();
        //     console.log(json);
        //     setReview(json.Reviews);
        // }

        setIsLoading(false);
    };

    useEffect(() => {
        tmp();
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
                        {/* info */}
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
                                    variant="titleLarge"
                                >
                                    0
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
                                    variant="titleLarge"
                                >
                                    1
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
                                    variant="titleLarge"
                                >
                                    2
                                </Text>
                            </TouchableRipple>
                        </View>
                        {/* 구체적인 정보들 */}
                        <ScrollView
                            pagingEnabled
                            horizontal={true}
                            style={{ backgroundColor: '#eeeeee' }}
                            ref={scrollRef}
                        >
                            {/* 병원정보 */}
                            {tabIndex === 0 && (
                                <View
                                    style={{
                                        width: viewportWidth,
                                        gap: 20,
                                    }}
                                >
                                    {/* 인력정보 */}
                                    <View
                                        style={{
                                            backgroundColor:
                                                theme.colors.background,
                                            padding: 10,
                                        }}
                                    >
                                        <View style={{ marginVertical: 10 }}>
                                            <Text variant="bodyLarge">
                                                인력정보
                                            </Text>
                                        </View>
                                        <View style={{}}>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        justifyContent:
                                                            'space-around',
                                                    }}
                                                >
                                                    <Text>일반의</Text>
                                                    <Text>{`${facilityData.facility_status.doctor_count}명`}</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        justifyContent:
                                                            'space-around',
                                                    }}
                                                >
                                                    <Text>전공의</Text>
                                                    <Text>00명</Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        justifyContent:
                                                            'space-around',
                                                    }}
                                                >
                                                    <Text>요양보호사</Text>
                                                    <Text>00명</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    {/* 진료시간 */}
                                    <View
                                        style={{
                                            backgroundColor:
                                                theme.colors.background,
                                            padding: 10,
                                        }}
                                    >
                                        <View style={{}}>
                                            <Text>진료시간</Text>
                                        </View>
                                        <View style={{}}>
                                            <Text>
                                                오늘의 진료는 종료했어요
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>오늘(화요일)</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>0700-2100</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>점심시간</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>0700-2100</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ ...showBorder }}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>x요일</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>점심시간</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>x요일</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>점심시간</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>x요일</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>점심시간</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>x요일</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>점심시간</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>x요일</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>점심시간</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>x요일</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>점심시간</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>0700-2100</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    {/* 병원소개 */}
                                    <View
                                        style={{
                                            backgroundColor:
                                                theme.colors.background,
                                            padding: 10,
                                        }}
                                    >
                                        <View style={{}}>
                                            <Text variant="titleMedium">
                                                병원소개
                                            </Text>
                                        </View>
                                        <View style={{}}>
                                            <Text>
                                                {facilityData.description ||
                                                    '...'}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* 주소정보 w.지도 */}
                                    <View
                                        style={{
                                            backgroundColor:
                                                theme.colors.background,
                                            padding: 10,
                                        }}
                                    >
                                        {/* // TODO: 지도임배딩 */}
                                        <View style={{ ...showBorder }}>
                                            <Text>일단지도</Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{ flex: 6 }}>
                                                <Text>
                                                    {facilityData.address}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    ...showBorder,
                                                    flex: 1,
                                                }}
                                            >
                                                <Text>복사</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {/* 전화번호 */}
                                    <View
                                        style={{
                                            backgroundColor:
                                                theme.colors.background,
                                            padding: 10,
                                        }}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <Text>
                                                밑의 전화걸기를 클릭하면 바로
                                                전화를 걸 수 있어요
                                            </Text>
                                            <Text>{facilityData.telno}</Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{ flex: 6 }}>
                                                <Text>도로명</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text>복사</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {/* 병원소식 */}
                            {tabIndex === 1 && (
                                <View
                                    style={{
                                        ...showBorder,
                                        width: viewportWidth,
                                        backgroundColor:
                                            theme.colors.background,
                                    }}
                                >
                                    <View style={{ ...showBorder }}>
                                        <View style={{ ...showBorder }}>
                                            <Text>오늘의 메뉴</Text>
                                        </View>
                                        <View style={{ ...showBorder }}>
                                            <View
                                                style={{
                                                    ...showBorder,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 3,
                                                    }}
                                                >
                                                    <Text>CommunityRoute</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 5,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>
                                                            아침: 대표메뉴
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>나머지</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>나머지</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>나머지</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    ...showBorder,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 3,
                                                    }}
                                                >
                                                    <Text>CommunityRoute</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 5,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>
                                                            아침: 대표메뉴
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>나머지</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>나머지</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>나머지</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    ...showBorder,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 3,
                                                    }}
                                                >
                                                    <Text>CommunityRoute</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 5,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>
                                                            아침: 대표메뉴
                                                        </Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>나머지</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>나머지</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>나머지</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ ...showBorder }}>
                                            <Text>일주일식단표</Text>
                                        </View>
                                        <View
                                            style={{
                                                ...showBorder,
                                                height: 150,
                                            }}
                                        >
                                            <Image
                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC"
                                                style={{ flex: 1 }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ ...showBorder }}>
                                        <View style={{ ...showBorder }}>
                                            <Text>병원소식</Text>
                                        </View>
                                        <View style={{ ...showBorder }}>
                                            <View style={{ ...showBorder }}>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        height: 250,
                                                    }}
                                                >
                                                    <Image
                                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC"
                                                        style={{ flex: 1 }}
                                                    />
                                                </View>
                                                <View style={{ ...showBorder }}>
                                                    <Text>제목</Text>
                                                </View>
                                                <View style={{ ...showBorder }}>
                                                    <Text>줄글</Text>
                                                </View>
                                            </View>
                                            <View style={{ ...showBorder }}>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        height: 250,
                                                    }}
                                                >
                                                    <Image
                                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC"
                                                        style={{ flex: 1 }}
                                                    />
                                                </View>
                                                <View style={{ ...showBorder }}>
                                                    <Text>제목</Text>
                                                </View>
                                                <View style={{ ...showBorder }}>
                                                    <Text>줄글</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ ...showBorder }}>
                                            <Button
                                                icon="camera"
                                                mode="contained"
                                                onPress={() =>
                                                    console.log('Pressed')
                                                }
                                                style={{ flex: 1 }}
                                            >
                                                더보기
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {/* 후기 */}
                            {tabIndex === 2 && (
                                <View
                                    style={{
                                        ...showBorder,
                                        width: viewportWidth,
                                        backgroundColor:
                                            theme.colors.background,
                                    }}
                                >
                                    <View style={{ ...showBorder }}>
                                        <View style={{ ...showBorder }}>
                                            <Text>리뷰(120)</Text>
                                        </View>
                                        <View
                                            style={{
                                                ...showBorder,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    ...showBorder,
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View style={{ ...showBorder }}>
                                                    <Text>4.0</Text>
                                                </View>
                                                <View style={{ ...showBorder }}>
                                                    <Text>별개수</Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    ...showBorder,
                                                    flex: 3,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>매우만족</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>게이지바</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>00명</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>매우만족</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>게이지바</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>00명</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>매우만족</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>게이지바</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>00명</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>매우만족</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>게이지바</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>00명</Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>매우만족</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>게이지바</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>00명</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ ...showBorder }}>
                                            <View
                                                style={{
                                                    ...showBorder,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>진료결과</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>만죽해요</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>xxx%(00명)</Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    ...showBorder,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>진료결과</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>만죽해요</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>xxx%(00명)</Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    ...showBorder,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>진료결과</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>만죽해요</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Text>xxx%(00명)</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ ...showBorder }}>
                                        {/* 후기컴포넌트 */}
                                        <Card
                                            onPress={() =>
                                                console.log('card pressed')
                                            }
                                        >
                                            {/* TODO: 개조해야할지도 */}
                                            <Card.Cover
                                                source={{
                                                    uri: 'https://picsum.photos/700',
                                                }}
                                            />
                                            <Card.Content>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>☆☆☆☆☆</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>4.0</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                        }}
                                                    >
                                                        <Text>만족해요</Text>
                                                    </View>
                                                </View>
                                                <View style={{ ...showBorder }}>
                                                    <Text>인증됨</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        ...showBorder,
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>깨끗해요</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>친절해요</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...showBorder,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <Text>
                                                            최신시설이에요
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ ...showBorder }}>
                                                    <Text>
                                                        어쩌구저쩌구어쩌구
                                                        ...더보기
                                                    </Text>
                                                </View>
                                            </Card.Content>
                                            <Card.Actions>
                                                <Button
                                                    icon="camera"
                                                    mode="contained"
                                                    onPress={() =>
                                                        console.log('Pressed')
                                                    }
                                                    style={{ flex: 1 }}
                                                >
                                                    신고하기
                                                </Button>
                                            </Card.Actions>
                                        </Card>
                                        <View style={{ ...showBorder }}>
                                            <Button
                                                icon="camera"
                                                mode="contained"
                                                onPress={() =>
                                                    console.log('Pressed')
                                                }
                                                style={{ flex: 1 }}
                                            >
                                                더보기
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                        {/* 버그신고등등등 */}
                        <View style={{ ...showBorder }}>
                            <View style={{ ...showBorder }}>
                                <Text>알고계신 병원 정보와 다른가요?</Text>
                            </View>
                            <View style={{ ...showBorder }}>
                                <Text>이 병원의 관계자이신가요?</Text>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
            {/* footer */}
            <Footer facilityData />
        </>
    );
};

export default FacilityDetailPage;

function Footer({ facilityData }) {
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
                            id: facilityData.id,
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
        </View>
    );
}

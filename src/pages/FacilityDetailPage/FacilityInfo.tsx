import {
    useWindowDimensions,
    View,
    Platform,
    Alert,
    ToastAndroid,
} from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import { FacilityData_t } from '../../types/FacilityDataScheme';
import {
    NaverMapMarkerOverlay,
    NaverMapView,
} from '@mj-studio/react-native-naver-map';

type prop = { facilityData: FacilityData_t };

export function FacilityInfo({ facilityData }: prop) {
    const theme = useTheme();
    const { width: viewportWidth } = useWindowDimensions();
    const weekdays = [
        '일요일',
        '월요일',
        '화요일',
        '수요일',
        '목요일',
        '금요일',
        '토요일',
    ];
    const todayWeekday = weekdays[new Date().getDay()];

    return (
        <View
            style={{
                width: viewportWidth,
                gap: 10,
            }}
        >
            {/* 인력정보 */}
            <StaffInfo facilityData={facilityData} />
            {/* 진료시간 */}
            <View
                style={{
                    backgroundColor: theme.colors.background,
                    padding: 10,
                    gap: 10,
                }}
            >
                <View style={{}}>
                    <Text variant="titleMedium">진료시간</Text>
                </View>
                <View
                    style={{
                        backgroundColor: theme.colors.primaryContainer,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        borderRadius: 10,
                    }}
                >
                    <Text variant="bodyMedium">오늘의 진료는 종료했어요</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <Text variant="bodyMedium">{`오늘(${todayWeekday})`}</Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <Text variant="bodyMedium">0700-2100</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <Text variant="bodyMedium">점심시간</Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <Text variant="bodyMedium">0700-2100</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        backgroundColor: '#eeeeee',
                        gap: 10,
                        borderRadius: 10,
                    }}
                >
                    {weekdays.map((day) => (
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                            key={day}
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
                                    <Text>{day}</Text>
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
                    ))}
                </View>
            </View>
            {/* 병원소개 */}
            <View
                style={{
                    backgroundColor: theme.colors.background,
                    padding: 10,
                }}
            >
                <View style={{}}>
                    <Text variant="titleMedium">병원소개</Text>
                </View>
                <View style={{}}>
                    <Text>
                        {facilityData.description || '병원 소개가 없어요'}
                    </Text>
                </View>
            </View>
            {/* 주소정보 w.지도 */}
            <View
                style={{
                    backgroundColor: theme.colors.background,
                    padding: 10,
                    gap: 10,
                }}
            >
                <View style={{}}>
                    <Text variant="titleMedium">병원 위치</Text>
                </View>
                {facilityData.latitude && facilityData.longitude && (
                    <View style={{ height: 300 }}>
                        <NaverMapView
                            style={{ flex: 1 }}
                            initialCamera={{
                                latitude: facilityData.latitude,
                                longitude: facilityData.longitude,
                                zoom: 14,
                            }}
                        >
                            <NaverMapMarkerOverlay
                                latitude={facilityData.latitude}
                                longitude={facilityData.longitude}
                                anchor={{ x: 0.5, y: 1 }}
                                caption={{ text: facilityData.name }}
                            />
                        </NaverMapView>
                    </View>
                )}
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 20,
                    }}
                >
                    <View
                        style={{
                            flex: 5,
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Icon source={'map-marker'} size={20} />
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text>{facilityData.address || "주소 정보가 없어요"}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Button
                            onPress={() => {
                                const addr = facilityData.address || '';
                                try {
                                    Clipboard.setString(addr);
                                    if (Platform.OS === 'android') {
                                        ToastAndroid.show(
                                            '주소가 클립보드에 복사되었습니다.',
                                            ToastAndroid.SHORT,
                                        );
                                    } else {
                                        Alert.alert(
                                            '복사됨',
                                            '주소가 클립보드에 복사되었습니다.',
                                        );
                                    }
                                } catch (e) {
                                    console.log('clipboard copy failed', e);
                                    Alert.alert(
                                        '오류',
                                        '주소 복사에 실패했습니다.',
                                    );
                                }
                            }}
                            icon={'content-copy'}
                        >
                            복사
                        </Button>
                    </View>
                </View>
            </View>
            {/* 전화번호 */}
            <View
                style={{
                    backgroundColor: theme.colors.background,
                    padding: 10,
                    gap: 10,
                }}
            >
                <View style={{}}>
                    <Text variant="titleMedium">병원 연락처</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 20,
                    }}
                >
                    <View
                        style={{
                            flex: 5,
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'center',
                        }}
                    >
                        <Icon source={'phone'} size={20} />
                        <Text>{facilityData.telno || "연락처 정보가 없어요"}</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Button
                            onPress={() => {
                                const tel = facilityData.telno || '';
                                try {
                                    Clipboard.setString(tel);
                                    if (Platform.OS === 'android') {
                                        ToastAndroid.show(
                                            '전화번호가 클립보드에 복사되었습니다.',
                                            ToastAndroid.SHORT,
                                        );
                                    } else {
                                        Alert.alert(
                                            '복사됨',
                                            '전화번호가 클립보드에 복사되었습니다.',
                                        );
                                    }
                                } catch (e) {
                                    console.log('clipboard copy failed', e);
                                    Alert.alert(
                                        '오류',
                                        '전화번호 복사에 실패했습니다.',
                                    );
                                }
                            }}
                            icon={'content-copy'}
                        >
                            복사
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );
}

function StaffInfo({ facilityData }: prop) {
    const theme = useTheme();
    return (
        <View
            style={{
                backgroundColor: theme.colors.background,
                padding: 10,
            }}
        >
            <View style={{ marginVertical: 10 }}>
                <Text variant="titleMedium">인력정보</Text>
            </View>
            <View style={{ flex: 1 }}>
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
                        }}
                    >
                        <Text
                            variant="bodyMedium"
                            style={{
                                marginRight: 10,
                            }}
                        >
                            일반의
                        </Text>
                        <Text
                            variant="bodyMedium"
                            style={{
                                marginRight: 10,
                            }}
                        >{`${
                            facilityData.facility_status?.doctor_count || 0
                        }명`}</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}
                    >
                        <Text variant="bodyMedium">전공의</Text>
                        <Text variant="bodyMedium">{`${
                            facilityData.facility_status?.medc_doctor_count || 0
                        }명`}</Text>
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
                        }}
                    >
                        <Text
                            variant="bodyMedium"
                            style={{
                                marginRight: 10,
                            }}
                        >
                            요양보호사
                        </Text>
                        <Text
                            variant="bodyMedium"
                            style={{
                                marginRight: 10,
                            }}
                        >
                            {`${
                                facilityData.facility_status?.manager_count || 0
                            }명`}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

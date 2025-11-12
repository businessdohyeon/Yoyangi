import { useWindowDimensions, View } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';

import { showBorder } from '../../common';
import { useNavigation } from '@react-navigation/native';
import { FacilityData_t } from '../../types/FacilityDataScheme';

export function FacilityInfo({
    facilityData,
}: {
    facilityData: FacilityData_t;
}) {
    const navigation = useNavigation();
    const theme = useTheme();
    const { width: viewportWidth } = useWindowDimensions();

    return (
        <View
            style={{
                width: viewportWidth,
                gap: 10,
            }}
        >
            {/* 인력정보 */}
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
                            >{`${facilityData.facility_status.doctor_count}명`}</Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Text variant="bodyMedium">전공의</Text>
                            <Text variant="bodyMedium">00명</Text>
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
                                00명
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
                        backgroundColor: theme.colors.errorContainer,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
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
                            <Text variant="bodyMedium">오늘(화요일)</Text>
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
                    {/* TODO: 어후 코드냄새... map이용한 걸로 좀 바꾸자 */}
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
                    backgroundColor: theme.colors.background,
                    padding: 10,
                }}
            >
                <View style={{}}>
                    <Text variant="titleMedium">병원소개</Text>
                </View>
                <View style={{}}>
                    <Text>{facilityData.description || '...'}</Text>
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
                {/* // TODO: 지도임배딩 */}
                <View style={{ ...showBorder }}>
                    <Text>일단지도</Text>
                    <Text>일단지도</Text>
                    <Text>일단지도</Text>
                    <Text>일단지도</Text>
                    <Text>일단지도</Text>
                    <Text>일단지도</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
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
                        <Icon source={'map-marker'} size={20} />
                        <Text>{facilityData.address}</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Button
                            onPress={() => {
                                // TODO: copy
                                console.log('copied!');
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
                    <Text variant="titleMedium">병원 위치</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text variant="bodyMedium">
                        밑의 전화걸기를 클릭하면 바로 전화를 걸 수 있어요
                    </Text>
                    <Text>{facilityData.telno}</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
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
                        <Text>{facilityData.telno}</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Button
                            onPress={() => {
                                // TODO: copy
                                console.log('copied!');
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

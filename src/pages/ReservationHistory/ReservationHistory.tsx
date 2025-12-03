import React from 'react';
import { FlatList, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Text,
    useTheme,
} from 'react-native-paper';
import { Alert } from 'react-native';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import axiosInstance from '../../apis/axios';
import { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginInfoContext } from '../../Context';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavProp } from '../../types/Navigation';
import apis from '../../apis';

export default function ReservationHistory() {
    const nav = useNavigation<RootStackNavProp<'ReservationHistory'>>();
    const theme = useTheme();
    const ctx = useContext(LoginInfoContext);
    const { loginInfo } = ctx;
    const { isAuthenticated } = useRequireAuth();

    if (!isAuthenticated) return null;

    const token = loginInfo?.token ?? '';

    const fetchReservations = async () => {
        const res = await axiosInstance.get(apis.urls.reservationsList, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // 응답 예시: res.data.data 배열
        return res.data?.data ?? [];
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['reservations', loginInfo?.userId ?? 0],
        queryFn: fetchReservations,
        enabled: Boolean(
            loginInfo && loginInfo.userId && Number(loginInfo.userId) > 0,
        ),
        staleTime: 30 * 1000,
    });

    type Reservation = {
        reservation_id?: number | string;
        status?: string;
        facility_name?: string;
        user_name?: string;
        reserved_date?: string;
    };

    const reservations: Reservation[] = Array.isArray(data)
        ? (data as Reservation[])
        : [];

    // 로그인 여부는 useRequireAuth 훅에서 처리함

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={'예약 내역'} />
            <View style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 12 }}>
                {isLoading ? (
                    <ActivityIndicator animating color={theme.colors.primary} />
                ) : isError ? (
                    <View>
                        <Text>예약 내역을 불러오지 못했습니다.</Text>
                        <Text onPress={() => refetch()}>다시 시도</Text>
                    </View>
                ) : reservations.length === 0 ? (
                    <Text>예약 내역이 없습니다.</Text>
                ) : (
                    <FlatList
                        data={reservations}
                        keyExtractor={(item, idx) =>
                            String(item.reservation_id ?? idx)
                        }
                        renderItem={({ item }) => {
                            const status = String(
                                item.status || '',
                            ).toUpperCase();

                            const statusColor =
                                status === 'CONFIRMED'
                                    ? '#2E8B57'
                                    : status === 'PENDING'
                                    ? '#FF8C00'
                                    : status === 'CANCLED' ||
                                      status === 'CANCELED'
                                    ? '#D32F2F'
                                    : '#888';

                            const statusLabel =
                                status === 'PENDING'
                                    ? '예약 대기'
                                    : status === 'CONFIRMED'
                                    ? '예약 확정'
                                    : status === 'CANCLED' ||
                                      status === 'CANCELED'
                                    ? '예약 취소됨'
                                    : '알 수 없음';

                            const handleCancel = () => {
                                Alert.alert(
                                    '예약 취소',
                                    '정말 예약을 취소하시겠습니까?',
                                    [
                                        { text: '취소', style: 'cancel' },
                                        {
                                            text: '확인',
                                            onPress: async () => {
                                                try {
                                                    console.log(
                                                        'token:',
                                                        token,
                                                    );
                                                    // 예약 취소 API 호출 (백엔드 엔드포인트에 맞게 조정)
                                                    // NOTE: axios.patch(url, data, config)
                                                    // 이전에는 headers를 두번째 인자로 전달해버려서
                                                    // axios가 이를 request body로 취급했고 Authorization 헤더가 전송되지 않았습니다.
                                                    await axiosInstance.patch(
                                                        apis.urls.cancelReservationById(
                                                            item.reservation_id,
                                                        ),
                                                        {},
                                                        {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`,
                                                                'Content-Type':
                                                                    'application/json',
                                                            },
                                                        },
                                                    );
                                                    // 성공 시 목록 재조회
                                                    refetch();
                                                } catch (e) {
                                                    console.error(
                                                        'cancel reservation error',
                                                        e,
                                                    );
                                                    Alert.alert(
                                                        '취소 실패',
                                                        '예약 취소에 실패했습니다. 다시 시도해주세요.',
                                                    );
                                                }
                                            },
                                        },
                                    ],
                                );
                            };

                            return (
                                <Card
                                    style={{ marginBottom: 10 }}
                                    onPress={() => {
                                        console.log(item);

                                        nav.navigate('ReservationDetailPage', {
                                            reservation_id: item.reservation_id,
                                        });
                                    }}
                                >
                                    <Card.Content>
                                        <Text variant="titleMedium">
                                            {item.facility_name ||
                                                '기관명 없음'}
                                        </Text>
                                        <Text>예약자: {item.user_name}</Text>
                                        <Text>
                                            예약일: {item.reserved_date}
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 6,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: statusColor,
                                                    fontWeight: '600',
                                                    marginRight: 12,
                                                }}
                                            >
                                                상태: {statusLabel}
                                            </Text>
                                            {status === 'PENDING' ? (
                                                <Button
                                                    mode="outlined"
                                                    onPress={handleCancel}
                                                    compact
                                                >
                                                    예약 취소
                                                </Button>
                                            ) : null}
                                        </View>
                                    </Card.Content>
                                </Card>
                            );
                        }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

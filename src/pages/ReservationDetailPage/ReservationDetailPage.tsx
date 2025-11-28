import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { View } from 'react-native';
import {
    ActivityIndicator,
    Card,
    Text,
    Title,
    useTheme,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../apis/axios';
import { LoginInfoContext } from '../../Context';

export default function ReservationDetailPage({ route }: any) {
    const theme = useTheme();
    const ctx: any = useContext(LoginInfoContext as any);
    const { loginInfo } = ctx;

    // route param 이름이 reservation_id 라고 가정
    const reservation_id = route?.params?.reservation_id;

    const fetchReservationDetail = async () => {
        const res = await axiosInstance.get(
            `/facilities/reservations/${reservation_id}`,
            {
                headers: {
                    Authorization: `Bearer ${loginInfo.token}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        // API 샘플: res.data.data
        return res.data?.data ?? null;
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['reservationDetail', reservation_id],
        queryFn: fetchReservationDetail,
        enabled: Boolean(
            reservation_id &&
                loginInfo &&
                loginInfo.userId &&
                Number(loginInfo.userId) > 0,
        ),
        staleTime: 30 * 1000,
    });

    if (!reservation_id) {
        return (
            <SafeAreaView
                edges={['left', 'right', 'bottom']}
                style={{ flex: 1 }}
            >
                <GoBackHeader title={'예약 상세 내역'} />
                <View style={{ padding: 16 }}>
                    <Text>잘못된 요청입니다. 예약 ID가 없습니다.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={'예약 상세 내역'} />

            <View style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 12 }}>
                {isLoading ? (
                    <ActivityIndicator animating color={theme.colors.primary} />
                ) : isError ? (
                    <View>
                        <Text>예약 상세를 불러오지 못했습니다.</Text>
                        <Text onPress={() => refetch()}>다시 시도</Text>
                    </View>
                ) : !data ? (
                    <Text>예약 정보를 찾을 수 없습니다.</Text>
                ) : (
                    <View>
                        <Card style={{ marginBottom: 12 }}>
                            <Card.Content>
                                <Title>기관</Title>
                                <Text>
                                    {data.facility?.name ?? '기관 정보 없음'}
                                </Text>
                            </Card.Content>
                        </Card>

                        <Card style={{ marginBottom: 12 }}>
                            <Card.Content>
                                <Title>예약 정보</Title>
                                <Text>
                                    예약 ID: {data.reservation?.id ?? '-'}
                                </Text>
                                <Text>
                                    예약일:{' '}
                                    {data.reservation?.reserved_date ?? '-'}
                                </Text>
                                <Text>
                                    예약시간:{' '}
                                    {data.reservation?.reserved_time ?? '-'}
                                </Text>
                                <Text>
                                    상태:{' '}
                                    {(() => {
                                        const st = String(
                                            data.reservation?.status ?? '',
                                        ).toUpperCase();
                                        if (st === 'PENDING')
                                            return '예약 대기';
                                        if (st === 'CONFIRMED')
                                            return '예약 확정';
                                        if (
                                            st === 'CANCLED' ||
                                            st === 'CANCELED'
                                        )
                                            return '예약 취소됨';
                                        return '알 수 없음';
                                    })()}
                                </Text>
                            </Card.Content>
                        </Card>

                        <Card style={{ marginBottom: 12 }}>
                            <Card.Content>
                                <Title>진료 대상자</Title>
                                <Text>이름: {data.patient?.name ?? '-'}</Text>
                                <Text>
                                    생년월일: {data.patient?.birth ?? '-'}
                                </Text>
                                <Text>
                                    성별:{' '}
                                    {data.patient?.gender === 'M'
                                        ? '남'
                                        : data.patient?.gender === 'F'
                                        ? '여'
                                        : '-'}
                                </Text>
                                <Text>전화: {data.patient?.phone ?? '-'}</Text>
                                <Text>
                                    진단: {data.patient?.disease_type ?? '-'}
                                </Text>
                                {data.patient?.notes ? (
                                    <Text>메모: {data.patient.notes}</Text>
                                ) : null}
                            </Card.Content>
                        </Card>

                        <Card>
                            <Card.Content>
                                <Title>예약자</Title>
                                <Text>
                                    이름: {data.reservation_user?.name ?? '-'}
                                </Text>
                                <Text>
                                    전화: {data.reservation_user?.phone ?? '-'}
                                </Text>
                            </Card.Content>
                        </Card>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

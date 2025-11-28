import React from 'react';
import { ScrollView, View } from 'react-native';
import {
    ActivityIndicator,
    Card,
    Text,
    Title,
    Button,
    useTheme,
} from 'react-native-paper';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '../../apis/axios';
import { useQuery } from '@tanstack/react-query';

export default function ReviewDetail({ route }: any) {
    const theme = useTheme();
    const { facilityId, reviewId } = route.params || {};

    const fetchReview = async () => {
        const res = await axiosInstance.get(
            `/reviews/${facilityId}/${reviewId}`,
        );
        return res.data?.data ?? null;
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['review', facilityId, reviewId],
        queryFn: fetchReview,
        enabled: Boolean(facilityId && reviewId),
        staleTime: 30 * 1000,
    });

    const review: any = data;

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={'리뷰 상세'} />
            <ScrollView contentContainerStyle={{ padding: 12 }}>
                {isLoading ? (
                    <View style={{ padding: 20 }}>
                        <ActivityIndicator
                            animating
                            color={theme.colors.primary}
                        />
                    </View>
                ) : isError ? (
                    <View style={{ padding: 12 }}>
                        <Text>리뷰를 불러오지 못했습니다.</Text>
                        <Button onPress={() => refetch()}>다시 시도</Button>
                    </View>
                ) : !review ? (
                    <Text>리뷰 정보가 없습니다.</Text>
                ) : (
                    <>
                        <Card style={{ marginBottom: 12 }}>
                            <Card.Content>
                                <Title>리뷰</Title>
                                <Text style={{ marginTop: 6 }}>
                                    {review.content}
                                </Text>
                                <Text style={{ marginTop: 6 }}>
                                    평점: {review.rating ?? '-'}
                                </Text>
                                <Text>
                                    방문 여부:{' '}
                                    {review.visited ? '방문' : '미방문'}
                                </Text>
                                <Text>
                                    상태:{' '}
                                    {String(review.status ?? '').toUpperCase()}
                                </Text>
                                <Text>작성자: {review.user?.name ?? '-'}</Text>
                                <Text>
                                    작성일:{' '}
                                    {review.createdAt
                                        ? new Date(
                                              review.createdAt,
                                          ).toLocaleString()
                                        : '-'}
                                </Text>
                            </Card.Content>
                        </Card>
                        {review.reply ? (
                            <Card style={{ marginBottom: 12 }}>
                                <Card.Content>
                                    <Title>답글</Title>
                                    <Text>{review.reply}</Text>
                                </Card.Content>
                            </Card>
                        ) : null}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

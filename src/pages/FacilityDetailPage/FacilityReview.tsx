import React, { useContext } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

// import { showBorder } from '../../common';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation';
import ReviewCard from './ReviewCard';
import { FacilityData_t } from '../../types/FacilityDataScheme';
import axiosInstance from '../../apis/axios';
import { useQuery } from '@tanstack/react-query';
import { ReviewDataArraySchema } from '../../types/ReviewDataScheme';
import apis from '../../apis';
import { LoginInfoContext } from '../../Context';
// LoginInfoContext not needed in this component

export function FacilityReview({
    facilityData,
}: {
    facilityData: FacilityData_t;
}) {
    const navigation =
        useNavigation<
            NativeStackNavigationProp<RootStackParamList, 'ReviewDetail'>
        >();
    const theme = useTheme();
    const { width: viewportWidth } = useWindowDimensions();
    const { loginInfo } = useContext(LoginInfoContext);
    const { userId } = loginInfo;

    const { data: reviewDataArray = [] } = useQuery({
        queryKey: ['facilityReviews', facilityData.id],
        queryFn: async () => {
            const response = await axiosInstance.get(
                apis.urls.getFacilityReviewById(facilityData.id),
            );
            const { data } = response.data;

            const tmp = ReviewDataArraySchema.parse(data);
            return tmp;
        },
        staleTime: 60 * 1000, // 1분 캐싱
    });

    console.log(reviewDataArray);

    return (
        <View
            style={{
                width: viewportWidth,
                gap: 10,
            }}
        >
            {/* 별점 요약: 평균 별점 + 총 후기 수 표시 */}
            <View
                style={{
                    backgroundColor: theme.colors.background,
                    paddingHorizontal: 14,
                    paddingVertical: 14,
                    borderRadius: 8,
                }}
            >
                <View style={{ marginBottom: 8 }}>
                    <Text variant="titleMedium">리뷰</Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{ alignItems: 'center' }}>
                        <Text
                            style={{ fontSize: 36, fontWeight: '700' }}
                        >{`★ ${(facilityData.average_rating ?? 0).toFixed(
                            1,
                        )}`}</Text>
                        <Text variant="labelMedium">평균 평점</Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                        <Text variant="titleMedium">{`총 후기 ${
                            facilityData.review_count ?? 0
                        }건`}</Text>
                        <Text variant="bodySmall" style={{ color: '#666' }}>
                            방문자들의 솔직한 후기
                        </Text>
                    </View>
                </View>
            </View>
            {/* 후기컴포넌트 */}
            <View
                style={{
                    backgroundColor: theme.colors.background,
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                    gap: 10,
                }}
            >
                {reviewDataArray.map((reviewData) => {
                    const isOwner = !!(
                        userId &&
                        reviewData.user &&
                        userId === reviewData.user_id
                    );

                    return (
                        <ReviewCard
                            key={reviewData.id}
                            reviewId={reviewData.id}
                            author={reviewData.user.name}
                            avatarUri="https://.../avatar.jpg"
                            rating={reviewData.rating}
                            date={reviewData.created_at}
                            content={reviewData.content}
                            images={reviewData.images}
                            tags={['청결', '접근성']}
                            style={{}}
                            onPress={() =>
                                navigation.navigate('ReviewDetail', {
                                    facilityId: facilityData.id,
                                    reviewId: reviewData.id,
                                })
                            }
                            onEdit={
                                isOwner
                                    ? () =>
                                          navigation.navigate('ReviewForm', {
                                              facilityId: facilityData.id,
                                              facilityName: facilityData.name,
                                              reviewId: reviewData.id,
                                              initialValues: {
                                                  content: reviewData.content,
                                                  rating: String(
                                                      reviewData.rating ?? '',
                                                  ),
                                                  reservationId:
                                                      (reviewData as any)
                                                          .reservation_id ??
                                                      (reviewData as any)
                                                          .reservationId ??
                                                      '',
                                                  images: [],
                                              },
                                          })
                                    : undefined
                            }
                        />
                    );
                })}
                <View style={{}}>
                    <Button
                        icon="camera"
                        mode="contained"
                        onPress={() => console.log('Pressed')}
                        style={{ flex: 1 }}
                    >
                        더보기
                    </Button>
                </View>
            </View>
        </View>
    );
}

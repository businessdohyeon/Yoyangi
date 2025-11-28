import React, { useContext } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import ReviewCard from './ReviewCard';
import { FacilityData_t } from '../../types/FacilityDataScheme';
import axiosInstance from '../../apis/axios';
import { useQuery } from '@tanstack/react-query';
import { ReviewDataArraySchema } from '../../types/ReviewDataScheme';
import apis from '../../apis';
import { LoginInfoContext } from '../../Context';

export function FacilityReview({
    facilityData,
}: {
    facilityData: FacilityData_t;
}) {
    // navigation moved into ReviewCard
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
                            reviewData={reviewData}
                            isOwner={isOwner}
                            facilityId={facilityData.id}
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

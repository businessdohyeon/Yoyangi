import { useWindowDimensions, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import { showBorder } from '../../common';
import { useNavigation } from '@react-navigation/native';
import ReviewCard from './ReviewCard';
import { FacilityData_t } from '../../types/FacilityDataScheme';
import apis from '../../apis';
import { useEffect, useState } from 'react';
import {
    ReviewData_t,
    ReviewDataArraySchema,
} from '../../types/ReviewDataScheme';

export function FacilityReview({
    facilityData,
}: {
    facilityData: FacilityData_t;
}) {
    const navigation = useNavigation();
    const theme = useTheme();
    const { width: viewportWidth } = useWindowDimensions();

    const [isLoading, setIsLoading] = useState(true);
    const [reviewDataArray, setReviewDataArray] = useState<ReviewData_t[]>([]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(
                apis.urls.getFacilityReviewById(facilityData.id),
            );
            const json = await res.json();
            const { data } = json;

            console.log(json);

            const tmp = ReviewDataArraySchema.parse(data);
            console.log(...tmp);

            setReviewDataArray(tmp);
            setIsLoading(false);
            // setReview(json.Reviews);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <View
            style={{
                width: viewportWidth,
                gap: 10,
            }}
        >
            {/* 별점 개요 */}
            <View
                style={{
                    backgroundColor: theme.colors.background,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}
            >
                <View style={{ marginVertical: 10 }}>
                    <Text variant="titleMedium">리뷰(120)</Text>
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
                    return (
                        <ReviewCard
                            key={reviewData.id}
                            author={reviewData.user.name}
                            avatarUri="https://.../avatar.jpg"
                            rating={reviewData.rating}
                            date={reviewData.created_at}
                            content={reviewData.content}
                            images={[
                                // TODO
                                { uri: 'https://.../1.jpg' },
                                { uri: 'https://.../2.jpg' },
                            ]}
                            tags={['청결', '접근성']}
                            onPress={() =>
                                // TODO
                                navigation.navigate('ReviewDetail', {
                                    id: reviewData.id,
                                })
                            }
                        />
                    );
                })}

                <View style={{ ...showBorder }}>
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

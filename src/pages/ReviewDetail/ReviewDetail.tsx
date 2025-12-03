import { useContext } from 'react';
import {
    ScrollView,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    ActivityIndicator,
    Card,
    Text,
    Title,
    Button,
    useTheme,
    Avatar,
} from 'react-native-paper';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '../../apis/axios';
import { useQuery } from '@tanstack/react-query';
import apis from '../../apis';
import { ReviewData_t } from '../../types/ReviewDataScheme';
import { ScreenProps } from '../../types/Navigation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation';
import { LoginInfoContext } from '../../Context';

export default function ReviewDetail({ route }: ScreenProps<'ReviewDetail'>) {
    const theme = useTheme();
    const { facilityId, reviewId } = route.params || {};

    type ApiResponse<T> = {
        Message: string;
        ResultCode: string;
        data: T;
    };

    type ReviewApiData = ReviewData_t & {
        facility_id?: number;
        status?: string;
        deleted_at?: string | null;
        createdAt?: string; // some APIs return camelCase createdAt
        updatedAt?: string;
        reply?: string | null;
        reservation_id?: number | string;
        reservationId?: number | string;
        tags?: string[] | Record<string, unknown> | null;
    };

    const fetchReview = async (): Promise<ReviewApiData | null> => {
        const res = await axiosInstance.get<ApiResponse<ReviewApiData>>(
            apis.urls.getReviewByIds(facilityId, reviewId),
        );

        console.log(res);

        return res.data?.data ?? null;
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['review', facilityId, reviewId],
        queryFn: fetchReview,
        enabled: Boolean(facilityId && reviewId),
        staleTime: 30 * 1000,
    });

    const review: ReviewApiData | null | undefined = data;
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { loginInfo } = useContext(LoginInfoContext);

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
                        <Card
                            style={[
                                styles.cardMain,
                                { backgroundColor: theme.colors.surface },
                            ]}
                        >
                            <Card.Content>
                                <View style={styles.headerRow}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Avatar.Text
                                            size={42}
                                            label={
                                                (review.user?.name || '?')[0]
                                            }
                                        />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text variant="titleMedium">
                                                {review.user?.name ?? '작성자'}
                                            </Text>
                                            <Text style={styles.metaText}>
                                                {review.createdAt
                                                    ? new Date(
                                                          review.createdAt,
                                                      ).toLocaleString()
                                                    : '-'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={{ alignItems: 'flex-end' }}>
                                        <StarRow rating={review.rating ?? 0} />
                                        <Text style={styles.ratingText}>
                                            {(review.rating ?? '-').toString()}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ marginTop: 12 }}>
                                    <Text>{review.content}</Text>
                                </View>

                                {review.images && review.images.length > 0 ? (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.imagesRow}
                                    >
                                        {review.images.map(
                                            (
                                                img: string | { uri?: string },
                                                idx: number,
                                            ) => (
                                                <TouchableOpacity
                                                    key={`${idx}-${String(
                                                        img,
                                                    )}`}
                                                    activeOpacity={0.8}
                                                >
                                                    <Image
                                                        source={{
                                                            uri:
                                                                typeof img ===
                                                                'string'
                                                                    ? img
                                                                    : img?.uri,
                                                        }}
                                                        style={styles.thumb}
                                                    />
                                                </TouchableOpacity>
                                            ),
                                        )}
                                    </ScrollView>
                                ) : null}

                                <View style={styles.infoRow}>
                                    <Text style={styles.metaText}>
                                        방문 여부:{' '}
                                        {review.visited ? '방문' : '미방문'}
                                    </Text>
                                    <Text style={styles.metaText}>
                                        상태:{' '}
                                        {String(
                                            review.status ?? '',
                                        ).toUpperCase()}
                                    </Text>
                                </View>

                                <View style={styles.actionRow}>
                                    {loginInfo?.userId &&
                                    review?.user?.id === loginInfo.userId ? (
                                        // TODO: API 응답의 예약 ID 필드 이름을 통일하여
                                        // 타입 안전하게 매핑하세요.
                                        <Button
                                            onPress={() =>
                                                navigation.navigate(
                                                    'ReviewForm',
                                                    {
                                                        facilityId,
                                                        reviewId: review.id,
                                                        initialValues: {
                                                            content:
                                                                review.content,
                                                            rating: String(
                                                                review.rating ??
                                                                    '',
                                                            ),
                                                            reservationId:
                                                                String(
                                                                    (
                                                                        review as Partial<
                                                                            Record<
                                                                                | 'reservation_id'
                                                                                | 'reservationId',
                                                                                number
                                                                            >
                                                                        >
                                                                    )
                                                                        .reservation_id ??
                                                                        (
                                                                            review as Partial<
                                                                                Record<
                                                                                    | 'reservation_id'
                                                                                    | 'reservationId',
                                                                                    number
                                                                                >
                                                                            >
                                                                        )
                                                                            .reservationId ??
                                                                        '',
                                                                ),
                                                            images: [],
                                                        },
                                                    },
                                                )
                                            }
                                        >
                                            수정하기
                                        </Button>
                                    ) : null}

                                    <Button onPress={() => {}}>신고</Button>
                                </View>
                            </Card.Content>
                        </Card>

                        {review.reply ? (
                            <Card
                                style={[
                                    styles.replyCard,
                                    { backgroundColor: theme.colors.surface },
                                ]}
                            >
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

function StarRow({ rating = 0 }: { rating?: number }) {
    const stars = [];
    const full = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
        stars.push(
            <Text key={i} style={styles.star} accessibilityLabel={`star-${i}`}>
                {i < full ? '★' : '☆'}
            </Text>,
        );
    }
    return <View style={styles.starRow}>{stars}</View>;
}

const styles = StyleSheet.create({
    cardMain: {
        marginBottom: 12,
        borderRadius: 12,
        padding: 6,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: '#666',
    },
    ratingText: {
        fontSize: 14,
        color: '#333',
    },
    imagesRow: {
        marginTop: 12,
    },
    thumb: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginRight: 8,
        backgroundColor: '#eee',
    },
    infoRow: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionRow: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    replyCard: {
        marginBottom: 12,
        borderRadius: 12,
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    star: {
        fontSize: 16,
        marginRight: 2,
    },
});

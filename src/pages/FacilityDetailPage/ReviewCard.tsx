import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { LoginInfoContext } from '../../Context';
import axiosInstance from '../../apis/axios';
import {
    Card,
    Text,
    Paragraph,
    Avatar,
    Button,
    Chip,
    Portal,
    Dialog,
    TextInput,
} from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import apis from '../../apis';

// 간단한 별점 렌더러
function StarRow({ rating = 0 }) {
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

type ImageItem = { uri: string };

type ReviewCardProps = {
    author: string;
    avatarUri?: string;
    rating?: number;
    date?: string;
    content?: string;
    images?: Array<ImageItem | string>;
    tags?: string[];
    onPress?: () => void;
    onEdit?: () => void;
    onReport?: () => void;
    reviewId?: number;
    style?: any;
};

export default function ReviewCard({
    author,
    avatarUri,
    rating,
    date,
    content,
    images,
    tags,
    onPress,
    onEdit,
    onReport,
    reviewId,
    style,
}: ReviewCardProps) {
    const { loginInfo } = useContext(LoginInfoContext);
    const queryClient = useQueryClient();
    const [reportVisible, setReportVisible] = useState(false);

    const categories = [
        'DUPLICATE_SPAM',
        'AD_PROMOTION',
        'ABUSE_HATE',
        'PRIVACY_LEAK',
        'SEXUAL_CONTENT',
        'ETC',
    ];

    const categoryLabels: Record<string, string> = {
        DUPLICATE_SPAM: '중복/스팸',
        AD_PROMOTION: '광고/홍보',
        ABUSE_HATE: '욕설/혐오',
        PRIVACY_LEAK: '개인정보 유출',
        SEXUAL_CONTENT: '음란성',
        ETC: '기타',
    };

    const reportMutation = useMutation({
        mutationFn: async (payload: { category: string; reason?: string }) => {
            return axiosInstance.post(
                apis.urls.reportReview(reviewId),
                payload,
                {
                    headers: { Authorization: `Bearer ${loginInfo?.token}` },
                },
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilityReviews'] });
            setReportVisible(false);
            Alert.alert('완료', '신고가 접수되었습니다.');
        },
        onError: (err) => {
            console.error('report error', err);
            Alert.alert('오류', '신고에 실패했습니다.');
        },
    });

    const form = useForm({
        defaultValues: { category: '', reason: '' },
        onSubmit: async (values) => {
            if (!values.value.category) {
                Alert.alert('선택 필요', '신고 유형을 선택해주세요.');
                return;
            }
            reportMutation.mutate({
                category: values.value.category,
                reason: values.value.reason,
            });
        },
    });

    const handleReport = () => {
        if (onReport) {
            onReport();
            return;
        }

        if (!reviewId) {
            Alert.alert('오류', '신고할 리뷰 ID가 없습니다.');
            return;
        }

        if (!loginInfo || !loginInfo.token) {
            Alert.alert('로그인 필요', '신고하려면 로그인해야 합니다.');
            return;
        }

        setReportVisible(true);
    };
    return (
        <Card style={[styles.card, style]} onPress={onPress}>
            <Card.Title
                title={author}
                subtitle={date}
                left={(props) =>
                    avatarUri ? (
                        <Avatar.Image {...props} source={{ uri: avatarUri }} />
                    ) : (
                        <Avatar.Text {...props} label={author[0] || '?'} />
                    )
                }
            />

            <Card.Content>
                <View style={styles.rowBetween}>
                    <StarRow rating={rating} />
                    <Chip compact>
                        {rating ? `${rating.toFixed(1)}` : '평점 없음'}
                    </Chip>
                </View>

                <Paragraph
                    style={styles.content}
                    numberOfLines={4}
                    ellipsizeMode="tail"
                >
                    {content}
                </Paragraph>

                {images && images.length > 0 ? (
                    <View style={styles.imageRow}>
                        {images.slice(0, 3).map((img, idx) => {
                            const source =
                                typeof img === 'string' ? { uri: img } : img;
                            return (
                                <TouchableOpacity
                                    key={`${idx}-${
                                        typeof img === 'string'
                                            ? img
                                            : img.uri || idx
                                    }`}
                                    activeOpacity={0.8}
                                    onPress={() => {}}
                                >
                                    <Image
                                        source={source}
                                        style={styles.imageThumb}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                        {images.length > 3 ? (
                            <View style={styles.moreOverlay}>
                                <Text style={styles.moreText}>
                                    +{images.length - 3}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                ) : null}

                {tags && tags.length > 0 ? (
                    <View style={styles.tagsRow}>
                        {tags.map((t, i) => (
                            <Chip key={i} style={styles.tag} compact>
                                {t}
                            </Chip>
                        ))}
                    </View>
                ) : null}
            </Card.Content>

            <Card.Actions>
                <Button onPress={onPress}>자세히</Button>
                {onEdit ? <Button onPress={onEdit}>수정하기</Button> : null}
                <Button onPress={handleReport}>신고</Button>
            </Card.Actions>

            <Portal>
                <Dialog
                    visible={reportVisible}
                    onDismiss={() => setReportVisible(false)}
                >
                    <Dialog.Title>리뷰 신고</Dialog.Title>
                    <Dialog.Content>
                        <form.Field
                            name="category"
                            children={(field) => (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        gap: 8,
                                    }}
                                >
                                    {categories.map((c) => (
                                        <Chip
                                            key={c}
                                            mode="outlined"
                                            selected={field.state.value === c}
                                            onPress={() =>
                                                field.handleChange(c)
                                            }
                                            style={{
                                                marginRight: 6,
                                                marginBottom: 6,
                                            }}
                                        >
                                            {categoryLabels[c] ?? c}
                                        </Chip>
                                    ))}
                                </View>
                            )}
                        />

                        <form.Field
                            name="reason"
                            children={(field) => (
                                <TextInput
                                    label="신고 사유 (선택적)"
                                    value={field.state.value}
                                    onChangeText={field.handleChange}
                                    multiline
                                    style={{ marginTop: 12 }}
                                />
                            )}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setReportVisible(false)}>
                            취소
                        </Button>
                        <form.Subscribe
                            selector={(s) => ({
                                canSubmit: s.canSubmit,
                                isSubmitting: s.isSubmitting,
                            })}
                            children={({ canSubmit, isSubmitting }) => (
                                <Button
                                    mode="contained"
                                    loading={
                                        isSubmitting ||
                                        reportMutation.status === 'pending'
                                    }
                                    disabled={
                                        !canSubmit ||
                                        reportMutation.status === 'pending'
                                    }
                                    onPress={() => form.handleSubmit()}
                                >
                                    신고 제출
                                </Button>
                            )}
                        />
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        marginHorizontal: 12,
        borderRadius: 8,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    star: {
        fontSize: 16,
        marginRight: 2,
    },
    content: {
        marginBottom: 8,
    },
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    imageThumb: {
        width: 80,
        height: 80,
        borderRadius: 6,
        marginRight: 8,
        backgroundColor: '#eee',
    },
    moreOverlay: {
        position: 'absolute',
        right: 16,
        top: 40,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    moreText: {
        color: '#fff',
        fontSize: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        marginRight: 6,
        marginTop: 6,
    },
});

/*
사용 예시

*/

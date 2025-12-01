import React, { useContext } from 'react';
import { Alert, Text, View, Image } from 'react-native';
import {
    TextInput,
    Button,
    Card,
    IconButton,
    useTheme,
} from 'react-native-paper';
import {
    launchImageLibrary,
    ImageLibraryOptions,
} from 'react-native-image-picker';
import { useForm } from '@tanstack/react-form';
import { LoginInfoContext } from '../../Context';
import { ScrollView } from 'react-native-gesture-handler';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import axiosInstance from '../../apis/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import apis from '../../apis';
import { ScreenProps } from '../../types/Navigation';

// form 초기화

export default function ReviewForm({
    route,
    navigation,
}: ScreenProps<'ReviewForm'>) {
    const { facilityId } = route.params || {};
    const { facilityName } = route.params || {};
    const reviewId = (route.params as any)?.reviewId;
    const initialValues = (route.params as any)?.initialValues;
    const { loginInfo } = useContext(LoginInfoContext);
    const queryClient = useQueryClient();
    const { isAuthenticated } = useRequireAuth();

    const reviewMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            if (reviewId) {
                // edit existing review with PATCH to same endpoint
                const response = await axiosInstance.patch(
                    apis.urls.editReview(facilityId, reviewId),
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${loginInfo.token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                );
                return response.data;
            }
            const response = await axiosInstance.post(
                apis.urls.createReview(facilityId),
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${loginInfo.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['facilityReviews', facilityId],
            });
            queryClient.invalidateQueries({
                queryKey: ['facility', facilityId],
            });
            navigation.goBack();
        },
        onError: (err) => {
            console.error(err);
            Alert.alert('오류', '서버 오류가 발생했습니다');
        },
    });

    const form = useForm({
        defaultValues: {
            content: initialValues?.content ?? '',
            rating:
                initialValues?.rating !== undefined
                    ? String(initialValues.rating)
                    : '',
            reservationId:
                initialValues?.reservationId !== undefined
                    ? String(initialValues.reservationId)
                    : '',
            images: initialValues?.images ?? [],
        },
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('content', values.value.content);
                formData.append('rating', Number(values.value.rating));

                if (values.value.reservationId)
                    formData.append(
                        'reservationId',
                        values.value.reservationId,
                    );

                // 이미지가 있을 때만 formData에 추가
                if (
                    Array.isArray(values.value.images) &&
                    values.value.images.length > 0
                ) {
                    values.value.images.forEach((img: any, idx: number) => {
                        if (img?.uri) {
                            formData.append('images', {
                                uri: img.uri,
                                name: `review_${idx}.jpg`,
                                type: 'image/jpeg',
                            } as any);
                        }
                    });
                }

                reviewMutation.mutate(formData);
            } catch (err) {
                console.error(err);
            }
        },
    });

    const theme = useTheme();

    // 인증 상태가 준비되지 않았으면 아무 것도 렌더링하지 않음
    if (!isAuthenticated) return null;

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={`${facilityName} 후기 쓰기`} />
            <ScrollView style={{ flex: 1, padding: 16 }}>
                <Card
                    style={{
                        padding: 16,
                        backgroundColor: theme.colors.surface,
                    }}
                >
                    <form.Field
                        name="content"
                        validators={{
                            onChange: ({ value }) =>
                                !value
                                    ? '리뷰 내용을 입력하세요'
                                    : value.length < 5
                                    ? '5자 이상 입력 필요'
                                    : undefined,
                        }}
                        children={(field) => (
                            <>
                                <TextInput
                                    label="리뷰 내용"
                                    value={field.state.value}
                                    onChangeText={field.handleChange}
                                    onBlur={field.handleBlur}
                                    multiline
                                />
                                {(field.state as any).meta?.error ? (
                                    <Text style={{ color: 'red' }}>
                                        {(field.state as any).meta?.error}
                                    </Text>
                                ) : null}
                            </>
                        )}
                    />

                    <form.Field
                        name="rating"
                        validators={{
                            onChange: ({ value }) =>
                                !value ||
                                isNaN(Number(value)) ||
                                Number(value) < 1 ||
                                Number(value) > 5
                                    ? '평점은 1~5 사이여야 함'
                                    : undefined,
                        }}
                        children={(field) => (
                            <>
                                <TextInput
                                    label="평점 (1~5)"
                                    keyboardType="numeric"
                                    value={field.state.value}
                                    onChangeText={field.handleChange}
                                    onBlur={field.handleBlur}
                                />
                                {(field.state as any).meta?.error ? (
                                    <Text style={{ color: 'red' }}>
                                        {(field.state as any).meta?.error}
                                    </Text>
                                ) : null}
                            </>
                        )}
                    />

                    <form.Field
                        name="reservationId"
                        validators={{
                            onChange: ({ value }) =>
                                value && isNaN(Number(value))
                                    ? '숫자만 입력 가능'
                                    : undefined,
                        }}
                        children={(field) => (
                            <>
                                <TextInput
                                    label="예약 ID (선택)"
                                    keyboardType="numeric"
                                    value={field.state.value}
                                    onChangeText={field.handleChange}
                                    onBlur={field.handleBlur}
                                />
                            </>
                        )}
                    />

                    {/** 로그인 인증이 아직 완료되지 않았으면 렌더링 중단 (hooks는 이미 호출됨) */}
                    {/** Guard: hooks already called above */}
                    {/** 실제 렌더링 바로 전에 인증 상태 확인 */}
                    {/** (컴포넌트 레벨에서 return을 사용하기 위해 JSX 밖으로 이동) */}

                    <form.Field
                        name="images"
                        children={(field) => {
                            const pickImages = async () => {
                                const opts: ImageLibraryOptions = {
                                    mediaType: 'photo',
                                    selectionLimit: 4, // match server limit
                                };
                                try {
                                    const res = await launchImageLibrary(opts);
                                    if (res.didCancel) return;
                                    const assets = res.assets || [];
                                    const newImgs = assets
                                        .map((a) => a?.uri)
                                        .filter(Boolean)
                                        .map((uri) => ({ uri } as any));
                                    const cur = Array.isArray(field.state.value)
                                        ? field.state.value
                                        : [];
                                    field.handleChange([...cur, ...newImgs]);
                                } catch (e) {
                                    console.error('image pick error', e);
                                }
                            };

                            const removeImage = (idx: number) => {
                                const cur = Array.isArray(field.state.value)
                                    ? [...field.state.value]
                                    : [];
                                cur.splice(idx, 1);
                                field.handleChange(cur);
                            };

                            return (
                                <View style={{ marginVertical: 8 }}>
                                    <Button
                                        mode="outlined"
                                        onPress={pickImages}
                                        style={{ marginBottom: 8 }}
                                    >
                                        이미지 추가
                                    </Button>

                                    <View style={styles.imagePreviewRow}>
                                        {(field.state.value || []).map(
                                            (img: any, idx: number) => (
                                                <View
                                                    key={idx}
                                                    style={styles.previewItem}
                                                >
                                                    <Image
                                                        source={{
                                                            uri: img.uri,
                                                        }}
                                                        style={
                                                            styles.previewImg
                                                        }
                                                    />
                                                    <IconButton
                                                        icon="close"
                                                        size={16}
                                                        onPress={() =>
                                                            removeImage(idx)
                                                        }
                                                        style={styles.removeBtn}
                                                    />
                                                </View>
                                            ),
                                        )}
                                    </View>
                                </View>
                            );
                        }}
                    />

                    <form.Subscribe
                        selector={(state) => ({
                            canSubmit: state.canSubmit,
                            isSubmitting: state.isSubmitting,
                        })}
                        children={({ canSubmit, isSubmitting }) => (
                            <Button
                                mode="contained"
                                loading={
                                    isSubmitting || reviewMutation.isPending
                                }
                                disabled={
                                    !canSubmit || reviewMutation.isPending
                                }
                                onPress={form.handleSubmit}
                            >
                                {reviewId ? '수정하기' : '등록하기'}
                            </Button>
                        )}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = {
    imagePreviewRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    } as any,
    previewItem: {
        position: 'relative',
        marginRight: 8,
    } as any,
    previewImg: {
        width: 80,
        height: 80,
        borderRadius: 6,
        backgroundColor: '#eee',
    } as any,
    removeBtn: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'rgba(0,0,0,0.6)',
    } as any,
};

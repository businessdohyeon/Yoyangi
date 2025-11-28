import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { useForm } from '@tanstack/react-form';
import { LoginInfoContext } from '../../Context';
import { ScrollView } from 'react-native-gesture-handler';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import axiosInstance from '../../apis/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import apis from '../../apis';

// form 초기화

export default function ReviewForm({ route, navigation }) {
    const { facilityId } = route.params;
    const { facilityName } = route.params;
    const { loginInfo } = useContext(LoginInfoContext);
    const queryClient = useQueryClient();
    const { isAuthenticated } = useRequireAuth();

    // 로그인하지 않았으면 리다이렉션 처리됨 (useRequireAuth에서)
    if (!isAuthenticated) {
        return null; // 로그인 페이지로 리다이렉션 중
    }

    const reviewMutation = useMutation({
        mutationFn: async (formData: FormData) => {
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
            content: '',
            rating: '',
            reservationId: '',
            images: [],
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
                    values.value.images.forEach((img, idx) => {
                        if (img?.uri) {
                            formData.append('files', {
                                uri: img.uri,
                                name: `review_${idx}.jpg`,
                                type: 'image/jpeg',
                            });
                        }
                    });
                }

                reviewMutation.mutate(formData);
            } catch (err) {
                console.error(err);
            }
        },
    });

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={`${facilityName} 후기 쓰기`} />
            <ScrollView style={{ flex: 1, padding: 16 }}>
                <Card style={{ padding: 16 }}>
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
                                {field.state.meta.error ? (
                                    <Text style={{ color: 'red' }}>
                                        {field.state.meta.error}
                                    </Text>
                                ) : null}
                            </>
                        )}
                    />

                    <form.Field
                        name="rating"
                        validators={{
                            onChange: ({ value }) =>
                                !value || isNaN(value) || value < 1 || value > 5
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
                                {field.state.meta.error ? (
                                    <Text style={{ color: 'red' }}>
                                        {field.state.meta.error}
                                    </Text>
                                ) : null}
                            </>
                        )}
                    />

                    <form.Field
                        name="reservationId"
                        validators={{
                            onChange: ({ value }) =>
                                value && isNaN(value)
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

                    {/* 이미지 업로드 예시 - 간단히 로컬 배열에 저장 */}
                    {/* 실제로는 react-native-image-picker 등을 통해 처리 */}
                    <Button
                        mode="outlined"
                        onPress={() =>
                            Alert.alert('TODO', '이미지 선택 기능 구현 필요')
                        }
                        style={{ marginVertical: 10 }}
                    >
                        이미지 추가
                    </Button>

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
                                리뷰 등록
                            </Button>
                        )}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

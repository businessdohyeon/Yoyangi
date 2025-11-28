import React from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useForm } from '@tanstack/react-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LoginInfoContext } from '../../Context';
import axiosInstance from '../../apis/axios';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import apis from '../../apis';

export default function CommunityFormPage() {
    const navigation = useNavigation();
    const { loginInfo } = React.useContext(LoginInfoContext);
    const route = useRoute();
    const params = (route.params as any) || {};
    const communityId: number | undefined = params.communityId;
    const initialValuesFromRoute:
        | { title?: string; content?: string }
        | undefined = params.initialValues;
    const queryClient = useQueryClient();
    const { isAuthenticated } = useRequireAuth();

    // TODO: 수정하면 이미지는 바꿔치기가 아니라 추가가 되네

    const communityMutation = useMutation({
        mutationFn: async (data: { title: string; content: string }) => {
            if (communityId) {
                // edit existing community post
                const response = await axiosInstance.patch(
                    apis.urls.getCommunityById(communityId),
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${loginInfo.token}`,
                        },
                    },
                );
                return response.data;
            }

            // create new
            const response = await axiosInstance.post(
                apis.urls.CommunityFormPage,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${loginInfo.token}`,
                    },
                },
            );
            return response.data;
        },
        onSuccess: (json) => {
            console.log(json);
            queryClient.invalidateQueries({ queryKey: ['community'] });
            navigation.goBack();
        },
        onError: (e) => {
            console.error('submit error', e);
        },
    });

    const form = useForm({
        defaultValues: {
            title: initialValuesFromRoute?.title ?? '',
            content: initialValuesFromRoute?.content ?? '',
        },
        onSubmit: async ({ value }) => {
            communityMutation.mutate({
                title: value.title,
                content: value.content,
            });
        },
    });

    // 로그인하지 않았으면 리다이렉션 처리됨 (useRequireAuth에서)
    if (!isAuthenticated) {
        return null; // 로그인 페이지로 리다이렉션 중
    }

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title="커뮤니티 글 작성" />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* 제목 */}
                <form.Field
                    name="title"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? '제목은 필수 입력임' : undefined,
                    }}
                >
                    {(field) => (
                        <>
                            <Text
                                style={{ fontWeight: '700', marginBottom: 4 }}
                            >
                                제목
                            </Text>
                            <TextInput
                                mode="outlined"
                                value={field.state.value}
                                onChangeText={(v) => field.handleChange(v)}
                                onBlur={field.handleBlur}
                                error={!!(field.state.meta as any).error}
                            />
                            {(field.state.meta as any).error && (
                                <Text style={{ color: 'red', marginTop: 4 }}>
                                    {(field.state.meta as any).error}
                                </Text>
                            )}
                        </>
                    )}
                </form.Field>

                <View style={{ height: 24 }} />

                {/* 내용 */}
                <form.Field
                    name="content"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? '내용은 필수 입력임' : undefined,
                    }}
                >
                    {(field) => (
                        <>
                            <Text
                                style={{ fontWeight: '700', marginBottom: 4 }}
                            >
                                내용
                            </Text>
                            <TextInput
                                mode="outlined"
                                multiline
                                numberOfLines={6}
                                value={field.state.value}
                                onChangeText={(v) => field.handleChange(v)}
                                onBlur={field.handleBlur}
                                error={!!(field.state.meta as any).error}
                                style={{ minHeight: 150 }}
                            />
                            {(field.state.meta as any).error && (
                                <Text style={{ color: 'red', marginTop: 4 }}>
                                    {(field.state.meta as any).error}
                                </Text>
                            )}
                        </>
                    )}
                </form.Field>

                <View style={{ height: 32 }} />

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            mode="contained"
                            disabled={
                                !canSubmit ||
                                (communityMutation as any).isPending
                            }
                            loading={
                                isSubmitting ||
                                (communityMutation as any).isPending
                            }
                            onPress={() => form.handleSubmit()}
                        >
                            {communityId ? '수정하기' : '등록'}
                        </Button>
                    )}
                </form.Subscribe>
            </ScrollView>
        </SafeAreaView>
    );
}

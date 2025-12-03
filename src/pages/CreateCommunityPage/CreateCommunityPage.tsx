import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import {
    launchImageLibrary,
    ImageLibraryOptions,
} from 'react-native-image-picker';
import { useForm } from '@tanstack/react-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackNavProp } from '../../types/Navigation';
import { LoginInfoContext } from '../../Context';
import axiosInstance from '../../apis/axios';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import apis from '../../apis';

export default function CommunityFormPage() {
    const navigation = useNavigation<RootStackNavProp<'CommunityFormPage'>>();
    const { loginInfo } = React.useContext(LoginInfoContext);
    const route = useRoute();
    const params = (route.params ?? {}) as Partial<{
        communityId?: number;
        initialValues?: { title?: string; content?: string; images?: string[] };
    }>;
    const communityId: number | undefined = params.communityId;
    const initialValuesFromRoute = params.initialValues;
    const queryClient = useQueryClient();
    const { isAuthenticated } = useRequireAuth();

    const token = loginInfo?.token ?? '';

    const communityMutation = useMutation({
        mutationFn: async (data: FormData | Record<string, unknown>) => {
            const isForm =
                typeof (data as FormData & { append?: unknown }).append ===
                'function';
            if (communityId) {
                // edit existing community post
                const response = await axiosInstance.patch(
                    apis.urls.getCommunityById(communityId),
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            ...(isForm
                                ? { 'Content-Type': 'multipart/form-data' }
                                : {}),
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
                        Authorization: `Bearer ${token}`,
                        ...(isForm
                            ? { 'Content-Type': 'multipart/form-data' }
                            : {}),
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
            images:
                (initialValuesFromRoute?.images || []).map((u: string) => ({
                    uri: u,
                })) || [],
        },
        onSubmit: async ({ value }) => {
            try {
                // build FormData for multipart upload
                const formData = new FormData();
                formData.append('title', value.title);
                formData.append('content', value.content);

                if (Array.isArray(value.images) && value.images.length > 0) {
                    value.images.forEach(
                        (img: { uri?: string }, idx: number) => {
                            if (img?.uri) {
                                formData.append('images', {
                                    uri: img.uri,
                                    name: `community_${idx}.jpg`,
                                    type: 'image/jpeg',
                                } as unknown as Blob);
                            }
                        },
                    );
                }

                communityMutation.mutate(formData);
            } catch (err) {
                console.error(err);
            }
        },
    });

    // 로그인하지 않았으면 리다이렉션 처리됨 (useRequireAuth에서)
    if (!isAuthenticated) {
        // TODO: 현재 리다이렉션은 훅에서 처리되어 바로 `null`을 반환합니다.
        //       권장 개선사항:
        //       - 작성 중이던 내용 임시 저장(로컬) 후 로그인 후 복원
        //       - 리다이렉션 대신 명확한 안내 UI 또는 로그인 모달 제공
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
                                error={
                                    !!(field.state.meta as { error?: string })
                                        .error
                                }
                            />
                            {(field.state.meta as { error?: string }).error && (
                                <Text style={{ color: 'red', marginTop: 4 }}>
                                    {
                                        (field.state.meta as { error?: string })
                                            .error
                                    }
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
                                error={
                                    !!(field.state.meta as { error?: string })
                                        .error
                                }
                                style={{ minHeight: 150 }}
                            />
                            {(field.state.meta as { error?: string }).error && (
                                <Text style={{ color: 'red', marginTop: 4 }}>
                                    {
                                        (field.state.meta as { error?: string })
                                            .error
                                    }
                                </Text>
                            )}
                        </>
                    )}
                </form.Field>

                <View style={{ height: 32 }} />

                <form.Field
                    name="images"
                    children={(field) => {
                        const pickImages = async () => {
                            const opts: ImageLibraryOptions = {
                                mediaType: 'photo',
                                selectionLimit: 4,
                            };
                            try {
                                const res = await launchImageLibrary(opts);
                                if (res.didCancel) return;
                                const assets = res.assets || [];
                                const newImgs = assets
                                    .map((a) => a?.uri)
                                    .filter(Boolean)
                                    .map((uri) => ({ uri }));
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
                                    {(
                                        (field.state.value || []) as Array<{
                                            uri?: string;
                                        }>
                                    ).map((img, idx: number) => (
                                        <View
                                            key={idx}
                                            style={styles.previewItem}
                                        >
                                            <Image
                                                source={{ uri: img.uri }}
                                                style={styles.previewImg}
                                            />
                                            <IconButton
                                                icon="close"
                                                size={16}
                                                onPress={() => removeImage(idx)}
                                                style={styles.removeBtn}
                                            />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    }}
                />

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            mode="contained"
                            disabled={!canSubmit || communityMutation.isLoading}
                            loading={
                                isSubmitting || communityMutation.isLoading
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

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    imagePreviewRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 8,
    },
    previewItem: {
        position: 'relative',
        marginRight: 8,
    },
    previewImg: {
        width: 80,
        height: 80,
        borderRadius: 6,
        backgroundColor: '#eee',
    },
    removeBtn: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
});

import React, { useState } from 'react';
import { StyleSheet, Image, ScrollView, Alert, View } from 'react-native';
import { Button, ActivityIndicator, Text, Card } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import apis from '../../apis';
import axiosInstance from '../../apis/axios';
import { useMutation } from '@tanstack/react-query';

type PredictResultMap = Record<string, number>;

type PredictApiData = {
    image_quality: number;
    body_part: string;
    results_english: Record<string, number>;
    image_type: string;
    results_korean: PredictResultMap;
};

type PredictApiResponse = {
    data: PredictApiData;
    error_code: number;
    error_detail: {
        status_code: number;
        code: string;
        code_message: string;
        message: string;
    };
    log_id: string;
    request_id: string;
};

const PredictDiseasePage = () => {
    const [image, setImage] = useState<ImagePicker.Asset | null>(null);
    const [loading, _setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<Record<string, number> | null>(null);

    const pickImage = () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: true,
            },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    Alert.alert('이미지 선택 오류', response.errorMessage);
                    return;
                }
                const selected = response.assets?.[0];
                if (!selected) return;
                setImage(selected);
                setResults(null);
            },
        );
    };

    // console.log(image);

    const mutation = useMutation<PredictApiResponse, unknown, FormData>({
        mutationFn: async (formData: FormData) => {
            const resp = await axiosInstance.post(
                apis.urls.skinAnalysis,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                },
            );
            return resp.data as PredictApiResponse;
        },
        onSuccess: (data) => {
            setResults(data.data.results_korean);
        },
        onError: (err) => {
            console.error('uploadImage error', err);
            Alert.alert('업로드 오류', '이미지 업로드에 실패했습니다.');
        },
    });

    const uploadImage = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append('image', {
            uri: image.uri,
            type: image.type,
            name: (image.fileName as string) || 'upload.jpg',
        } as unknown as Blob);

        mutation.mutate(formData);
    };

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={'피부 질병 예측'} />
            <ScrollView contentContainerStyle={styles.container}>
                {image && (
                    <Image
                        source={{ uri: image.uri }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                )}
                <Button
                    mode="contained"
                    onPress={pickImage}
                    style={styles.button}
                >
                    이미지 선택
                </Button>
                <Button
                    mode="contained"
                    onPress={uploadImage}
                    style={styles.button}
                    disabled={loading || !image}
                >
                    예측 시작
                </Button>
                {loading && (
                    <ActivityIndicator
                        animating={true}
                        size="large"
                        style={styles.loading}
                    />
                )}
                {results && (
                    <View style={styles.resultsContainer}>
                        {Object.entries(results).map(([disease, score]) => (
                            <Card key={disease} style={styles.card}>
                                <Card.Content>
                                    <Text>{disease}</Text>
                                    <Text>
                                        확률: {(score * 100).toFixed(2)}%
                                    </Text>
                                </Card.Content>
                            </Card>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
    },
    title: {
        marginBottom: 16,
    },
    button: {
        marginVertical: 8,
        width: '90%',
    },
    image: {
        width: '90%',
        height: 250,
        marginVertical: 16,
    },
    loading: {
        marginVertical: 16,
    },
    resultsContainer: {
        width: '100%',
        marginTop: 16,
        alignItems: 'center',
    },
    card: {
        width: '90%',
        marginVertical: 8,
    },
});

export default PredictDiseasePage;

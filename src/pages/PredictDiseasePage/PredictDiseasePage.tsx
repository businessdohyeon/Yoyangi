import React, { useState } from 'react';
import { StyleSheet, Image, ScrollView, Alert, View } from 'react-native';
import { Button, ActivityIndicator, Text, Card } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockdata = {
    data: {
        image_quality: 93.5578,
        body_part: 'face',
        results_english: {
            acne: 0.1106,
            rosacea: 0.7895,
            lupus_erythematosus: 0.0521,
        },
        image_type: 'skin_lesion',
        results_korean: {
            여드름: 0.1106,
            주사피부염: 0.7895,
            루푸스: 0.0521,
        },
    },
    error_code: 0,
    error_detail: {
        status_code: 200,
        code: '',
        code_message: '',
        message: '',
    },
    log_id: '78057412',
    request_id: '2E4FFE4B-599E-5641-9826-542E560494F5',
};

const PredictDiseasePage = () => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

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
                const selected = response.assets[0];
                setImage(selected);
                setResults(null);
            },
        );
    };

    // console.log(image);

    const uploadImage = async () => {
        if (!image) {
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: image.uri,
                type: image.type,
                name: image.fileName,
            });

            // const response = await fetch(
            //     `${apis.urls.server}/exam/skin-analysis`,
            //     {
            //         method: 'POST',
            //         body: formData,
            //         headers: {
            //             'Content-Type': 'multipart/form-data',
            //             // TODO: 인증 토큰 필요 시 헤더 추가
            //         },
            //     },
            // );

            // const data = await response.json();

            const data = mockdata;

            // console.group('uploadImage');
            // console.log(response);
            console.log(data);
            // console.groupEnd();

            // if (response.ok) {
            setResults(data.data.results_korean);
            // } else {
            //     console.log(err);
            // }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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

import React, { useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Text } from 'react-native-paper';
import { useForm } from '@tanstack/react-form';
import apis from '../../apis';
import { LoginTokenContext } from '../../Context';
import PlainHeader from '../MainPage/PlainHeader';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';

export default function ReservationPage({ route }) {
    const { facilityId } = route.params;
    const { loginToken } = useContext(LoginTokenContext);

    console.group('ReservationPage rerandereed');
    console.log({ route, facilityId, loginToken });
    console.groupEnd();

    const form = useForm({
        defaultValues: {
            reserved_date: '',
            reserved_time: '',
            patient_name: '',
            patient_birth: '',
            patient_gender: '',
            patient_phone: '',
            disease_type: '',
            notes: '',
        },
        onSubmit: async ({ value }) => {
            try {
                const res = await fetch(
                    `${apis.urls.server}/facilities/${facilityId}/reservation`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${loginToken.token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(value),
                    },
                );

                const data = await res.json();

                if (!res.ok) {
                    console.error('예약 실패:', data);
                    return;
                }

                console.log('예약 성공:', data);
            } catch (err) {
                console.error('예약 실패:', err.response?.data || err.message);
            }
        },
    });

    return (
        <>
            <GoBackHeader />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text variant="titleLarge">예약 정보 입력</Text>

                {Object.entries({
                    reserved_date: '예약 날짜 (YYYY-MM-DD)',
                    reserved_time: '예약 시간 (HH:mm)',
                    patient_name: '환자 이름',
                    patient_birth: '생년월일 (YYYYMMDD)',
                    patient_gender: '성별 (남/여)',
                    patient_phone: '연락처',
                    disease_type: '질병 유형 (치매/재활/파킨슨 등)',
                    notes: '비고',
                }).map(([key, label]) => (
                    <form.Field
                        key={key}
                        name={key}
                        validators={{
                            onChange: (v) =>
                                !v
                                    ? `${label}은(는) 필수 항목입니다.`
                                    : undefined,
                        }}
                    >
                        {(field) => (
                            <View style={{ marginBottom: 12 }}>
                                <TextInput
                                    label={label}
                                    value={field.state.value}
                                    onChangeText={field.handleChange}
                                    mode="outlined"
                                />
                                <HelperText
                                    type="error"
                                    visible={!!field.state.meta.error}
                                >
                                    {field.state.meta.error}
                                </HelperText>
                            </View>
                        )}
                    </form.Field>
                ))}

                <Button
                    mode="contained"
                    onPress={() => form.handleSubmit()}
                    style={{ marginTop: 20 }}
                >
                    예약하기
                </Button>
            </ScrollView>
        </>
    );
}

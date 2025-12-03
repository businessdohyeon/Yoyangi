import React, { useContext, useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
    TextInput,
    Button,
    HelperText,
    Text,
    RadioButton,
    Menu,
} from 'react-native-paper';
import { useForm } from '@tanstack/react-form';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axiosInstance from '../../apis/axios';
import { LoginInfoContext } from '../../Context';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { ScreenProps } from '../../types/Navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import apis from '../../apis';

export default function ReservationPage({
    route,
    navigation,
}: ScreenProps<'ReservationPage'>) {
    // const navigation = useNavigation();

    const { facilityId, facilityName } = route.params || {};
    const { loginInfo } = useContext(LoginInfoContext);
    const queryClient = useQueryClient();
    const { isAuthenticated } = useRequireAuth();

    // 로그인하지 않았으면 리다이렉션 처리됨 (useRequireAuth에서)
    if (!isAuthenticated) {
        // TODO: 현재는 `useRequireAuth` 훅에서 리다이렉션을 처리하고 있어
        //       이 컴포넌트는 `null`을 반환합니다. UX 개선 권장:
        //       - 로딩/스켈레톤 화면 표시
        //       - 리다이렉션 중 명확한 메시지 또는 fallback UI 제공
        //       - 테스트 시 useRequireAuth 동작을 목(mock) 처리하여 컴포넌트 렌더링 검증
        return null; // 로그인 페이지로 리다이렉션 중
    }

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [diseaseMenuVisible, setDiseaseMenuVisible] = useState(false);

    const diseaseOptions = [
        '치매',
        '재활',
        '파킨슨',
        '뇌혈관성질환',
        '중풍',
        '암',
        '기타',
    ];

    const reservationMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post(
                apis.urls.crateReservation(facilityId),
                data,
                {
                    headers: {
                        Authorization: `Bearer ${loginInfo?.token ?? ''}`,
                    },
                },
            );
            return response.data;
        },
        onSuccess: (data) => {
            console.log('예약 성공:', data);
            queryClient.invalidateQueries({
                queryKey: ['facility', facilityId],
            });
            navigation.goBack();
        },
        onError: (err) => {
            console.error('예약 실패:', err.message);
        },
    });

    const form = useForm({
        defaultValues: {
            reserved_date: '',
            reserved_time: '',
            patient_name: '',
            patient_birth: '',
            patient_gender: 'M',
            patient_phone: '',
            disease_type: '',
            notes: '',
        },
        onSubmit: async (values) => {
            reservationMutation.mutate(values.value);
        },
    });

    const formatPhone = (text: string) =>
        text.replace(/\D/g, '').replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={`${facilityName} 예약`} />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text variant="titleLarge">예약 정보 입력</Text>

                {/* 날짜 선택 */}
                <form.Field
                    name="reserved_date"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? '필수 입력' : undefined,
                    }}
                >
                    {(field) => (
                        <>
                            <Button
                                mode="outlined"
                                onPress={() => setShowDatePicker(true)}
                                style={{ marginTop: 8 }}
                            >
                                {field.state.value || '예약 날짜 선택'}
                            </Button>
                            <DateTimePickerModal
                                isVisible={showDatePicker}
                                mode="date"
                                onConfirm={(date) => {
                                    field.handleChange(
                                        date.toISOString().split('T')[0],
                                    );
                                    setShowDatePicker(false);
                                }}
                                onCancel={() => setShowDatePicker(false)}
                            />
                            <HelperText
                                type="error"
                                visible={!!(field.state.meta as any).error}
                            >
                                {(field.state.meta as any).error}
                            </HelperText>
                        </>
                    )}
                </form.Field>

                {/* 시간 선택 */}
                <form.Field
                    name="reserved_time"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? '필수 입력' : undefined,
                    }}
                >
                    {(field) => (
                        <>
                            <Button
                                mode="outlined"
                                onPress={() => setShowTimePicker(true)}
                                style={{ marginTop: 8 }}
                            >
                                {field.state.value || '예약 시간 선택'}
                            </Button>
                            <DateTimePickerModal
                                isVisible={showTimePicker}
                                mode="time"
                                onConfirm={(time) => {
                                    field.handleChange(
                                        time.toTimeString().slice(0, 5),
                                    );
                                    setShowTimePicker(false);
                                }}
                                onCancel={() => setShowTimePicker(false)}
                            />
                            <HelperText
                                type="error"
                                visible={!!(field.state.meta as any).error}
                            >
                                {(field.state.meta as any).error}
                            </HelperText>
                        </>
                    )}
                </form.Field>

                {/* 환자 이름 */}
                <form.Field
                    name="patient_name"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? '필수 입력' : undefined,
                    }}
                >
                    {(field) => (
                        <>
                            <TextInput
                                label="환자 이름"
                                value={field.state.value}
                                onChangeText={field.handleChange}
                                onBlur={field.handleBlur}
                                mode="outlined"
                                style={{ marginTop: 8 }}
                            />
                            <HelperText
                                type="error"
                                visible={!!(field.state.meta as any).error}
                            >
                                {(field.state.meta as any).error}
                            </HelperText>
                        </>
                    )}
                </form.Field>

                {/* 생년월일 */}
                <form.Field
                    name="patient_birth"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? '필수 입력' : undefined,
                    }}
                >
                    {(field) => (
                        <>
                            <TextInput
                                label="생년월일 (YYYYMMDD)"
                                value={field.state.value}
                                onChangeText={(text) =>
                                    field.handleChange(text.replace(/\D/g, ''))
                                }
                                onBlur={field.handleBlur}
                                mode="outlined"
                                style={{ marginTop: 8 }}
                            />
                            <HelperText
                                type="error"
                                visible={!!(field.state.meta as any).error}
                            >
                                {(field.state.meta as any).error}
                            </HelperText>
                        </>
                    )}
                </form.Field>

                {/* 성별 */}
                <form.Field name="patient_gender">
                    {(field) => (
                        <RadioButton.Group
                            onValueChange={field.handleChange}
                            value={field.state.value}
                        >
                            <View
                                style={{ flexDirection: 'row', marginTop: 8 }}
                            >
                                <RadioButton.Item label="남" value="M" />
                                <RadioButton.Item label="여" value="F" />
                            </View>
                        </RadioButton.Group>
                    )}
                </form.Field>

                {/* 전화번호 */}
                <form.Field
                    name="patient_phone"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? '필수 입력' : undefined,
                    }}
                >
                    {(field) => (
                        <>
                            <TextInput
                                label="연락처"
                                value={field.state.value}
                                onChangeText={(text) =>
                                    field.handleChange(formatPhone(text))
                                }
                                onBlur={field.handleBlur}
                                keyboardType="phone-pad"
                                mode="outlined"
                                style={{ marginTop: 8 }}
                            />
                            <HelperText
                                type="error"
                                visible={!!(field.state.meta as any).error}
                            >
                                {(field.state.meta as any).error}
                            </HelperText>
                        </>
                    )}
                </form.Field>

                {/* 질병 유형 */}
                <form.Field
                    name="disease_type"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? '필수 입력' : undefined,
                    }}
                >
                    {(field) => (
                        <>
                            <Menu
                                visible={diseaseMenuVisible}
                                onDismiss={() => setDiseaseMenuVisible(false)}
                                anchor={
                                    <Button
                                        mode="outlined"
                                        onPress={() =>
                                            setDiseaseMenuVisible(true)
                                        }
                                        style={{ marginTop: 8 }}
                                    >
                                        {field.state.value || '질병 유형 선택'}
                                    </Button>
                                }
                            >
                                {diseaseOptions.map((d) => (
                                    <Menu.Item
                                        key={d}
                                        title={d}
                                        onPress={() => {
                                            field.handleChange(d);
                                            setDiseaseMenuVisible(false);
                                        }}
                                    />
                                ))}
                            </Menu>
                            <HelperText
                                type="error"
                                visible={!!(field.state.meta as any).error}
                            >
                                {(field.state.meta as any).error}
                            </HelperText>
                        </>
                    )}
                </form.Field>

                {/* 비고 */}
                <form.Field name="notes">
                    {(field) => (
                        <>
                            <TextInput
                                label="비고"
                                value={field.state.value}
                                onChangeText={field.handleChange}
                                mode="outlined"
                                style={{ marginTop: 8 }}
                            />
                        </>
                    )}
                </form.Field>

                <Button
                    mode="contained"
                    loading={reservationMutation.isPending}
                    disabled={reservationMutation.isPending}
                    onPress={() => form.handleSubmit()}
                    style={{ marginTop: 20 }}
                >
                    예약하기
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

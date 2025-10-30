import { Button, Text, TextInput } from 'react-native-paper';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import z from 'zod';
import { View } from 'react-native';
import apis from '../../apis';

const { fieldContext, formContext } = createFormHookContexts();

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm } = createFormHook({
    fieldComponents: {
        TextInput,
    },
    formComponents: {
        Button,
    },
    fieldContext,
    formContext,
});

const tmpBody = {
    Message: 'OO기관에 홍길동님의 예약이 완료되었습니다.',
    ResultCode: 'SUCCESS',
    data: {
        reservation: {
            id: 123,
            facility_id: 1,
            reserved_date: '2025-10-05',
            reserved_time: '10:00',
            status: 'PENDING',
        },
        patient: {
            // 진료 대상자
            name: '김철수',
            birth: '1950-05-12',
            gender: 'M',
            phone: '010-1234-5678',
            disease_type: '치매',
            notes: '기저질환 있음',
        },
        reservation_user: {
            id: 7,
            name: '홍길동',
            phone: '010-9876-5432',
        },
        facility: {
            id: 1,
            name: 'OO 요양원',
        },
    },
};

// TODO: auth gard for this route?
const ReservationPage = ({ route }) => {
    const { params } = route;
    const {id} = params;
    console.log('params', params);

    const form = useAppForm({
        defaultValues: {
            username: '',
            age: 0,
        },
        validators: {
            // Pass a schema or function to validate
            onChange: z.object({
                username: z.string(),
                age: z.number().min(13),
            }),
        },
        onSubmit: ({ value }) => {
            // Do something with form data
            console.log(JSON.stringify(value, null, 2));
        },
    });

    const submitFunc = async()=>{
        const res = await fetch(`${apis.urls.server}/facilities/${id}/reservation`, {
            method: "POST",
            headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer {JWT_TOKEN}`,
            },
            body: JSON.stringify(tmpBody),
        });

        const json = await res.json();

        console.log("json", json);
    }

    return (
        <View>
            <Text>adfadfdas</Text>
            <form.Field
                name="age"
                validators={{
                    onChange: (val) =>
                        val < 13
                            ? 'You must be 13 to make an account'
                            : undefined,
                }}
            >
                {(field) => (
                    <>
                        <Text>Age:</Text>
                        <TextInput
                            value={field.state.value}
                            onChangeText={field.handleChange}
                        />
                        {!field.state.meta.isValid && (
                            <Text>{field.state.meta.errors.join(', ')}</Text>
                        )}
                    </>
                )}
            </form.Field>
            <Text>adfadfdas</Text>
            <Button onPress={submitFunc} >submit</Button>
        </View>
    );
};

export default ReservationPage;

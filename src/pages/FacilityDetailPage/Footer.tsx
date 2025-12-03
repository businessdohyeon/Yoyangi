import { useContext } from 'react';
import { View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/Navigation';
import { LoginInfoContext } from '../../Context';
import { FacilityData_t } from '../../types/FacilityDataScheme';

export default function Footer({
    facilityData,
}: {
    facilityData: FacilityData_t;
}) {
    const { loginInfo } = useContext(LoginInfoContext);
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const theme = useTheme();

    return (
        <View
            style={{
                borderTopWidth: 1,
                borderColor: theme.colors.secondaryContainer,
                flexDirection: 'row',
                backgroundColor: theme.colors.background,
                height: 50,
            }}
        >
            <View
                style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button
                    icon={'calendar'}
                    onPress={() => {
                        navigation.navigate('ReservationPage', {
                            facilityId: facilityData.id,
                            facilityName: facilityData.name,
                        });
                    }}
                    style={{}}
                >
                    예약
                </Button>
            </View>
            <View
                style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button
                    icon={'phone'}
                    onPress={() => {
                        navigation.navigate('ChatPage', {
                            facility_id: facilityData.id,
                            guardian_id: loginInfo?.userId ?? 0,
                            sender: loginInfo?.userId ?? 0,
                            sender_type: 'guardian',
                        });
                    }}
                >
                    상담
                </Button>
            </View>
            <View
                style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button
                    icon={'pencil'}
                    onPress={() => {
                        navigation.navigate('ReviewForm', {
                            facilityId: facilityData.id,
                            facilityName: facilityData.name,
                        });
                    }}
                >
                    후기작성
                </Button>
            </View>
        </View>
    );
}

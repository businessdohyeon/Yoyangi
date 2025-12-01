import { useContext } from 'react';
import { View } from 'react-native';
import { Card, Icon, IconButton, Text, useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { TabAndStackCompositeNav } from '../../types/Navigation';
import apis from '../../apis';
import axiosInstance from '../../apis/axios';

import { LoginInfoContext } from '../../Context';

import { FacilityData_t } from '../../types/FacilityDataScheme';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function SearchResult({
    facilityData,
}: {
    facilityData: FacilityData_t;
}) {
    const navigation =
        useNavigation<TabAndStackCompositeNav<'SearchPage', 'Tabs'>>();
    const theme = useTheme();
    const { loginInfo } = useContext(LoginInfoContext);
    const queryClient = useQueryClient();

    const userLikeMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post(
                apis.urls.userLike(loginInfo.userId, facilityData.id),
                {},
                {
                    headers: {
                        Authorization: `Bearer ${loginInfo.token}`,
                    },
                },
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
    });

    const userLike = () => {
        if (!loginInfo?.token || loginInfo?.userId === 0) {
            navigation.navigate('LoginPage', {
                returnScreen: 'SearchPage',
            });
            return;
        }
        userLikeMutation.mutate();
    };

    return (
        <Card
            style={{
                marginBottom: 10,
                backgroundColor: theme.colors.background,
            }}
            onPress={() => {
                navigation.navigate('FacilityDetailPage', {
                    id: facilityData.id,
                });
            }}
        >
            <Card.Content>
                <View
                    style={{
                        flexDirection: 'row',
                        marginBottom: 20,
                    }}
                >
                    <View style={{ flex: 6 }}>
                        {facilityData.approval_status ? (
                            <View>
                                <Text>"인증시설입니다"</Text>
                            </View>
                        ) : null}
                        <View>
                            <Text variant="titleMedium">
                                {facilityData.name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginRight: 10 }}>
                                <Text>별점</Text>
                            </View>
                            <View style={{ marginRight: 10 }}>
                                <Text>{`${facilityData.sggu_name} ${facilityData.sido_name}`}</Text>
                            </View>
                            <View style={{ marginRight: 10 }}>
                                <Text>{facilityData.kind}</Text>
                            </View>
                        </View>
                        <View>
                            <Text>오늘 0700-2100</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <IconButton icon={'heart-outline'} onPress={userLike} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            color="gray"
                            size={30}
                            source={'hand-heart-outline'}
                        />
                        <Text>파킨슨</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon color="gray" size={30} source={'brain'} />
                        <Text>치매</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            color="gray"
                            size={30}
                            source={'shield-cross-outline'}
                        />
                        <Text>암</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon color="gray" size={30} source={'heart'} />
                        <Text>중풍</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon size={30} source={'medication'} />
                        <Text>힌방</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
}

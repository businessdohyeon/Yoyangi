import { useContext, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    IconButton,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';

import { showBorder } from '../../common';
import axiosInstance from '../../apis/axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ScreenProps } from '../../types/Navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoBackHeader from './GoBackHeader';
import { LoginInfoContext } from '../../Context';
import {
    FacilityData_t,
    FacilityDataSchema,
} from '../../types/FacilityDataScheme';
import { FacilityNotice } from './FacilityNotice';
import { FacilityReview } from './FacilityReview';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apis from '../../apis';
import { FacilityInfo } from './FacilityInfo';
import HeroSection from './HeroSection';

export default function FacilityDetailPage({
    route,
}: ScreenProps<'FacilityDetailPage'>) {
    const theme = useTheme();
    const { loginInfo } = useContext(LoginInfoContext);
    const id = route.params?.facilityId ?? (route.params as any)?.id;
    const scrollRef = useRef<ScrollView | null>(null);
    const navigation =
        useNavigation<
            NativeStackNavigationProp<RootStackParamList, 'FacilityDetailPage'>
        >();
    const queryClient = useQueryClient();

    const [tabIndex, setTabIndex] = useState(0);

    console.group('[rerender]: FacilityDetailPage');
    console.log({ id });
    console.log(loginInfo);
    console.groupEnd();

    const { data: facilityData = {} as FacilityData_t, isLoading } = useQuery({
        queryKey: ['facility', id],
        queryFn: async () => {
            const response = await axiosInstance.get(
                apis.urls.getFacilityById(id),
            );
            const { Response } = response.data;
            const tmp = FacilityDataSchema.parse(Response);

            console.group('fetchFacilityData');
            console.log(tmp);
            console.groupEnd();

            return tmp;
        },
        staleTime: 5 * 60 * 1000,
    });

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
            queryClient.invalidateQueries({ queryKey: ['facility', id] });
        },
    });

    const userLike = () => {
        if (!loginInfo?.token || loginInfo?.userId === 0) {
            navigation.navigate('LoginPage', {
                returnScreen: 'FacilityDetailPage',
                returnParams: { id },
            });
            return;
        }
        userLikeMutation.mutate();
    };

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={facilityData.name} />
            <ScrollView
                contentContainerStyle={{
                    backgroundColor: '#eeeeee',
                }}
            >
                {isLoading ? (
                    <ActivityIndicator style={{ marginVertical: 50 }} />
                ) : (
                    <>
                        <HeroSection
                            facilityData={facilityData}
                            userLike={userLike}
                        />
                        {/* 이동버튼 */}
                        <TabNav tabIndex={tabIndex} setTabIndex={setTabIndex}/>
                        {/* 구체적인 정보들 */}
                        <ScrollView
                            pagingEnabled
                            horizontal={true}
                            style={{
                                backgroundColor: '#eeeeee',
                                paddingBottom: 10,
                            }}
                            ref={scrollRef}
                        >
                            {/* 병원정보 */}
                            {tabIndex === 0 ? (
                                <FacilityInfo facilityData={facilityData} />
                            ) : tabIndex === 1 ? (
                                <FacilityNotice facilityData={facilityData} />
                            ) : (
                                <FacilityReview facilityData={facilityData} />
                            )}
                        </ScrollView>
                        {/* 버그신고등등등 */}
                        <View
                            style={{ paddingBottom: 50, paddingHorizontal: 10 }}
                        >
                            <TouchableRipple
                                onPress={() => {
                                    console.log('bla');
                                }}
                            >
                                <Text>알고계신 병원 정보와 다른가요?</Text>
                            </TouchableRipple>
                            <TouchableRipple
                                onPress={() => {
                                    console.log('bla');
                                }}
                            >
                                <Text>이 병원의 관계자이신가요?</Text>
                            </TouchableRipple>
                        </View>
                    </>
                )}
            </ScrollView>
            {/* footer */}
            <Footer facilityData={facilityData} />
        </SafeAreaView>
    );
}

function Footer({ facilityData }: { facilityData: FacilityData_t }) {
    const { loginInfo } = useContext(LoginInfoContext);
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const theme = useTheme();

    return (
        <View
            style={{
                ...showBorder,
                flexDirection: 'row',
                backgroundColor: theme.colors.background,
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <IconButton icon={'heart'} size={30} onPress={() => {}} />
            </View>
            <View
                style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button
                    icon={'heart'}
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
                            guardian_id: loginInfo.userId,
                            sender: loginInfo.userId,
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
                    icon={'phone'}
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


function TabNav({tabIndex, setTabIndex }) {
    const theme = useTheme();

    return (
         <View
                            style={{
                                ...showBorder,
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                backgroundColor: theme.colors.background,
                                overflow: 'visible',
                            }}
                        >
                            <TouchableRipple
                                style={{
                                    flex: 1,
                                    borderBottomWidth: 10,
                                    borderBottomColor:
                                        tabIndex === 0
                                            ? theme.colors.primary
                                            : '#dddddd',
                                    backgroundColor: theme.colors.background,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setTabIndex(0);
                                }}
                            >
                                <Text
                                    style={{ marginVertical: 5 }}
                                    variant="titleMedium"
                                >
                                    병원정보
                                </Text>
                            </TouchableRipple>
                            <TouchableRipple
                                style={{
                                    flex: 1,
                                    borderBottomWidth: 10,
                                    borderBottomColor:
                                        tabIndex === 1
                                            ? theme.colors.primary
                                            : '#dddddd',
                                    backgroundColor: theme.colors.background,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setTabIndex(1);
                                }}
                            >
                                <Text
                                    style={{ marginVertical: 5 }}
                                    variant="titleMedium"
                                >
                                    병원소식
                                </Text>
                            </TouchableRipple>
                            <TouchableRipple
                                style={{
                                    flex: 1,
                                    borderBottomWidth: 10,
                                    borderBottomColor:
                                        tabIndex === 2
                                            ? theme.colors.primary
                                            : '#dddddd',
                                    backgroundColor: theme.colors.background,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    setTabIndex(2);
                                }}
                            >
                                <Text
                                    style={{ marginVertical: 5 }}
                                    variant="titleMedium"
                                >
                                    후기
                                </Text>
                            </TouchableRipple>
                        </View>
    );
}
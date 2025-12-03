import { ScrollView, View } from 'react-native';
import { Button, Searchbar, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import apis from '../../apis';
import axiosInstance from '../../apis/axios';
import { LocationInfoContext } from '../../Context';
import {
    GeoApiResponse,
    GeoApiResponseWrapper,
    GeoLocationResult,
} from '../../types/GeoLocation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditLocationPage = () => {
    const nav = useNavigation();
    const theme = useTheme();
    const { locationInfo, storeLocationInfo } = useContext(LocationInfoContext);

    const [searchQuery, setSearchQuery] = useState('');

    // Geolocation API 타입들은 `src/types/GeoLocation.ts`에 정의되어 있습니다.

    const [searchResult, setSearchResult] = useState<GeoLocationResult>(null);

    const queryClient = useQueryClient();

    const geolocationMutation = useMutation({
        mutationFn: async (location: string) => {
            const res = await axiosInstance.get<GeoApiResponseWrapper>(
                apis.urls.getGeoLocation,
                { params: { location } },
            );

            // 응답이 { Response: { ... } } 형태인지, 아니면 바로 { ... } 형태인지 모두 처리
            const payload: GeoApiResponse =
                'Response' in res.data ? res.data.Response : res.data;

            console.log('geolocation payload:', payload);

            const tmp =
                payload?.addresses && payload.addresses.length > 0
                    ? payload.addresses[0]
                    : null;

            if (!tmp) return null;

            // addressElements에서 types에 'SIGUGUN'이 포함된 항목의 shortName을 displayName으로 사용
            let displayName = '';
            if (Array.isArray(tmp.addressElements)) {
                const sigugun = tmp.addressElements.find(
                    (ae) =>
                        Array.isArray(ae.types) && ae.types.includes('SIGUGUN'),
                );
                if (sigugun && sigugun.shortName)
                    displayName = sigugun.shortName;
            }

            if (!displayName) {
                // fallback: 지번주소 또는 도로명 주소
                displayName = tmp.jibunAddress || tmp.roadAddress || '';
            }

            return {
                roadAddress: tmp.roadAddress,
                latitude: Number(tmp.y),
                longitude: Number(tmp.x),
                displayName,
            } as GeoLocationResult;
        },
        onSuccess: (data) => {
            setSearchResult(data as GeoLocationResult);
            const cacheKey = ['geolocation', searchQuery];
            setSearchQuery('');
            // 위치 검색 결과 캐싱
            queryClient.setQueryData(cacheKey, data);
            console.log('Geolocation search successful', data);
        },
        onError: (error) => {
            console.log('Geolocation search error', error);
        },
    });

    const onSubmitEditing = () => {
        if (searchQuery === '') return;
        geolocationMutation.mutate(searchQuery);
    };

    const register = () => {
        console.log(searchResult);
        if (!searchResult) return;

        // Context의 LocationInfo 스키마는 숫자 타입의 latitude/longitude를 기대하므로 변환
        const payload = {
            roadAddress: searchResult.roadAddress,
            latitude: Number(searchResult.latitude),
            longitude: Number(searchResult.longitude),
            displayName: searchResult.displayName,
        };

        storeLocationInfo(payload);
        nav.goBack();
    };

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={'위치 설정'} />
            <ScrollView
                contentContainerStyle={{
                    gap: 30,
                    backgroundColor: '#eeeeee',
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                }}
            >
                <Searchbar
                    placeholder="도로명 주소를 입력해주세요"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    onSubmitEditing={onSubmitEditing}
                />
                <View
                    style={{
                        backgroundColor: theme.colors.background,
                        paddingVertical: 15,
                        paddingHorizontal: 15,
                        gap: 15,
                        borderRadius: 10,
                    }}
                >
                    <Text variant="titleMedium">검색결과</Text>
                    <View
                        style={{
                            justifyContent: 'center',
                        }}
                    >
                        <Text variant="titleMedium">
                            {searchResult === null
                                ? '검색결과가 없습니다'
                                : searchResult.roadAddress}
                        </Text>
                    </View>
                    {searchResult !== null && (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                            }}
                        >
                            <Button mode="outlined" onPress={register}>
                                등록
                            </Button>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditLocationPage;

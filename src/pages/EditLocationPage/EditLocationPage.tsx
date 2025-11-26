import { ScrollView, View } from 'react-native';
import { Appbar, Button, Searchbar, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import apis from '../../apis';
import axiosInstance from '../../apis/axios';
import { LocationInfoContext } from '../../Context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { showBorder } from "./common.js"

const _goBack = () => console.log('Went back');
const _handleSearch = () => console.log('Searching');
const _handleMore = () => console.log('Shown more');

const EditLocationPage = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const { locationInfo, storeLocationInfo } = useContext(LocationInfoContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const queryClient = useQueryClient();

    const geolocationMutation = useMutation({
        mutationFn: async (location: string) => {
            const response = await axiosInstance.get(
                apis.urls.getGeoLocaton.replace(apis.urls.server, ''),
                { params: { location } },
            );
            const { Response } = response.data;
            const { addresses } = Response;
            const tmp = addresses[0];

            return {
                roadAddress: tmp.roadAddress,
                latitude: tmp.y,
                longitude: tmp.x,
            };
        },
        onSuccess: (data) => {
            setSearchResult(data);
            setSearchQuery('');
            // 위치 검색 결과 캐싱 (5분)
            queryClient.setQueryData(['geolocation', searchQuery], data);
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
        storeLocationInfo(searchResult);
    };


    return (
        <>
            <Appbar.Header>
                <Appbar.Action icon="map-marker" onPress={_handleSearch} />
                <Appbar.Content title={locationInfo?.roadAddress} />
                <Appbar.Action
                    icon="magnify"
                    onPress={() => {
                        navigation.navigate('SearchPage');
                    }}
                />
                <Appbar.Action icon="bell" onPress={_handleMore} />
            </Appbar.Header>
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
        </>
    );
};

export default EditLocationPage;

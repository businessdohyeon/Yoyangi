import { ScrollView, View } from 'react-native';
import { Appbar, Button, Searchbar, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import apis from '../../apis';
import { LocationInfoContext } from '../../Context';
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

    const onSubmitEditing = async () => {
        if (searchQuery === '') return;

        try {
            const res = await fetch(
                `${apis.urls.getGeoLocaton}?location=${searchQuery}`,
            );
            const json = await res.json();
            const { Response } = json;
            const { addresses } = Response;
            const tmp = addresses[0];

            const newSearchResult = {
                roadAddress: tmp.roadAddress,
                latitude: tmp.x,
                longitude: tmp.y,
            };

            console.log(json);

            setSearchResult(newSearchResult);
            setSearchQuery('');
        } catch (error) {
            console.log(error);
        } finally {
            console.log('finally');
        }
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

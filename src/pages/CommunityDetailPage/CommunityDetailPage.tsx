import { useContext, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import {
    ActivityIndicator,
    Appbar,
    Avatar,
    Button,
    Card,
    Text,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// import { showBorder } from "./common.js"
import apis from '../../apis';
import { LoginInfoContext } from '../../Context';

const _goBack = () => console.log('Went back');
const _handleSearch = () => console.log('Searching');
const _handleMore = () => console.log('Shown more');

const CommunityDetailPage = ({ route }) => {
    const navigation = useNavigation();

    console.log('route', route);

    return (
        <>
            <Appbar.Header>
                <Appbar.Action icon="map-marker" onPress={_handleSearch} />
                {/* TODO: 현재위치 가져오는거 */}
                <Appbar.Content title="현재위치" />
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
                    gap: 10,
                    backgroundColor: '#eeeeee',
                    padding: 10,
                }}
            >
                <Text>CommunityDetailPage </Text>
            </ScrollView>
        </>
    );
};

export default CommunityDetailPage;

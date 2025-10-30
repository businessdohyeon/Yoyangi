
import { useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, View } from 'react-native';
import { Appbar, Button, Card, Chip, FAB, Icon, Searchbar, SegmentedButtons, Surface, Text, TouchableRipple } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, BottomNavigation } from 'react-native-paper';
import {
  CommonActions,
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import CardActions from 'react-native-paper/lib/typescript/components/Card/CardActions';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
// import { showBorder } from "./common.js"
import { showBorder} from '../../common';

const _goBack = () => console.log('Went back');
const _handleSearch = () => console.log('Searching');
const _handleMore = () => console.log('Shown more');

const ProfilePage = () => {
    const navigation = useNavigation();

    return (
    <>
        <Appbar.Header>
            <Appbar.Action icon="map-marker" onPress={_handleSearch} />
            {/* TODO: 현재위치 가져오는거 */}
            <Appbar.Content title="현재위치" />
            <Appbar.Action icon="magnify" onPress={()=> { navigation.navigate("SearchPage") }} />
            <Appbar.Action icon="bell" onPress={_handleMore} />
        </Appbar.Header>
        <ScrollView contentContainerStyle={{ gap: 10, backgroundColor: "#eeeeee" }}>
            <Text>ProfilePage</Text>
        </ScrollView>
    </>
    );
};

export default ProfilePage;
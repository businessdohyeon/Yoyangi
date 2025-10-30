import { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, useWindowDimensions, View } from 'react-native';
import {
    ActivityIndicator,
    Appbar,
    Button,
    Card,
    Icon,
    IconButton,
    SegmentedButtons,
    Text,
    useTheme,
} from 'react-native-paper';

// import { showBorder } from "./common.js"
import { showBorder } from '../../common';
import apis from '../../apis';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function GoBackHeader({ title }) {
    const navigation = useNavigation();
    const theme = useTheme();

    return (
        <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
            <Appbar.BackAction
                onPress={() => {
                    navigation.dispatch(CommonActions.goBack());
                }}
            />
            <Appbar.Content title={title} />
            <Appbar.Action
                icon="magnify"
                onPress={() => {
                    console.log('Searching');
                }}
            />
            <Appbar.Action
                icon="dots-vertical"
                onPress={() => {
                    console.log('Shown more');
                }}
            />
        </Appbar.Header>
    );
}
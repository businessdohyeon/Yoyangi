import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { LocationInfoContext, LoginTokenContext } from '../../Context';

export default function PlainHeader() {
    const navigation = useNavigation();
    const theme = useTheme();
    const { locationInfo } = useContext(LocationInfoContext);
    const { loginToken } = useContext(LoginTokenContext);

    return (
        <Appbar.Header
            elevated
            style={{ backgroundColor: theme.colors.background }}
        >
            <Appbar.Action
                icon="map-marker"
                iconColor={theme.colors.primary}
                onPress={() => {
                    navigation.navigate('EditLocationPage');
                }}
            />
            {/* TODO: 현재위치 가져오는거 */}
            <Appbar.Content title={locationInfo?.roadAddress} />
            <Appbar.Action
                icon="magnify"
                onPress={() => {
                    // TODO: searchPage로 리다이렉션 할 때 seachbox에 focus된 채로?
                    navigation.navigate('SearchPage');
                }}
            />
            <Appbar.Action
                icon="bell"
                onPress={() => navigation.navigate('NotificationPage')}
            />
        </Appbar.Header>
    );
}

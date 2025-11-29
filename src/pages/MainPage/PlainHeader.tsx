import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TabAndStackCompositeNav } from '../../types/Navigation';
import { useContext } from 'react';
import { LocationInfoContext, LoginInfoContext } from '../../Context';

export default function PlainHeader() {
    const navigation = useNavigation<TabAndStackCompositeNav<'MainPage', 'Tabs'>>();
    const theme = useTheme();
    const { locationInfo } = useContext(LocationInfoContext);
    const { loginInfo } = useContext(LoginInfoContext);

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
            <Appbar.Content title={locationInfo?.displayName} />
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

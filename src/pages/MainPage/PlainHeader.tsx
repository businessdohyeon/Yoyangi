import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function PlainHeader() {
    const navigation = useNavigation();
    const theme = useTheme();

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
            <Appbar.Content title="현재위치" />
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

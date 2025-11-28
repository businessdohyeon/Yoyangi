import { Appbar, useTheme } from 'react-native-paper';
import { CommonActions, useNavigation } from '@react-navigation/native';

export default function GoBackHeader({ title }: { title: string }) {
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

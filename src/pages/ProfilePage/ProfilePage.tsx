import { ScrollView } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import PlainHeader from '../MainPage/PlainHeader';
// import { showBorder } from "./common.js"

const _goBack = () => console.log('Went back');
const _handleSearch = () => console.log('Searching');
const _handleMore = () => console.log('Shown more');

const ProfilePage = () => {
    const navigation = useNavigation();

    return (
        <>
            <PlainHeader/>
            <ScrollView
                contentContainerStyle={{ gap: 10, backgroundColor: '#eeeeee' }}
            >
                <Text>ProfilePage</Text>
                <Button onPress={() => navigation.navigate('LoginPage')}>
                    login
                </Button>
            </ScrollView>
        </>
    );
};

export default ProfilePage;

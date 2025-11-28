import { ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// import { showBorder } from "./common.js"

const ProfilePage = () => {
    const navigation = useNavigation();

    return (
        <>
            <ScrollView
                contentContainerStyle={{ gap: 10, backgroundColor: '#eeeeee' }}
            >
                <Text>ProfilePage</Text>
            </ScrollView>
        </>
    );
};

export default ProfilePage;

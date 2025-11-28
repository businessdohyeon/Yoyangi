import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationPage = () => {
    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <Text>NotificationPage</Text>
        </SafeAreaView>
    );
};

export default NotificationPage;

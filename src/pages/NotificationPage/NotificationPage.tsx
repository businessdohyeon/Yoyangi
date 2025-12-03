import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRequireAuth } from '../../hooks/useRequireAuth';

const NotificationPage = () => {
    const { isAuthenticated } = useRequireAuth();

    if (!isAuthenticated) return null; // 리다이렉션 중

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <Text>NotificationPage</Text>
        </SafeAreaView>
    );
};

export default NotificationPage;

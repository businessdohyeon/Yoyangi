import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { useRequireAuth } from '../../hooks/useRequireAuth';

export default function CommunityFormPage() {
    const { isAuthenticated } = useRequireAuth();

    if (!isAuthenticated) return null;

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title="커뮤니티 글 작성" />
            <View style={{ padding: 16 }}>
                <Text>
                    커뮤니티 글 작성 페이지입니다. 기존 구현은 주석 처리되어
                    있습니다.
                </Text>
            </View>
        </SafeAreaView>
    );
}

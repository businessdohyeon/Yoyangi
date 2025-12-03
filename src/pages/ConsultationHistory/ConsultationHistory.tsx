import { View, FlatList } from 'react-native';
import { ActivityIndicator, List, Text, useTheme } from 'react-native-paper';
import axiosInstance from '../../apis/axios';
import apis from '../../apis';
import { useContext } from 'react';
import { LoginInfoContext } from '../../Context';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavProp } from '../../types/Navigation';
import { useRequireAuth } from '../../hooks/useRequireAuth';

// 타입 정의
type ChatRoom = {
    room_id: string;
    last_message: string;
    created_at: string;
    updated_at: string;
    facility_id: number | null;
    guardian_id: number | null;
    facility: { id: number; name: string } | null;
    user: { id: number; name: string } | null;
};

type GetRoomsResponse = {
    Message: string;
    ResultCode: string;
    Size: number;
    Response: ChatRoom[];
};

// simple left icon component moved out of render to satisfy lint rules
// Left icon props typed using List.Icon props
const LeftChatIcon = (props: React.ComponentProps<typeof List.Icon>) => (
    <List.Icon {...props} icon="chat" />
);
const ItemSeparator = () => (
    <View style={{ height: 1, backgroundColor: '#eee' }} />
);

export default function ConsultationHistory() {
    const { loginInfo } = useContext(LoginInfoContext);
    const theme = useTheme();
    const navigation = useNavigation<RootStackNavProp<'ConsultationHistory'>>();
    const { isAuthenticated } = useRequireAuth();

    if (!isAuthenticated) return null;

    const { data, isLoading, isError } = useQuery<GetRoomsResponse>({
        queryKey: ['chats', 'rooms', loginInfo?.userId ?? 0],
        queryFn: async () => {
            const res = await axiosInstance.get(apis.urls.getRooms);
            return res.data as GetRoomsResponse;
        },
        enabled: !!loginInfo?.userId,
        staleTime: 30 * 1000,
    });

    const rooms: ChatRoom[] = data?.Response ?? [];

    const renderItem = ({ item }: { item: ChatRoom }) => {
        const title = item.facility?.name ?? '알 수 없는 시설';
        const subtitle = item.user?.name ?? '알 수 없는 사용자';

        const disabled = !item.facility_id || !item.guardian_id;

        console.log(item);

        return (
            <List.Item
                title={title}
                description={`${subtitle} · ${
                    item.last_message || ''
                } · ${new Date(item.updated_at).toLocaleString()}`}
                onPress={() => {
                    if (disabled) return;
                    navigation.navigate('ChatPage', {
                        facility_id: item.facility_id!,
                        facility_name: item.facility?.name!,
                    });
                }}
                left={LeftChatIcon}
            />
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView>
                <GoBackHeader title="상담 내역 조회" />
                <View style={{ padding: 20 }}>
                    <ActivityIndicator animating color={theme.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <SafeAreaView>
                <GoBackHeader title="상담 내역 조회" />
                <View style={{ padding: 20 }}>
                    <Text>내역을 불러오는 중 오류가 발생했습니다.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GoBackHeader title="상담 내역 조회" />
            <FlatList
                data={rooms}
                keyExtractor={(item) => item.room_id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 120 }}
                ItemSeparatorComponent={ItemSeparator}
            />
        </SafeAreaView>
    );
}

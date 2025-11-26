import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Card, FAB, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// import { showBorder } from "./common.js"
import apis from '../../apis';
import axiosInstance from '../../apis/axios';
import PlainHeader from '../MainPage/PlainHeader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FlatList } from 'react-native';

export default function CommunityPage() {
    const navigation = useNavigation();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useInfiniteQuery({
        queryKey: ['community'],
        queryFn: async ({ pageParam }) => {
            const params = { limit: 10 };
            if (pageParam) {
                params.lastId = pageParam;
            }
            const response = await axiosInstance.get('/community', { params });
            const items = response.data.Community || response.data.Communities || [];
            return items;
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) return undefined;
            return lastPage[lastPage.length - 1]?.id;
        },
        initialPageParam: undefined,
        staleTime: 60 * 1000, // 1분 캐싱 (커뮤니티 글은 새로 추가될 수 있음)
    });

    const items = data?.pages.flat() || [];
    const loading = isFetching && items.length === 0;
    const refreshing = isRefetching;

    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const loadInitial = () => {
        refetch();
    };

    return (
        <>
            <PlainHeader />
            <View style={styles.container}>
                {loading && items.length === 0 ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : (
                    <FlatList
                        data={items}
                        keyExtractor={(i) => String(i.id)}
                        renderItem={({ item }) => <PostCard item={item} />}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        refreshing={refreshing}
                        onRefresh={loadInitial}
                        ListFooterComponent={() =>
                            isFetchingNextPage ? (
                                <ActivityIndicator style={{ margin: 12 }} />
                            ) : null
                        }
                    />
                )}
                <FAB
                    icon="pencil"
                    label="글쓰기"
                    style={{
                        position: 'absolute',
                        margin: 16,
                        right: 0,
                        bottom: 0,
                    }}
                    onPress={() => {
                        navigation.navigate('CreateCommunity');
                    }}
                />
            </View>
        </>
    );
}

function formatDate(iso) {
    try {
        return new Date(iso).toLocaleString();
    } catch (e) {
        return iso;
    }
}

function PostCard({ item }) {
    const navigation = useNavigation();
    const snippet = item.content
        ? item.content.split('\n').slice(0, 3).join('\n')
        : '';

    // console.log(item);

    const onPress = () => {
        navigation.navigate('CommunityDetail', { communityId: item.id });
    };

    return (
        <Card style={{ margin: 10, paddingVertical: 20 }} onPress={onPress}>
            <Card.Content>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar.Text
                        size={40}
                        label={(item.user?.name || 'U').slice(0, 2)}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text variant="titleMedium" numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={styles.meta}>
                            {item.user?.name || '익명'} ·{' '}
                            {formatDate(item.createdAt)}
                        </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.commentCount}>
                            {item.totalComments || 0}
                        </Text>
                        <Text style={styles.meta}>답글</Text>
                    </View>
                </View>
                <Text numberOfLines={3} style={styles.paragraph}>
                    {snippet}
                </Text>
            </Card.Content>
            {Array.isArray(item.images) && item.images.length > 0 && (
                <Card.Cover
                    source={{ uri: item.images[0] }}
                    style={{ height: 200, margin: 10 }}
                />
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    headerRow: {},
    meta: { color: '#666', fontSize: 12 },
    paragraph: { marginTop: 8 },
    commentCount: { fontWeight: '700', textAlign: 'center' },
});

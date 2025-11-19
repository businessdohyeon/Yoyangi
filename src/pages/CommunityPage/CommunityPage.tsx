import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Card, FAB, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// import { showBorder } from "./common.js"
import apis from '../../apis';
import PlainHeader from '../MainPage/PlainHeader';

export default function CommunityPage() {
    const navigation = useNavigation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [lastId, setLastId] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadInitial();
    }, []);

    async function loadInitial() {
        setLoading(true);
        try {
            const res = await fetch(`${apis.urls.server}/community?limit=10`);
            const json = await res.json();
            // TODO: {서버 응답 스펙에 맞게 필요시 파싱 조정}
            setItems(json.Community || json.Communities || []);
            if ((json.Community || []).length === 0) setHasMore(false);
            if ((json.Community || []).length > 0)
                setLastId(
                    (json.Community || [])[(json.Community || []).length - 1]
                        .id,
                );
        } catch (err) {
            console.error('list load error', err);
        } finally {
            setLoading(false);
        }
    }

    async function loadMore() {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const res = await fetch(
                `${apis.urls.server}/community?limit=10${
                    lastId ? `&lastId=${lastId}` : ''
                }`,
            );
            const json = await res.json();
            const newItems = json.Community || json.Communities || [];
            if (newItems.length === 0) setHasMore(false);
            else {
                setItems((prev) => [...prev, ...newItems]);
                setLastId(newItems[newItems.length - 1].id);
            }
        } catch (err) {
            console.error('loadMore error', err);
        } finally {
            setLoading(false);
        }
    }

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
                            loading ? (
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

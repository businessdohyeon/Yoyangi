import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import apis from '../../apis';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { useQuery } from '@tanstack/react-query';

// TODO: {로그인 상태에서 Authorization 헤더를 넣어야 하는 경우 아래 getAuthHeaders를 수정하세요}
function getAuthHeaders() {
    // TODO: {토큰을 가져와서 `Bearer <token>` 형식으로 반환}
    // 예: return { Authorization: `Bearer ${token}` };
    return {};
}

function formatDate(iso: any) {
    try {
        return new Date(iso).toLocaleString();
    } catch (e) {
        return iso;
    }
}

export default function CommunityDetailScreen({ route }) {
    const navigation = useNavigation();
    const { communityId } = route.params;

    const { data: community, isLoading: loading } = useQuery({
        queryKey: ['community', communityId],
        queryFn: async () => {
            const res = await fetch(
                `${apis.urls.server}/community/${communityId}`,
                {
                    headers: { ...getAuthHeaders() },
                },
            );
            const json = await res.json();
            // TODO: {응답 포맷이 다르면 아래 파싱 조정}
            return json.Community || json.community || null;
        },
    });

    if (loading || !community)
        return (
            <View
                style={[
                    styles.container,
                    { justifyContent: 'center', alignItems: 'center' },
                ]}
            >
                <ActivityIndicator />
            </View>
        );

    return (
        <>
            <GoBackHeader title={community.title} />
            <ScrollView style={styles.container}>
                <Card style={{ margin: 12 }}>
                    <Card.Title
                        title={community.title}
                        subtitle={`${
                            community.user?.name || '익명'
                        } · ${formatDate(community.createdAt)}`}
                    />
                    {Array.isArray(community.images) &&
                        community.images.length > 0 && (
                            <Card.Cover source={{ uri: community.images[0] }} />
                        )}
                    <Card.Content>
                        <Paragraph>{community.content}</Paragraph>
                    </Card.Content>
                </Card>

                <View style={{ paddingHorizontal: 12 }}>
                    <Title>댓글</Title>
                    {Array.isArray(community.comments) &&
                    community.comments.length > 0 ? (
                        community.comments.map((c) => (
                            <Card
                                key={c.commentId}
                                style={{ marginVertical: 6 }}
                            >
                                <Card.Title
                                    title={c.userName || '익명'}
                                    subtitle={formatDate(c.createdAt)}
                                />
                                <Card.Content>
                                    <Paragraph>{c.content}</Paragraph>
                                    {Array.isArray(c.replies) &&
                                        c.replies.length > 0 &&
                                        c.replies.map((r) => (
                                            <View
                                                key={r.commentId}
                                                style={{
                                                    marginTop: 8,
                                                    paddingLeft: 12,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontWeight: '600',
                                                    }}
                                                >
                                                    {r.userName || '익명'}
                                                </Text>
                                                <Text>{r.content}</Text>
                                            </View>
                                        ))}
                                </Card.Content>
                            </Card>
                        ))
                    ) : (
                        <Text style={{ marginVertical: 12 }}>
                            댓글이 없습니다
                        </Text>
                    )}
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    card: { margin: 8 },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    meta: { color: '#666', fontSize: 12 },
    paragraph: { marginTop: 8 },
    cover: { height: 200 },
    commentCount: { fontWeight: '700', textAlign: 'center' },
    fab: { position: 'absolute', right: 12, bottom: 24 },
});

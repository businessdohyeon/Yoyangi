// navigation not used in this screen
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  TextInput,
  Button,
  Portal,
  Dialog,
  Chip,
  useTheme,
} from 'react-native-paper';
import axiosInstance from '../../apis/axios';
import {
  CommunityDetail,
  CommunityApiResponse,
  CommunityComment,
  CommunityCommentReply,
} from '../../types/Community';
import { ScreenProps } from '../../types/Navigation';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginInfoContext } from '../../Context';
import { SafeAreaView } from 'react-native-safe-area-context';
import apis from '../../apis';

function formatDate(iso: unknown) {
  try {
    if (!iso) return '';
    if (typeof iso === 'number' || typeof iso === 'string')
      return new Date(iso).toLocaleString();
    if (iso instanceof Date) return iso.toLocaleString();
    return String(iso);
  } catch {
    return String(iso);
  }
}

export default function CommunityDetailScreen({
  route,
}: ScreenProps<'CommunityDetail'>) {
  const theme = useTheme();
  const { communityId } = route.params ?? {};

  const { loginInfo } = useContext(LoginInfoContext);
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const categories = [
    'DUPLICATE_SPAM',
    'AD_PROMOTION',
    'ABUSE_HATE',
    'PRIVACY_LEAK',
    'SEXUAL_CONTENT',
    'ETC',
  ];

  const categoryLabels: Record<string, string> = {
    DUPLICATE_SPAM: '중복/스팸',
    AD_PROMOTION: '광고/홍보',
    ABUSE_HATE: '욕설/혐오',
    PRIVACY_LEAK: '개인정보 유출',
    SEXUAL_CONTENT: '음란성',
    ETC: '기타',
  };

  const { data: community, isLoading: loading } = useQuery({
    queryKey: ['community', communityId],
    queryFn: async (): Promise<CommunityDetail | null> => {
      const response = await axiosInstance.get<CommunityApiResponse>(
        apis.urls.getCommunityById(communityId),
        {},
      );
      console.log(response);

      // 응답의 Community 필드를 우선 사용하고, 없으면 소문자 키를 시도
      const raw = response.data as unknown as Record<string, unknown>;
      const maybe = (raw.Community ?? raw.community) as
        | CommunityDetail
        | undefined;
      return maybe ?? null;
    },
    staleTime: 2 * 60 * 1000, // 2분 캐싱
  });

  const commentMutation = useMutation({
    mutationFn: async (payload: { content: string }) => {
      return axiosInstance.post(apis.urls.comment(communityId), payload, {
        headers: { Authorization: `Bearer ${loginInfo?.token}` },
      });
    },
    onSuccess: () => {
      // refresh community to show new comment
      queryClient.invalidateQueries({
        queryKey: ['community', communityId],
      });
      setNewComment('');
    },
    onError: (err) => {
      console.error('comment error', err);
      Alert.alert('오류', '댓글 등록에 실패했습니다.');
    },
  });

  const [reportVisible, setReportVisible] = useState(false);
  const [reportTargetCommentId, setReportTargetCommentId] = useState<
    number | null
  >(null);
  const [reportCategory, setReportCategory] = useState('');
  const [reportReason, setReportReason] = useState('');

  const reportCommentMutation = useMutation({
    mutationFn: async (payload: {
      commentId: number;
      category: string;
      reason?: string;
    }) => {
      return axiosInstance.post(
        // url helper currently spelled reportCommnet in apis.urls
        apis.urls.reportCommnet(communityId, payload.commentId),
        { category: payload.category, reason: payload.reason },
        { headers: { Authorization: `Bearer ${loginInfo?.token}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['community', communityId],
      });
      setReportVisible(false);
      setReportTargetCommentId(null);
      setReportCategory('');
      setReportReason('');
      Alert.alert('완료', '신고가 접수되었습니다.');
    },
    onError: (err) => {
      console.error('report comment error', err);
      Alert.alert('오류', '신고에 실패했습니다.');
    },
  });

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const editCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      return axiosInstance.patch(
        apis.urls.commentById(communityId, commentId),
        { content },
        { headers: { Authorization: `Bearer ${loginInfo?.token}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['community', communityId],
      });
      setEditingCommentId(null);
      setEditText('');
    },
    onError: (err) => {
      console.error('edit comment error', err);
      Alert.alert('오류', '댓글 수정에 실패했습니다.');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      return axiosInstance.delete(
        apis.urls.commentById(communityId, commentId),
        {
          headers: { Authorization: `Bearer ${loginInfo?.token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['community', communityId],
      });
    },
    onError: (err) => {
      console.error('delete comment error', err);
      Alert.alert('오류', '댓글 삭제에 실패했습니다.');
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
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
      <GoBackHeader title={community.title} />
      <ScrollView style={styles.container}>
        <Card
          style={{
            margin: 12,
            backgroundColor: theme.colors.surface,
          }}
        >
          <Card.Content style={{ paddingVertical: 12 }}>
            <Title numberOfLines={2} ellipsizeMode="tail">
              {community.title}
            </Title>
            <Paragraph
              style={{ color: theme.colors.placeholder, marginTop: 4 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {`${community.user?.name || '익명'} · ${formatDate(
                community.createdAt,
              )}`}
            </Paragraph>
          </Card.Content>
          {community.images && community.images.length > 0 && (
            <View style={styles.imageGrid}>
              {community.images.map((uri, idx) => (
                <Image
                  key={`${communityId}-img-${idx}`}
                  source={{ uri }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
          <Card.Content>
            <Paragraph>{community.content}</Paragraph>
          </Card.Content>
        </Card>

        <View style={{ paddingHorizontal: 12 }}>
          <Title>댓글</Title>
          <View style={{ marginVertical: 8 }}>
            <TextInput
              mode="outlined"
              label="댓글 입력"
              multiline
              value={newComment}
              onChangeText={setNewComment}
              placeholder="댓글을 입력하세요"
              style={{ backgroundColor: 'transparent' }}
            />
            <View
              style={{
                marginTop: 8,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                mode="contained"
                disabled={
                  !newComment ||
                  commentMutation.status === 'pending' ||
                  !loginInfo?.token
                }
                loading={commentMutation.status === 'pending'}
                onPress={() => {
                  if (!loginInfo?.token) {
                    Alert.alert(
                      '로그인 필요',
                      '댓글을 작성하려면 로그인해야 합니다.',
                    );
                    return;
                  }
                  if (!newComment || !newComment.trim()) return;
                  commentMutation.mutate({
                    content: newComment.trim(),
                  });
                }}
              >
                등록
              </Button>
            </View>
          </View>
          {Array.isArray(community.comments) &&
          community.comments.length > 0 ? (
            community.comments.map((c: CommunityComment) => {
              const isOwner =
                !!loginInfo?.userId &&
                c.userId &&
                c.userId === loginInfo.userId;

              return (
                <Card
                  key={c.commentId}
                  style={{
                    marginVertical: 6,
                    backgroundColor: theme.colors.surface,
                  }}
                >
                  <Card.Title
                    title={c.userName || '익명'}
                    subtitle={formatDate(c.createdAt)}
                  />
                  <Card.Content>
                    {editingCommentId === c.commentId ? (
                      <>
                        <TextInput
                          mode="outlined"
                          multiline
                          value={editText}
                          onChangeText={setEditText}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            gap: 8,
                            marginTop: 8,
                          }}
                        >
                          <Button
                            mode="outlined"
                            onPress={() => {
                              setEditingCommentId(null);
                              setEditText('');
                            }}
                          >
                            취소
                          </Button>
                          <Button
                            mode="contained"
                            disabled={
                              editCommentMutation.status === 'pending' ||
                              !editText.trim()
                            }
                            loading={editCommentMutation.status === 'pending'}
                            onPress={() =>
                              editCommentMutation.mutate({
                                commentId: c.commentId,
                                content: editText.trim(),
                              })
                            }
                          >
                            저장
                          </Button>
                        </View>
                      </>
                    ) : (
                      <>
                        <Paragraph>{c.content}</Paragraph>
                        {isOwner ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              gap: 8,
                              marginTop: 8,
                            }}
                          >
                            <Button
                              mode="outlined"
                              onPress={() => {
                                setEditingCommentId(c.commentId);
                                setEditText(c.content || '');
                              }}
                            >
                              수정
                            </Button>
                            <Button
                              mode="contained"
                              onPress={() =>
                                Alert.alert(
                                  '댓글 삭제',
                                  '정말로 댓글을 삭제하시겠습니까?',
                                  [
                                    {
                                      text: '취소',
                                      style: 'cancel',
                                    },
                                    {
                                      text: '삭제',
                                      style: 'destructive',
                                      onPress: () =>
                                        deleteCommentMutation.mutate(
                                          c.commentId,
                                        ),
                                    },
                                  ],
                                )
                              }
                              loading={
                                deleteCommentMutation.status === 'pending'
                              }
                              disabled={
                                deleteCommentMutation.status === 'pending'
                              }
                            >
                              삭제
                            </Button>
                          </View>
                        ) : (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              marginTop: 8,
                            }}
                          >
                            <Button
                              mode="outlined"
                              onPress={() => {
                                if (!loginInfo?.token) {
                                  Alert.alert(
                                    '로그인 필요',
                                    '신고하려면 로그인하세요.',
                                  );
                                  return;
                                }
                                setReportTargetCommentId(c.commentId);
                                setReportCategory('');
                                setReportReason('');
                                setReportVisible(true);
                              }}
                            >
                              신고
                            </Button>
                          </View>
                        )}
                        {Array.isArray(c.replies) &&
                          c.replies.length > 0 &&
                          c.replies.map((r: CommunityCommentReply) => (
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
                      </>
                    )}
                  </Card.Content>
                </Card>
              );
            })
          ) : (
            <Text style={{ marginVertical: 12 }}>댓글이 없습니다</Text>
          )}
        </View>
        <Portal>
          <Dialog
            visible={reportVisible}
            onDismiss={() => setReportVisible(false)}
          >
            <Dialog.Title>댓글 신고</Dialog.Title>
            <Dialog.Content>
              <Text style={{ marginBottom: 8 }}>신고 유형</Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}
              >
                {categories.map((cat) => (
                  <Chip
                    key={cat}
                    selected={reportCategory === cat}
                    onPress={() => setReportCategory(cat)}
                    style={{
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    {categoryLabels[cat]}
                  </Chip>
                ))}
              </View>
              <TextInput
                mode="outlined"
                label="사유 (선택)"
                value={reportReason}
                onChangeText={setReportReason}
                multiline
                style={{
                  backgroundColor: 'transparent',
                  marginTop: 8,
                }}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setReportVisible(false);
                  setReportTargetCommentId(null);
                  setReportCategory('');
                  setReportReason('');
                }}
              >
                취소
              </Button>
              <Button
                mode="contained"
                disabled={
                  !reportCategory || reportCommentMutation.status === 'pending'
                }
                loading={reportCommentMutation.status === 'pending'}
                onPress={() => {
                  if (!reportTargetCommentId) return;
                  if (!reportCategory) {
                    Alert.alert('선택 필요', '신고 유형을 선택해주세요.');
                    return;
                  }
                  reportCommentMutation.mutate({
                    commentId: reportTargetCommentId,
                    category: reportCategory,
                    reason: reportReason,
                  });
                }}
              >
                제출
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
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
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 4,
  },
  gridImage: {
    width: '50%',
    height: 140,
    backgroundColor: '#eee',
  },
});

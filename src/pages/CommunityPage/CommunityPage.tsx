import { FlatList, StyleSheet, View, Alert, Image } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  FAB,
  Text,
  Portal,
  Dialog,
  Chip,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TabAndStackCompositeNav } from '../../types/Navigation';
import apis from '../../apis';
import axiosInstance from '../../apis/axios';
import PlainHeader from '../MainPage/PlainHeader';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useContext, useState } from 'react';
import { LoginInfoContext } from '../../Context';

type User = {
  id: number;
  name: string;
};

export type CommunityItem = {
  id: number;
  title: string;
  createdAt: string;
  content?: string;
  images?: string[];
  totalComments?: string | number;
  user?: User;
};

export default function CommunityPage() {
  const navigation =
    useNavigation<TabAndStackCompositeNav<'CommunityPage', 'Tabs'>>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery<CommunityItem[]>({
    queryKey: ['community'],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, unknown> = { limit: 10 };
      if (pageParam) {
        params.lastId = pageParam;
      }
      const response = await axiosInstance.get(apis.urls.communities, {
        params,
      });

      console.log(response);

      const items: CommunityItem[] =
        response.data.Community || response.data.Communities || [];
      return items;
    },
    getNextPageParam: (lastPage, _allPages) => {
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
            renderItem={({ item }: { item: CommunityItem }) => (
              <PostCard item={item} />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={loadInitial}
            ListFooterComponent={
              <FooterIndicator isLoading={isFetchingNextPage} />
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
            navigation.navigate('CommunityFormPage');
          }}
        />
      </View>
    </>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    console.warn(e);
    return iso;
  }
}

function FooterIndicator({ isLoading }: { isLoading: boolean }) {
  return isLoading ? <ActivityIndicator style={{ margin: 12 }} /> : null;
}

function PostCard({ item }: { item: CommunityItem }) {
  const theme = useTheme();
  const navigation =
    useNavigation<TabAndStackCompositeNav<'CommunityPage', 'Tabs'>>();
  const { loginInfo } = useContext(LoginInfoContext);
  const userId = loginInfo?.userId ?? 0;
  const queryClient = useQueryClient();
  const [reportVisible, setReportVisible] = useState(false);
  const snippet = item.content
    ? item.content.split('\n').slice(0, 3).join('\n')
    : '';

  console.log(item);

  const onPress = () => {
    navigation.navigate('CommunityDetail', {
      communityId: item.id,
    });
  };

  const editBtn = () => {
    navigation.navigate('CommunityFormPage', {
      communityId: item.id,
      initialValues: { title: item.title, content: item.content ?? '' },
    });
  };

  // delete handled by handleDelete

  const reportMutation = useMutation({
    mutationFn: async (payload: { category: string; reason?: string }) => {
      return axiosInstance.post(apis.urls.reportCommunity(item.id), payload, {
        headers: { Authorization: `Bearer ${loginInfo?.token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] });
      setReportVisible(false);
      Alert.alert('완료', '신고가 접수되었습니다.');
    },
    onError: (err) => {
      console.error('report error', err);
      Alert.alert('오류', '신고에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return axiosInstance.delete(apis.urls.getCommunityById(item.id), {
        headers: { Authorization: `Bearer ${loginInfo?.token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] });
      Alert.alert('삭제 완료', '게시물이 삭제되었습니다.');
    },
    onError: (err) => {
      console.error('delete error', err);
      Alert.alert('오류', '삭제에 실패했습니다.');
    },
  });

  const handleDelete = () => {
    Alert.alert('게시물 삭제', '정말로 게시물을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(),
      },
    ]);
  };

  const form = useForm({
    defaultValues: { category: '', reason: '' },
    onSubmit: async (values) => {
      if (!values.value.category) {
        Alert.alert('선택 필요', '신고 유형을 선택해주세요.');
        return;
      }
      reportMutation.mutate({
        category: values.value.category,
        reason: values.value.reason,
      });
    },
  });

  // show up to 4 images in a 2x2 grid placed before the text
  const images = Array.isArray(item.images) ? item.images.slice(0, 4) : [];

  return (
    <Card style={styles.postCard} onPress={onPress}>
      {images.length > 0 && (
        <View style={styles.imageGrid}>
          {images.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.gridImage} />
          ))}
        </View>
      )}

      <Card.Content>
        <View style={styles.postHeader}>
          <Avatar.Text size={44} label={(item.user?.name || 'U').slice(0, 2)} />

          <View style={styles.postTitleWrap}>
            <Text variant="titleMedium" numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {item.user?.name || '익명'} · {formatDate(item.createdAt)}
            </Text>
          </View>

          <View style={styles.postCountWrap}>
            <Text style={styles.commentCount}>
              {Number(item.totalComments) || 0}
            </Text>
            <Text style={styles.meta}>댓글</Text>
          </View>
        </View>

        <Text numberOfLines={3} style={styles.paragraph}>
          {snippet}
        </Text>
      </Card.Content>

      <Card.Actions style={styles.postActions}>
        <View style={styles.actionLeft}>
          {userId === item.user?.id && (
            <>
              <Button
                compact
                onPress={editBtn}
                textColor={theme.colors.primary}
              >
                수정
              </Button>
              <Button
                compact
                mode="outlined"
                onPress={handleDelete}
                loading={deleteMutation.status === 'pending'}
                disabled={deleteMutation.status === 'pending'}
                textColor={theme.colors.error}
              >
                삭제
              </Button>
            </>
          )}
        </View>

        <View style={styles.actionRight}>
          <Button
            compact
            onPress={() => setReportVisible(true)}
            textColor={theme.colors.primary}
          >
            신고
          </Button>
        </View>
      </Card.Actions>

      <Portal>
        <Dialog
          visible={reportVisible}
          onDismiss={() => setReportVisible(false)}
        >
          <Dialog.Title>게시물 신고</Dialog.Title>
          <Dialog.Content>
            <form.Field
              name="category"
              children={(field) => (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  {[
                    'DUPLICATE_SPAM',
                    'AD_PROMOTION',
                    'ABUSE_HATE',
                    'PRIVACY_LEAK',
                    'SEXUAL_CONTENT',
                    'ETC',
                  ].map((c) => (
                    <Chip
                      key={c}
                      mode="outlined"
                      selected={field.state.value === c}
                      onPress={() => field.handleChange(c)}
                      style={{
                        marginRight: 6,
                        marginBottom: 6,
                      }}
                    >
                      {c}
                    </Chip>
                  ))}
                </View>
              )}
            />

            <form.Field
              name="reason"
              children={(field) => (
                <TextInput
                  label="신고 사유 (선택적)"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  multiline
                  style={{ marginTop: 12 }}
                />
              )}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setReportVisible(false)}>취소</Button>
            <form.Subscribe
              selector={(s) => ({
                canSubmit: s.canSubmit,
                isSubmitting: s.isSubmitting,
              })}
              children={({ canSubmit, isSubmitting }) => (
                <Button
                  mode="contained"
                  loading={isSubmitting || reportMutation.status === 'pending'}
                  disabled={!canSubmit || reportMutation.status === 'pending'}
                  onPress={() => form.handleSubmit()}
                >
                  신고 제출
                </Button>
              )}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {},
  meta: { color: '#666', fontSize: 12 },
  paragraph: { marginTop: 8 },
  commentCount: { fontWeight: '700', textAlign: 'center' },
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

  /* PostCard specific styles */
  postCard: {
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    // backgroundColor set via theme
  },
  // postCover removed: using thumbnail grid instead
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  postTitleWrap: {
    marginLeft: 12,
    flex: 1,
  },
  postCountWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  postActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionRight: {
    alignItems: 'flex-end',
  },
});

import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TabAndStackCompositeNav } from '../../types/Navigation';
import apis from '../../apis';
import axiosInstance from '../../apis/axios';
import PlainHeader from '../MainPage/PlainHeader';
import { useInfiniteQuery } from '@tanstack/react-query';
import PostCard from './PostCard';

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

function FooterIndicator({ isLoading }: { isLoading: boolean }) {
  return isLoading ? <ActivityIndicator style={{ margin: 12 }} /> : null;
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
    gap: '1%',
  },
  gridImage: {
    width: '48%',
    height: 140,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  postCard: {
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 10,
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
    marginVertical: 10,
  },
  actionRight: {
    alignItems: 'flex-end',
  },
});

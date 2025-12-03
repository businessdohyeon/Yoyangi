import React, { useContext } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator, Card, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlainHeader from '../MainPage/PlainHeader';
import { LoginInfoContext } from '../../Context';
import { Favorite } from '../../types/Favorite';
import axiosInstance from '../../apis/axios';
import { useQuery } from '@tanstack/react-query';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavProp } from '../../types/Navigation';
import apis from '../../apis';
import { useRequireAuth } from '../../hooks/useRequireAuth';

export default function LikedOrganizations() {
  const theme = useTheme();
  const { loginInfo } = useContext(LoginInfoContext);
  const navigation = useNavigation<RootStackNavProp<'LikedOrganizations'>>();
  const nav = navigation;
  const { isAuthenticated } = useRequireAuth();

  const fetchFavorites = async () => {
    const res = await axiosInstance.get(
      apis.urls.getFavorites(loginInfo?.userId),
      {
        headers: {
          Authorization: `Bearer ${loginInfo?.token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // API 응답 구조: res.data.data => 배열
    return res.data?.data ?? [];
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['favorites', loginInfo?.userId],
    queryFn: fetchFavorites,
    enabled: Boolean(
      loginInfo && loginInfo.userId && Number(loginInfo.userId) > 0,
    ),
    staleTime: 30 * 1000,
  });

  const favorites: Favorite[] = Array.isArray(data) ? (data as Favorite[]) : [];

  // useRequireAuth가 로그인되지 않은 경우 LoginPage로 리다이렉션 처리함
  if (!isAuthenticated) return null;

  if (!loginInfo || !loginInfo.userId) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']}>
        <PlainHeader />
        <View style={{ padding: 16 }}>
          <Text>로그인이 필요합니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
      <GoBackHeader title={'관심 등록한 기관'} />
      <View style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 12 }}>
        {isLoading ? (
          <ActivityIndicator animating color={theme.colors.primary} />
        ) : isError ? (
          <View>
            <Text>관심 목록을 불러오지 못했습니다.</Text>
            <Text onPress={() => refetch()}>다시 시도</Text>
          </View>
        ) : favorites.length === 0 ? (
          <Text>관심 등록한 기관이 없습니다.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item, idx) => String(item.id ?? idx)}
            renderItem={({ item }) => (
              <Card
                style={{
                  marginBottom: 10,
                  backgroundColor: theme.colors.surface,
                }}
                onPress={() => {
                  nav.navigate('FacilityDetailPage', {
                    facilityId: Number(item.id),
                  });
                }}
              >
                <Card.Content>
                  <Text variant="titleMedium">
                    {item.name || item.facility_name || '기관명 없음'}
                  </Text>
                  <Text>
                    {item.address || item.sido_name
                      ? `${item.sido_name || ''} ${item.sggu_name || ''}`
                      : ''}
                  </Text>
                  {item.phone ? <Text>전화: {item.phone}</Text> : null}
                </Card.Content>
              </Card>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

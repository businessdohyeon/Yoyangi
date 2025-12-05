import { useContext, useState } from 'react';
import { View } from 'react-native';
import { Card, Icon, IconButton, Text, useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { TabAndStackCompositeNav } from '../../types/Navigation';
import apis from '../../apis';
import axiosInstance from '../../apis/axios';

import { LoginInfoContext } from '../../Context';

import { FacilityData_t } from '../../types/FacilityDataScheme';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function SearchResult({
  facilityData,
}: {
  facilityData: FacilityData_t;
}) {
  const navigation =
    useNavigation<TabAndStackCompositeNav<'SearchPage', 'Tabs'>>();
  const theme = useTheme();
  const { loginInfo } = useContext(LoginInfoContext);
  const queryClient = useQueryClient();

  const initialLiked = facilityData.isLike;
  const [liked, setLiked] = useState<boolean>(initialLiked);

  const userLikeMutation = useMutation({
    mutationFn: async (vars: { userId: number; token: string }) => {
      const response = await axiosInstance.post(
        apis.urls.userLike(vars.userId, facilityData.id),
        {},
        {
          headers: {
            Authorization: `Bearer ${vars.token}`,
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
  });

  const userLike = () => {
    if (!loginInfo?.token || loginInfo?.userId === 0) {
      navigation.navigate('LoginPage', {
        returnScreen: 'SearchPage',
      });
      return;
    }
    userLikeMutation.mutate({
      userId: loginInfo.userId,
      token: loginInfo.token,
    });
  };

  const specialties = [
    { key: 'parkinson', icon: 'hand-heart-outline', label: '파킨슨' },
    { key: 'dementia', icon: 'brain', label: '치매' },
    { key: 'cancer', icon: 'shield-cross-outline', label: '암' },
    { key: 'stroke', icon: 'heart', label: '중풍' },
    { key: 'herbal', icon: 'medication', label: '한방' },
  ];

  return (
    <Card
      style={{
        marginBottom: 10,
        backgroundColor: theme.colors.background,
      }}
      onPress={() => {
        console.log(facilityData.id);
        navigation.navigate('FacilityDetailPage', {
          id: facilityData.id,
        });
      }}
    >
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
          }}
        >
          <View style={{ flex: 6, gap: 1 }}>
            {facilityData.approval_status && (
              <View>
                <Text style={{ color: theme.colors.primary }}>
                  인증시설입니다
                </Text>
              </View>
            )}
            <View>
              <Text variant="titleMedium">{facilityData.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View
                style={{
                  marginRight: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Icon color={theme.colors.primary} size={16} source={'star'} />
                <Text
                  style={{ marginLeft: 6 }}
                >{`${facilityData.average_rating} (${facilityData.review_count})`}</Text>
              </View>
              <View style={{ marginRight: 10 }}>
                <Text>{`${facilityData.sido_name} ${facilityData.sggu_name}`}</Text>
              </View>
              <View style={{ marginRight: 10 }}>
                <Text>{facilityData.kind}</Text>
              </View>
            </View>
            <View>
              <Text>오늘 0700-2100</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <IconButton
              icon={liked ? 'heart' : 'heart-outline'}
              iconColor={
                liked ? theme.colors.primary : theme.colors.onPrimaryContainer
              }
              onPress={() => {
                setLiked((v) => !v);
                userLike();
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {specialties.map((s) => (
            <View
              key={s.key}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon
                color={s.label === '파킨슨' ? theme.colors.primary : 'gray'}
                size={30}
                source={s.icon}
              />
              <Text>{s.label}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

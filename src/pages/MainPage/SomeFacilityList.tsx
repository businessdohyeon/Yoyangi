import { useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  IconButton,
  Text,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TabAndStackCompositeNav } from '../../types/Navigation';
import apis from '../../apis';
import axiosInstance from '../../apis/axios';
import { LocationInfoContext } from '../../Context';
import { FacilityData_t } from '../../types/FacilityDataScheme';
import { useQuery } from '@tanstack/react-query';

const LIMIT = 5;
const KIND_DEFAULT_VALUE = ['요양병원', '요양원', '주야간보호센터'];

export default function SomeFacilityList() {
  const navigation =
    useNavigation<TabAndStackCompositeNav<'MainPage', 'Tabs'>>();
  const theme = useTheme();
  const { locationInfo } = useContext(LocationInfoContext);

  const [kind, setKind] = useState<string[]>(KIND_DEFAULT_VALUE);

  const { data, isLoading, refetch } = useQuery<FacilityData_t[]>({
    queryKey: [
      'someFacilities',
      locationInfo?.latitude,
      locationInfo?.longitude,
      kind,
    ],
    queryFn: async () => {
      if (!locationInfo) return [] as FacilityData_t[];
      const params = {
        limit: LIMIT,
        page: 1,
        latitude: locationInfo.latitude,
        longitude: locationInfo.longitude,
        kind: kind.join(','),
      };
      const resp = await axiosInstance.get(apis.urls.facilities, {
        params,
      });
      const { Response } = resp.data;
      return Response ?? [];
    },
    enabled: !!locationInfo,
  });

  const list = useMemo(() => (data ?? []) as FacilityData_t[], [data]);

  useEffect(() => {
    refetch();
  }, [kind, refetch]);

  const toggleKind = (label: string) => {
    setKind((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label],
    );
  };

  return (
    <View style={{ padding: 10, backgroundColor: '#ffffff' }}>
      <View style={{ marginVertical: 10 }}>
        <Text variant="titleLarge">근처 시설</Text>
      </View>

      <View
        style={{
          marginVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        {['요양병원', '요양원', '주야간보호센터'].map((k) => {
          const selected = kind.includes(k);
          return (
            <Chip
              key={k}
              icon={selected ? 'check' : 'hospital'}
              selected={selected}
              onPress={() => toggleKind(k)}
              style={{
                borderRadius: 16,
              }}
              selectedColor={
                selected ? theme.colors.primary : theme.colors.secondary
              }
            >
              {k}
            </Chip>
          );
        })}
      </View>

      {isLoading ? (
        <ActivityIndicator animating color={theme.colors.primary} />
      ) : (
        <View style={{ gap: 10 }}>
          {list.map((item) => (
            <Card
              key={item.id}
              style={{
                margin: 10,
                backgroundColor: theme.colors.background,
                borderWidth: 1,
                borderColor: theme.colors.secondaryContainer,
              }}
              onPress={() =>
                navigation.navigate('FacilityDetailPage', {
                  id: item.id,
                })
              }
            >
              <Card.Content>
                <Text variant="titleMedium">{item.name}</Text>
                <Text>{`${item.sido_name} ${item.sggu_name}`}</Text>
                <Text>{item.kind}</Text>
              </Card.Content>
              <Card.Actions>
                <IconButton icon="heart-outline" onPress={() => {}} />
              </Card.Actions>
            </Card>
          ))}
        </View>
      )}

      <View style={{ marginTop: 10, marginBottom: 20 }}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('SearchPage', { kind })}
        >
          <Text variant="labelLarge">더보기</Text>
        </Button>
      </View>
    </View>
  );
}

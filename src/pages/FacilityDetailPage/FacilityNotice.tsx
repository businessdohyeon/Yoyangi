import { Image, useWindowDimensions, View } from 'react-native';
import { Button, Text, useTheme, ActivityIndicator } from 'react-native-paper';

import { FacilityData_t } from '../../types/FacilityDataScheme';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../apis/axios';
import apis from '../../apis';
import type {
  MealsApiResponse,
  MealData,
  TodayMealDesc,
} from '../../types/Meal';

export function FacilityNotice({
  facilityData,
}: {
  facilityData: FacilityData_t;
}) {
  const theme = useTheme();
  const { width: viewportWidth } = useWindowDimensions();
  type ParsedMeals = {
    menu: MealData | null;
    todayDesc: TodayMealDesc | null;
  };

  const {
    data: mealsData,
    isLoading: mealsLoading,
    error: mealsError,
  } = useQuery<ParsedMeals>({
    queryKey: ['facilityMeals', facilityData.id],
    queryFn: async () => {
      const res = await axiosInstance.get<MealsApiResponse>(
        apis.urls.getFacilityMenu(facilityData.id),
      );

      console.log(res);

      const payload = res.data;
      if (payload && payload.Response) {
        const menu: MealData = payload.Response;
        let todayDesc: TodayMealDesc | null = null;
        try {
          todayDesc = JSON.parse(menu.today_meal_desc) as TodayMealDesc;
        } catch (e) {
          console.warn('failed to parse today_meal_desc', e);
        }

        return { menu, todayDesc } as ParsedMeals;
      }
      return { menu: null, todayDesc: null } as ParsedMeals;
    },
    staleTime: 5 * 60 * 1000,
  });

  // derive todayMenu directly from query data to avoid extra state/effect
  const todayMenu: TodayMealDesc | null = mealsData?.todayDesc ?? null;

  return (
    <View
      style={{
        width: viewportWidth,
        gap: 10,
      }}
    >
      {/* 메뉴판 */}
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 10,
          backgroundColor: theme.colors.background,
        }}
      >
        <View style={{ marginVertical: 10 }}>
          <Text variant="titleMedium">오늘의 메뉴</Text>
        </View>
        {mealsLoading ? (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <ActivityIndicator animating={true} color={theme.colors.primary} />
            <Text style={{ marginTop: 8 }}>메뉴를 불러오는 중입니다...</Text>
          </View>
        ) : mealsError ? (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ color: theme.colors.error }}>
              메뉴를 불러오지 못했습니다.
            </Text>
          </View>
        ) : (
          <View
            style={{
              gap: 10,
              marginVertical: 10,
            }}
          >
            {(
              [
                { key: 'breakfast', label: '아침' },
                { key: 'lunch', label: '점심' },
                { key: 'dinner', label: '저녁' },
              ] as const
            ).map((m) => {
              const items = (todayMenu as TodayMealDesc | null)?.[
                m.key as keyof TodayMealDesc
              ] as string[] | undefined;
              return (
                <View
                  key={m.key}
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flex: 3,
                    }}
                  >
                    <Image
                      src={
                        (mealsData?.menu &&
                          mealsData?.menu[`${m.key}_meal_picture_url`]) ||
                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC'
                      }
                      style={{
                        flex: 1,
                        borderRadius: 10,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 5,
                    }}
                  >
                    <View style={{}}>
                      <Text variant="bodyLarge">
                        {`${m.label}: ${
                          items && items.length ? items[0] : '대표메뉴'
                        }`}
                      </Text>
                    </View>
                    {items && items.length ? (
                      items.slice(1).map((it, idx) => (
                        <View key={idx}>
                          <Text variant="bodyMedium">{it}</Text>
                        </View>
                      ))
                    ) : (
                      <>
                        <View>
                          <Text variant="bodyMedium">메뉴 정보가 없습니다</Text>
                        </View>
                        <View>
                          <Text variant="bodyMedium">메뉴 정보가 없습니다</Text>
                        </View>
                        <View>
                          <Text variant="bodyMedium">메뉴 정보가 없습니다</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
        <View style={{ marginVertical: 10 }}>
          <Text variant="titleMedium">일주일식단표</Text>
        </View>
        <View
          style={{
            height: 300,
          }}
        >
          <Image
            src={
              mealsData?.menu?.week_meal_picture_url ||
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC'
            }
            style={{ flex: 1 }}
            resizeMode="contain"
          />
        </View>
      </View>
      {/* 병원소식 */}
      <View
        style={{
          backgroundColor: theme.colors.background,
          paddingHorizontal: 10,
          paddingVertical: 20,
        }}
      >
        <View style={{ marginVertical: 10 }}>
          <Text variant="titleMedium">병원소식</Text>
        </View>
        <View style={{}}>
          <View style={{}}>
            <View
              style={{
                height: 250,
              }}
            >
              <Image
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC"
                style={{ flex: 1 }}
              />
            </View>
            <View style={{}}>
              <Text>제목</Text>
            </View>
            <View style={{}}>
              <Text>줄글</Text>
            </View>
          </View>
          <View style={{}}>
            <View
              style={{
                height: 250,
              }}
            >
              <Image
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC"
                style={{ flex: 1 }}
              />
            </View>
            <View style={{}}>
              <Text>제목</Text>
            </View>
            <View style={{}}>
              <Text>줄글</Text>
            </View>
          </View>
        </View>
        <View style={{}}>
          <Button
            icon="camera"
            mode="contained"
            onPress={() => console.log('Pressed')}
            style={{ flex: 1 }}
          >
            더보기
          </Button>
        </View>
      </View>
    </View>
  );
}

import { useContext, useRef, useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import {
  ActivityIndicator,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

import axiosInstance from '../../apis/axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ScreenProps } from '../../types/Navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoBackHeader from './GoBackHeader';
import { LoginInfoContext } from '../../Context';
import {
  FacilityData_t,
  FacilityDataSchema,
} from '../../types/FacilityDataScheme';
import { FacilityNotice } from './FacilityNotice';
import { FacilityReview } from './FacilityReview';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apis from '../../apis';
import { FacilityInfo } from './FacilityInfo';
import HeroSection from './HeroSection';
import Footer from './Footer';
import { OnPressDev } from '../../common';

export default function FacilityDetailPage({
  route,
}: ScreenProps<'FacilityDetailPage'>) {
  const theme = useTheme();
  const { loginInfo } = useContext(LoginInfoContext);
  const _params = route.params as
    | { facilityId?: number; id?: number }
    | undefined;
  const id = _params?.facilityId ?? _params?.id;
  const scrollRef = useRef<ScrollView | null>(null);
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'FacilityDetailPage'>
    >();
  const queryClient = useQueryClient();

  const [tabIndex, setTabIndex] = useState(0);

  const {
    data: facilityData = {} as FacilityData_t,
    isLoading,
    refetch,
  } = useQuery({
    // include userId (or 'anon') so cache is separated per user and a change in login
    // will cause React Query to fetch the appropriate data
    queryKey: ['facility', id, loginInfo?.userId ?? 'anon'],
    queryFn: async () => {
      if (!id) return {} as FacilityData_t;
      // do not include token in the key; only use it for request headers
      const headers = loginInfo?.token
        ? { Authorization: `Bearer ${loginInfo.token}` }
        : {};

      const response = await axiosInstance.get(apis.urls.getFacilityById(id), {
        headers,
      });
      const { Response } = response.data;

      let tmp;
      try {
        tmp = FacilityDataSchema.parse(Response);
      } catch (error) {
        console.log(error);
      }

      console.group('fetchFacilityData');
      console.log(tmp);
      console.groupEnd();

      return tmp;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // In case the token changes for the same user (rare) or other login-state changes
  // that should force refetching the current facility, invalidate the non-user-specific
  // cache or directly refetch this query.
  useEffect(() => {
    if (!id) return;
    // invalidate the facility query without the user suffix so server-driven
    // differences (like whether the current user liked it) will be re-fetched.
    queryClient.invalidateQueries({ queryKey: ['facility', id] });
  }, [loginInfo?.token, id, queryClient]);

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
      queryClient.invalidateQueries({ queryKey: ['facility', id] });
    },
  });

  const userLike = () => {
    if (!loginInfo?.token || loginInfo?.userId === 0) {
      navigation.navigate('LoginPage', {
        returnScreen: 'FacilityDetailPage',
        returnParams: { id },
      });
      return;
    }
    userLikeMutation.mutate({
      userId: loginInfo.userId,
      token: loginInfo.token,
    });
  };

  console.group('[rerender]: FacilityDetailPage');
  console.log({ id });
  console.log(loginInfo);
  console.log(facilityData);
  console.groupEnd();

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
      <GoBackHeader title={facilityData.name} />
      <ScrollView
        contentContainerStyle={{
          backgroundColor: '#eeeeee',
        }}
      >
        {isLoading ? (
          <ActivityIndicator style={{ marginVertical: 50 }} />
        ) : (
          <>
            <HeroSection facilityData={facilityData} userLike={userLike} />
            {/* 이동버튼 */}
            <TabNav tabIndex={tabIndex} setTabIndex={setTabIndex} />
            {/* 구체적인 정보들 */}
            <ScrollView
              pagingEnabled
              horizontal={true}
              style={{
                backgroundColor: '#eeeeee',
                paddingBottom: 10,
              }}
              ref={scrollRef}
            >
              {tabIndex === 0 ? (
                <FacilityInfo facilityData={facilityData} />
              ) : tabIndex === 1 ? (
                <FacilityNotice facilityData={facilityData} />
              ) : (
                <FacilityReview facilityData={facilityData} />
              )}
            </ScrollView>
            {/* 버그신고등등등 */}
            <View
              style={{
                paddingBottom: 50,
                paddingHorizontal: 10,
                paddingVertical: 30,
                gap: 30,
              }}
            >
              <TouchableRipple onPress={OnPressDev}>
                <Text>알고계신 병원 정보와 다른가요?</Text>
              </TouchableRipple>
              <TouchableRipple onPress={OnPressDev}>
                <Text>이 병원의 관계자이신가요?</Text>
              </TouchableRipple>
            </View>
          </>
        )}
      </ScrollView>
      {/* footer */}
      <Footer facilityData={facilityData} />
    </SafeAreaView>
  );
}

function TabNav({
  tabIndex,
  setTabIndex,
}: {
  tabIndex: number;
  setTabIndex: (n: number) => void;
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: theme.colors.background,
        overflow: 'visible',
      }}
    >
      <TouchableRipple
        style={{
          flex: 1,
          borderBottomWidth: 10,
          borderBottomColor: tabIndex === 0 ? theme.colors.primary : '#dddddd',
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 5,
        }}
        onPress={() => {
          setTabIndex(0);
        }}
      >
        <Text style={{ marginVertical: 5 }} variant="titleMedium">
          병원정보
        </Text>
      </TouchableRipple>
      <TouchableRipple
        style={{
          flex: 1,
          borderBottomWidth: 10,
          borderBottomColor: tabIndex === 1 ? theme.colors.primary : '#dddddd',
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 5,
        }}
        onPress={() => {
          setTabIndex(1);
        }}
      >
        <Text style={{ marginVertical: 5 }} variant="titleMedium">
          병원소식
        </Text>
      </TouchableRipple>
      <TouchableRipple
        style={{
          flex: 1,
          borderBottomWidth: 10,
          borderBottomColor: tabIndex === 2 ? theme.colors.primary : '#dddddd',
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 5,
        }}
        onPress={() => {
          setTabIndex(2);
        }}
      >
        <Text style={{ marginVertical: 5 }} variant="titleMedium">
          후기
        </Text>
      </TouchableRipple>
    </View>
  );
}

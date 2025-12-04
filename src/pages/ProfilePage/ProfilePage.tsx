import { ScrollView, View, Alert, Platform, ToastAndroid } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TabAndStackCompositeNav } from '../../types/Navigation';
import PlainHeader from '../MainPage/PlainHeader';
import { useContext, useState } from 'react';
import { LoginInfoContext } from '../../Context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeartIcon = (props: React.ComponentProps<typeof List.Icon>) => (
  <List.Icon {...props} icon="heart" />
);
const CalendarIcon = (props: React.ComponentProps<typeof List.Icon>) => (
  <List.Icon {...props} icon="calendar" />
);
const ChatIcon = (props: React.ComponentProps<typeof List.Icon>) => (
  <List.Icon {...props} icon="chat" />
);

const ProfilePage = () => {
  const nav = useNavigation<TabAndStackCompositeNav<'ProfilePage', 'Tabs'>>();
  const theme = useTheme();
  const { loginInfo, clearLoginInfo } = useContext(LoginInfoContext);

  console.log(loginInfo);

  // 로그인 여부 판단: context의 기본값은 객체지만 userId가 0이면 비로그인 상태로 간주
  const isLoggedIn = Boolean(
    loginInfo && loginInfo.userId && Number(loginInfo.userId) > 0,
  );

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLoginRedirect = () => {
    nav.navigate('LoginPage');
  };

  const handleLikesRedirect = () => {
    nav.navigate('LikedOrganizations');
  };

  const handleReservationsRedirect = () => {
    nav.navigate('ReservationHistory');
  };

  const handleConsultationsRedirect = () => {
    nav.navigate('ConsultationHistory');
  };

  const handleEditProfile = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show('아직 준비 중인 기능입니다.', ToastAndroid.SHORT);
    } else {
      Alert.alert('개발중이에ㅕ요', '아직 준비 중인 기능입니다.');
    }
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: async () => {
          try {
            await clearLoginInfo();
            // 로그아웃 후 홈(또는 로그인) 화면으로 이동
            nav.navigate('MainPage');
          } catch (e) {
            console.error('clearLoginInfo failed', e);
          }
        },
      },
    ]);
  };

  return (
    <>
      <PlainHeader />
      <ScrollView
        contentContainerStyle={{
          gap: 10,
          backgroundColor: '#eeeeee',
          columnGap: 10,
        }}
      >
        <View
          style={{
            // backgroundColor: theme.colors.background,
            padding: 20,
          }}
        >
          <Card style={{ backgroundColor: theme.colors.surface }}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Avatar.Image
                size={80}
                source={{
                  uri: loginInfo?.avatar || 'https://via.placeholder.com/80',
                }}
              />
              <Text variant="titleLarge" style={{ marginTop: 10 }}>
                {isLoggedIn ? '로그인 되었습니다' : '로그인이 필요해요'}
              </Text>
              {isLoggedIn ? (
                <Text variant="bodyMedium">{`${loginInfo?.provider}를 통해 로그인되었습니다`}</Text>
              ) : (
                <Button
                  mode="contained"
                  style={{ marginTop: 10 }}
                  onPress={handleLoginRedirect}
                >
                  로그인하기
                </Button>
              )}
            </Card.Content>
          </Card>
        </View>
        {isLoggedIn && (
          <>
            <View style={{ paddingHorizontal: 20 }}>
              <Button
                icon="account-edit"
                mode="elevated"
                style={{ marginBottom: 10 }}
                onPress={handleEditProfile}
              >
                프로필 수정
              </Button>
            </View>
            <View
              style={{
                backgroundColor: theme.colors.background,
                paddingHorizontal: 10,
                paddingTop: 10,
                paddingBottom: 50,
              }}
            >
              <List.Section>
                <List.Item
                  title="좋아요한 기관"
                  left={HeartIcon}
                  onPress={handleLikesRedirect}
                />
                <List.Item
                  title="예약 기록"
                  left={CalendarIcon}
                  onPress={handleReservationsRedirect}
                />
                <List.Item
                  title="상담 기록"
                  left={ChatIcon}
                  onPress={handleConsultationsRedirect}
                />
              </List.Section>

              <Divider style={{ marginVertical: 30 }} />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text variant="bodyMedium">알림 설정</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={() => {
                    setNotificationsEnabled(!notificationsEnabled);
                  }}
                />
              </View>
              <Divider style={{ marginVertical: 30 }} />
              <Button
                icon="logout"
                mode="contained-tonal"
                onPress={handleLogout}
              >
                로그아웃
              </Button>
            </View>
          </>
        )}
        <Button
          mode="text"
          onPress={() => AsyncStorage.clear()}
          style={{ alignSelf: 'center', marginTop: 4 }}
        >
          로그인 및 위치 설정 초기화
        </Button>
      </ScrollView>
    </>
  );
};

export default ProfilePage;

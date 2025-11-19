import { ScrollView, View } from 'react-native';
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
import PlainHeader from '../MainPage/PlainHeader';
import { useState } from 'react';

const ProfilePage = () => {
    const navigation = useNavigation();
    const theme = useTheme();

    const user = null;

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleLoginRedirect = () => {
        navigation.navigate('LoginPage');
    };

    const handleLikesRedirect = () => {
        navigation.navigate('LikedOrganizations');
    };

    const handleReservationsRedirect = () => {
        navigation.navigate('ReservationHistory');
    };

    const handleConsultationsRedirect = () => {
        navigation.navigate('ConsultationHistory');
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleLogout = () => {
        Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
            { text: '취소', style: 'cancel' },
            { text: '확인', onPress: () => onLogout && onLogout() },
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
                    <Card style={{}}>
                        <Card.Content style={{ alignItems: 'center' }}>
                            <Avatar.Image
                                size={80}
                                source={{
                                    uri:
                                        user?.avatar ||
                                        'https://via.placeholder.com/80',
                                }}
                            />
                            <Text
                                variant="titleLarge"
                                style={{ marginTop: 10 }}
                            >
                                {user ? user.name : '로그인이 필요함'}
                            </Text>
                            {user ? (
                                <Text variant="bodyMedium">
                                    이메일: {user.email}
                                </Text>
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
                {user && (
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
                                    left={() => <List.Icon icon="heart" />}
                                    onPress={handleLikesRedirect}
                                />
                                <List.Item
                                    title="예약 기록"
                                    left={() => <List.Icon icon="calendar" />}
                                    onPress={handleReservationsRedirect}
                                />
                                <List.Item
                                    title="상담 기록"
                                    left={() => <List.Icon icon="chat" />}
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
                                        setNotificationsEnabled(
                                            !notificationsEnabled,
                                        );
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
            </ScrollView>
        </>
    );
};

export default ProfilePage;

// import * as React from 'react';
// import { View } from 'react-native';
// import { Avatar, Button, Card, Text, Divider } from 'react-native-paper';
// import { useNavigation } from '@react-navigation/native';

// const UserProfileScreen = ({ user }) => {

//   return (
//     <View style={{ flex: 1, padding: 16 }}>

//     </View>
//   );
// };

// export default UserProfileScreen;

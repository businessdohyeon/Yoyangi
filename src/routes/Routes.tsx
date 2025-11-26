import { BottomNavigation, Icon, useTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationRef } from '../utils/navigationRef';

import MainPage from '../pages/MainPage/MainPage.tsx';
import SearchPage from '../pages/SearchPage/SearchPage.tsx';
import FacilityDetailPage from '../pages/FacilityDetailPage/FacilityDetailPage.tsx';
import CommunityPage from '../pages/CommunityPage/CommunityPage.tsx';
import ProfilePage from '../pages/ProfilePage/ProfilePage.tsx';
import NotificationPage from '../pages/NotificationPage/NotificationPage.tsx';
import LoginPage from '../pages/LoginPage/LoginPage.tsx';
import EditLocationPage from '../pages/EditLocationPage/EditLocationPage.tsx';
import CommunityDetailPage from '../pages/CommunityDetailPage/CommunityDetailPage.tsx';
import ReservationPage from '../pages/ReservationPage/ReservationPage.tsx';
import ReviewForm from '../pages/ReviewForm/ReviewForm.tsx';
import CommunityDetailScreen from '../pages/CommunityDetailPage/CommunityDetailPage.tsx';
import CreateCommunityScreen from '../pages/CreateCommunityPage/CreateCommunityPage.tsx';
import ChatPage from '../pages/ChatPage/ChatPage.tsx';
import ExamDimentiaPage from '../pages/ExamDimentiaPage/ExamDimentiaPage.tsx';
import PredictDiseasePage from '../pages/PredictDiseasePage/PredictDiseasePage.tsx';

// Bottom Tabs 정의
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    const theme = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={({ navigation, state, descriptors, insets }) => (
                <BottomNavigation.Bar
                    navigationState={state}
                    safeAreaInsets={insets}
                    style={{ backgroundColor: theme.colors.background }}
                    onTabPress={({ route, preventDefault }) => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (event.defaultPrevented) {
                            preventDefault();
                        } else {
                            navigation.navigate(route.name);
                        }
                    }}
                    renderIcon={({ route, focused, color }) =>
                        descriptors[route.key].options.tabBarIcon?.({
                            focused,
                            color,
                            size: 24,
                        }) || null
                    }
                    getLabelText={({ route }) => {
                        const { options } = descriptors[route.key];
                        const label =
                            typeof options.tabBarLabel === 'string'
                                ? options.tabBarLabel
                                : typeof options.title === 'string'
                                ? options.title
                                : route.name;
                        return label;
                    }}
                />
            )}
        >
            <Tab.Screen
                name="MainPage"
                component={MainPage}
                options={{
                    tabBarLabel: '홈',
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="SearchPage"
                component={SearchPage}
                options={{
                    tabBarLabel: '검색',
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="magnify" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="CommunityPage"
                component={CommunityPage}
                options={{
                    tabBarLabel: '커뮤니티',
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="forum" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfilePage"
                component={ProfilePage}
                options={{
                    tabBarLabel: '프로필',
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="account" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

// Root Route (Stack) 정의
const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Tabs" component={BottomTabs} />
                <Stack.Screen
                    name="FacilityDetailPage"
                    component={FacilityDetailPage}
                />
                <Stack.Screen
                    name="NotificationPage"
                    component={NotificationPage}
                />
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen
                    name="EditLocationPage"
                    component={EditLocationPage}
                />
                <Stack.Screen
                    name="CommunityDetailPage"
                    component={CommunityDetailPage}
                />
                <Stack.Screen
                    name="ReservationPage"
                    component={ReservationPage}
                />
                <Stack.Screen name="ReviewForm" component={ReviewForm} />
                <Stack.Screen
                    name="CommunityDetail"
                    component={CommunityDetailScreen}
                />
                <Stack.Screen
                    name="CreateCommunity"
                    component={CreateCommunityScreen}
                />
                <Stack.Screen
                    name="ChatPage"
                    component={ChatPage}
                />
                <Stack.Screen
                    name="PredictDiseasePage"
                    component={PredictDiseasePage}
                />
                <Stack.Screen
                    name="ExamDimentiaPage"
                    component={ExamDimentiaPage}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

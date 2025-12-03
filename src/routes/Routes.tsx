/* eslint-disable react/no-unstable-nested-components */
import { BottomNavigation, Icon, useTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, ScreenProps } from '../types/Navigation';
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
import CommunityFormPage from '../pages/CreateCommunityPage/CreateCommunityPage.tsx';
import ChatPage from '../pages/ChatPage/ChatPage.tsx';
import ExamDimentiaPage from '../pages/ExamDimentiaPage/ExamDimentiaPage.tsx';
import PredictDiseasePage from '../pages/PredictDiseasePage/PredictDiseasePage.tsx';
import ConsultationHistory from '../pages/ConsultationHistory/ConsultationHistory.tsx';
import ReservationHistory from '../pages/ReservationHistory/ReservationHistory.tsx';
import LikedOrganizations from '../pages/LikedOrganizations/LikedOrganizations.tsx';
import ReservationDetailPage from '../pages/ReservationDetailPage/ReservationDetailPage.tsx';
import ReviewDetail from '../pages/ReviewDetail/ReviewDetail.tsx';

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
          style={{
            backgroundColor: theme.colors.background,
            borderTopWidth: 1,
            borderTopColor: theme.colors.secondaryContainer,
          }}
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
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={BottomTabs} />
        <Stack.Screen
          name="FacilityDetailPage"
          component={
            FacilityDetailPage as React.ComponentType<
              ScreenProps<'FacilityDetailPage'>
            >
          }
        />
        <Stack.Screen
          name="NotificationPage"
          component={
            NotificationPage as React.ComponentType<
              ScreenProps<'NotificationPage'>
            >
          }
        />
        <Stack.Screen
          name="LoginPage"
          component={LoginPage as React.ComponentType<ScreenProps<'LoginPage'>>}
        />
        <Stack.Screen
          name="EditLocationPage"
          component={
            EditLocationPage as React.ComponentType<
              ScreenProps<'EditLocationPage'>
            >
          }
        />
        <Stack.Screen
          name="CommunityDetail"
          component={
            CommunityDetailPage as React.ComponentType<
              ScreenProps<'CommunityDetail'>
            >
          }
        />
        <Stack.Screen
          name="ReservationPage"
          component={
            ReservationPage as React.ComponentType<
              ScreenProps<'ReservationPage'>
            >
          }
        />
        <Stack.Screen
          name="ReviewForm"
          component={
            ReviewForm as React.ComponentType<ScreenProps<'ReviewForm'>>
          }
        />
        <Stack.Screen
          name="CommunityFormPage"
          component={
            CommunityFormPage as React.ComponentType<
              ScreenProps<'CommunityFormPage'>
            >
          }
        />
        <Stack.Screen
          name="ChatPage"
          component={ChatPage as React.ComponentType<ScreenProps<'ChatPage'>>}
        />
        <Stack.Screen
          name="PredictDiseasePage"
          component={
            PredictDiseasePage as React.ComponentType<
              ScreenProps<'PredictDiseasePage'>
            >
          }
        />
        <Stack.Screen
          name="ExamDimentiaPage"
          component={
            ExamDimentiaPage as React.ComponentType<
              ScreenProps<'ExamDimentiaPage'>
            >
          }
        />
        <Stack.Screen
          name="LikedOrganizations"
          component={
            LikedOrganizations as React.ComponentType<
              ScreenProps<'LikedOrganizations'>
            >
          }
        />
        <Stack.Screen
          name="ReservationHistory"
          component={
            ReservationHistory as React.ComponentType<
              ScreenProps<'ReservationHistory'>
            >
          }
        />
        <Stack.Screen
          name="ConsultationHistory"
          component={
            ConsultationHistory as React.ComponentType<
              ScreenProps<'ConsultationHistory'>
            >
          }
        />
        <Stack.Screen
          name="ReservationDetailPage"
          component={
            ReservationDetailPage as React.ComponentType<
              ScreenProps<'ReservationDetailPage'>
            >
          }
        />
        <Stack.Screen
          name="ReviewDetail"
          component={
            ReviewDetail as React.ComponentType<ScreenProps<'ReviewDetail'>>
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

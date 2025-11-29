import {
    NativeStackScreenProps,
    NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
    BottomTabScreenProps as RNBTabScreenProps,
    BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
    Tabs: undefined;
    MainPage: undefined;
    SearchPage: { kind?: string[]; page?: number } | undefined;
    CommunityPage: undefined;
    ProfilePage: undefined;
    // accept both `facilityId` and `id` because code uses `{ id: ... }` in many places
    FacilityDetailPage: { facilityId?: number; id?: number } | undefined;
    NotificationPage: undefined;
    LoginPage:
        | { returnScreen?: keyof RootStackParamList; returnParams?: any }
        | undefined;
    EditLocationPage: undefined;
    EditProfile: undefined;
    CommunityDetailPage: { id?: number } | undefined;
    ReservationPage: { facilityId: number; facilityName?: string } | undefined;
    ReviewForm:
        | {
              facilityId?: number;
              facilityName?: string;
              reviewId?: number;
              initialValues?: {
                  content?: string;
                  rating?: string | number;
                  reservationId?: string | number;
                  images?: Array<{ uri: string }>;
              };
          }
        | undefined;
    CommunityDetail: { communityId?: number } | undefined;
    CommunityFormPage:
        | {
              communityId?: number;
              initialValues?: {
                  title?: string;
                  content?: string;
                  images?: string[];
              };
          }
        | undefined;
    ChatPage:
        | {
              facility_id: number;
              guardian_id: number;
              sender: number;
              sender_type: string;
          }
        | undefined;
    PredictDiseasePage: undefined;
    ExamDimentiaPage: undefined;
    LikedOrganizations: undefined;
    ReservationHistory: undefined;
    ConsultationHistory: undefined;
    ReservationDetailPage: { reservation_id: number } | undefined;
    ReviewDetail: { facilityId: number; reviewId: number } | undefined;
    ReviewList: { facilityId: number } | undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

// Bottom Tab 네비게이션에 사용되는 파라미터 리스트
export type BottomTabParamList = {
    MainPage: undefined;
    SearchPage: { kind?: string[]; page?: number } | undefined;
    CommunityPage: undefined;
    ProfilePage: undefined;
};

// Bottom Tab screen props helper
export type BottomTabScreenProps<T extends keyof BottomTabParamList> =
    RNBTabScreenProps<BottomTabParamList, T>;

// 네비게이션 prop 타입별 alias
export type BottomTabNavProp<T extends keyof BottomTabParamList> =
    BottomTabNavigationProp<BottomTabParamList, T>;

export type RootStackNavProp<T extends keyof RootStackParamList> =
    NativeStackNavigationProp<RootStackParamList, T>;

// Composite navigation prop (Tab 안에서 Stack 접근 등 복합 상황에 사용)
export type TabAndStackCompositeNav<
    TTab extends keyof BottomTabParamList,
    TStack extends keyof RootStackParamList,
> = CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabParamList, TTab>,
    NativeStackNavigationProp<RootStackParamList, TStack>
>;

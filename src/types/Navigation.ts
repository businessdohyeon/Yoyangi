import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Tabs: undefined;
    MainPage: undefined;
    SearchPage: { kind?: string[]; page?: number } | undefined;
    CommunityPage: undefined;
    ProfilePage: undefined;
    FacilityDetailPage: { facilityId: number } | undefined;
    NotificationPage: undefined;
    LoginPage:
        | { returnScreen?: keyof RootStackParamList; returnParams?: any }
        | undefined;
    EditLocationPage: undefined;
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
    CommunityDetail: undefined;
    CommunityFormPage: undefined;
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

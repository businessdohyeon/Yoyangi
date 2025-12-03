import { useContext } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TabAndStackCompositeNav } from '../../types/Navigation';
import { LocationInfoContext } from '../../Context';
import {
    NaverMapMarkerOverlay,
    NaverMapView,
} from '@mj-studio/react-native-naver-map';
import { FacilityDataSchema } from '../../types/FacilityDataScheme';

export default function Map({
    isMapShown,
    facilityArray,
}: {
    isMapShown: boolean;
    facilityArray: unknown[];
}) {
    const { locationInfo } = useContext(LocationInfoContext);
    const navigation =
        useNavigation<TabAndStackCompositeNav<'SearchPage', 'Tabs'>>();

    return (
        <View
            style={{
                display: isMapShown ? 'flex' : 'none',
                flex: 1,
            }}
        >
            {locationInfo && (
                <NaverMapView
                    style={{ flex: 1 }}
                    initialCamera={{
                        latitude: locationInfo.latitude,
                        longitude: locationInfo.longitude,
                        zoom: 14,
                    }}
                >
                    {isMapShown &&
                        (facilityArray || []).map((facilityData: unknown) => {
                            try {
                                const parsed =
                                    FacilityDataSchema.parse(facilityData);
                                console.log(parsed);

                                return (
                                    <NaverMapMarkerOverlay
                                        key={parsed.id}
                                        latitude={parsed.latitude}
                                        longitude={parsed.longitude}
                                        anchor={{ x: 0.5, y: 1 }}
                                        caption={{ text: parsed.name }}
                                        onTap={() => {
                                            navigation.navigate(
                                                'FacilityDetailPage',
                                                {
                                                    id: parsed.id,
                                                },
                                            );
                                        }}
                                    />
                                );
                            } catch (error) {
                                console.log(facilityData);
                                console.log(error);
                                return null;
                            }
                        })}
                </NaverMapView>
            )}
        </View>
    );
}

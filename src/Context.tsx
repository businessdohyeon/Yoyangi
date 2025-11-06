import { createContext, useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LocationInfoContext = createContext(null);
export const LoginTokenContext = createContext(null);

export function TotalContextPovider({ children }) {
    const [locationInfo, setLocationInfo] = useState(null);
    const [loginInfo, setLoginInfo] = useState(null);

    const loadLonginInfo = async () => {
        const loginInfo = await AsyncStorage.getItem('loginInfo');

        setLoginInfo(loginInfo === null ? null : JSON.parse(loginInfo));

        console.group('getLonginInfo');
        console.log({ loginInfo });
        console.groupEnd();
    };

    const storeLoginInfo = useCallback((value) => {
        setLoginInfo(value);
        AsyncStorage.setItem('loginInfo', JSON.stringify(value));
    }, []);

    const loadLocationInfo = async () => {
        const locationInfo = await AsyncStorage.getItem('locationInfo');

        setLocationInfo(
            locationInfo === null ? null : JSON.parse(locationInfo),
        );

        console.group('getLocationInfo');
        console.log({ locationInfo });
        console.groupEnd();
    };

    const storeLocationInfo = async (value) => {
        setLocationInfo(value);
        await AsyncStorage.setItem('locationInfo', JSON.stringify(value));
    };

    useEffect(() => {
        loadLonginInfo();
        loadLocationInfo();
    }, []);

    return (
        <LocationInfoContext.Provider
            value={{
                locationInfo: locationInfo,
                storeLocationInfo: storeLocationInfo,
            }}
        >
            <LoginTokenContext.Provider
                value={{
                    loginToken: loginInfo,
                    storeLoginInfo: storeLoginInfo,
                }}
            >
                {children}
            </LoginTokenContext.Provider>
        </LocationInfoContext.Provider>
    );
}

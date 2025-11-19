import { createContext, useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

const LocationInfoSchema = z.object({
    latitude: z.preprocess((val) => Number(val), z.number()).default(37.5665),
    longitude: z.preprocess((val) => Number(val), z.number()).default(126.978),
    roadAddress: z.string().default(''),
});

const LoginInfoSchema = z.object({
    userId: z.preprocess((val) => Number(val), z.number()).default(0),
    token: z.string().default(''),
    refreshToken: z.string().default(''),
    provider: z.enum(['naver', 'kakao', 'google']).default('naver'),
});

export type LocationInfo = z.infer<typeof LocationInfoSchema>;
export type LoginInfo = z.infer<typeof LoginInfoSchema>;

export const LocationInfoContext = createContext<{
    locationInfo: LocationInfo;
    storeLocationInfo: (value: LocationInfo) => Promise<void>;
}>({
    locationInfo: LocationInfoSchema.parse({}),
    storeLocationInfo: async (value) => {
        console.log(value);
    },
});

export const LoginInfoContext = createContext<{
    loginInfo: LoginInfo;
    storeLoginInfo: (value: LoginInfo) => void;
}>({
    loginInfo: LoginInfoSchema.parse({}),
    storeLoginInfo: async (value) => {
        console.log(value);
    },
});

export function TotalContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [locationInfo, setLocationInfo] = useState<LocationInfo>(
        LocationInfoSchema.parse({}),
    );
    const [loginInfo, setLoginInfo] = useState<LoginInfo>(
        LoginInfoSchema.parse({}),
    );

    const loadLoginInfo = async () => {
        const data = await AsyncStorage.getItem('loginInfo');

        console.group('loadLoginInfo');

        if (data) {
            try {
                const parsed = LoginInfoSchema.parse(JSON.parse(data));
                setLoginInfo(parsed);

                console.log(parsed);
            } catch (e) {
                console.error('Invalid loginInfo schema', e);
                setLoginInfo(LoginInfoSchema.parse({}));
            }
        } else {
            setLoginInfo(LoginInfoSchema.parse({}));
        }

        console.groupEnd();
    };

    const storeLoginInfo = useCallback((value: LoginInfo) => {
        setLoginInfo(value);
        AsyncStorage.setItem('loginInfo', JSON.stringify(value));
    }, []);

    const loadLocationInfo = async () => {
        const data = await AsyncStorage.getItem('locationInfo');

        console.group('getLocationInfo');

        if (data) {
            try {
                const parsed = LocationInfoSchema.parse(JSON.parse(data));
                setLocationInfo(parsed);
                console.log(parsed);
            } catch (e) {
                console.error('Invalid locationInfo schema', e);
                setLocationInfo(LocationInfoSchema.parse({}));
            }
        } else {
            setLocationInfo(LocationInfoSchema.parse({}));
        }

        console.groupEnd();
    };

    const storeLocationInfo = async (value: LocationInfo) => {
        try {
            const parsed = LocationInfoSchema.parse(value);
            setLocationInfo(parsed);

            console.group('storeLocationInfo');
            console.log(parsed);
            console.groupEnd();

            setLocationInfo(value);
            await AsyncStorage.setItem('locationInfo', JSON.stringify(value));
        } catch (e) {
            console.error('Invalid locationInfo schema', e);
            setLocationInfo(LocationInfoSchema.parse({}));
        }
    };

    useEffect(() => {
        (async () => {
            await loadLoginInfo();
            await loadLocationInfo();
        })();
    }, []);

    return (
        <LocationInfoContext.Provider
            value={{ locationInfo, storeLocationInfo }}
        >
            <LoginInfoContext.Provider value={{ loginInfo, storeLoginInfo }}>
                {children}
            </LoginInfoContext.Provider>
        </LocationInfoContext.Provider>
    );
}

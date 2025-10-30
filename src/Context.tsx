import { createContext, useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LocationContext = createContext(null);
export const LoginTokenContext = createContext(null);

export function TotalContextPovider({ children }) {
    const [location, setLocation] = useState<[number, number]>([0, 0]);
    const [loginToken, setLoginToken] = useState<string | null>(null);

    const hmm = async() =>{
        const value = await AsyncStorage.getItem("loginToken");
        setLoginToken(value);
    }

    useEffect(()=>{
        hmm();
    })

    const tmp = useCallback((value)=>{
        setLoginToken(value);
        AsyncStorage.setItem("loginToken", value);
    },[])

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
            <LoginTokenContext.Provider value={{ loginToken, setLoginToken: tmp }}>
                {children}
            </LoginTokenContext.Provider>
        </LocationContext.Provider>
    );
}

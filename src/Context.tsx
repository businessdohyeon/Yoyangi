import { createContext, useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LocationContext = createContext(null);
export const LoginTokenContext = createContext(null);

export function TotalContextPovider({ children }) {
    const [location, setLocation] = useState<[number, number]>([0, 0]);
    const [loginInfo, setLoginInfo] = useState(null);

    const getLonginInfo = async() =>{
        const loginInfo = await AsyncStorage.getItem("loginInfo");
        
        setLoginInfo(loginInfo === null ? null : JSON.parse(loginInfo));
        
        console.group("getLonginInfo");
        console.log({loginInfo});
        console.groupEnd();
    }

    useEffect(()=>{
        getLonginInfo();
    }, []);

    const storeLoginInfo = useCallback((value)=>{
        setLoginInfo(value);
        AsyncStorage.setItem("loginInfo", JSON.stringify(value));
    },[])

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
            <LoginTokenContext.Provider value={{ loginToken: loginInfo, storeLoginInfo: storeLoginInfo }}>
                {children}
            </LoginTokenContext.Provider>
        </LocationContext.Provider>
    );
}

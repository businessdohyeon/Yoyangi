import { Provider } from 'react-native-paper';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './routes/Routes.tsx';

import { useEffect } from 'react';
import { TotalContextProvider } from './Context.tsx';

const Index = () => {
    useEffect(() => {
        // TODO: get location info from storage
    }, []);

    return (
        <Provider>
            <TotalContextProvider>
                <SafeAreaProvider>
                    <Routes />
                </SafeAreaProvider>
            </TotalContextProvider>
        </Provider>
    );
};

export default Index;

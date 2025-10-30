import { Provider } from 'react-native-paper';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './routes/Routes.tsx';
import { TotalContextPovider } from './Context.tsx';
import { useEffect } from 'react';

const Index = () => {
    useEffect(() => {
        // TODO: get location info from storage
    }, []);

    return (
        <Provider>
            <TotalContextPovider>
                <SafeAreaProvider>
                    <Routes />
                </SafeAreaProvider>
            </TotalContextPovider>
        </Provider>
    );
};

export default Index;

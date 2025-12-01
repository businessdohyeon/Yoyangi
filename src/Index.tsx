import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './routes/Routes.tsx';

import { useEffect } from 'react';
import { TotalContextProvider } from './Context.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Index = () => {
    useEffect(() => {
        // TODO: get location info from storage
    }, []);

    return (
        <TotalContextProvider>
            <QueryClientProvider client={queryClient}>
                <SafeAreaProvider>
                    <Routes />
                </SafeAreaProvider>
            </QueryClientProvider>
        </TotalContextProvider>
    );
};

export default Index;

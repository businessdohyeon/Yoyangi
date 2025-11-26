import { Provider } from 'react-native-paper';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './routes/Routes.tsx';

import { useEffect } from 'react';
import { TotalContextProvider } from './Context.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

const Index = () => {
    useEffect(() => {
        // TODO: get location info from storage
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Provider>
                <TotalContextProvider>
                    <SafeAreaProvider>
                        <Routes />
                    </SafeAreaProvider>
                </TotalContextProvider>
            </Provider>
        </QueryClientProvider>
    );
};

export default Index;

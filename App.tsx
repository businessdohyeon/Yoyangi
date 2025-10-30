import { StatusBar, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Index from './src/Index';

// load translation infos
import './src/locales/index';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <PaperProvider>
            <GestureHandlerRootView>
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                />
                <Index />
            </GestureHandlerRootView>
        </PaperProvider>
    );
}

export default App;

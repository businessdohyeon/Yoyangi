import { StatusBar, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Index from './src/Index';
import { lightTheme, darkTheme } from './src/design/theme';

// load translation infos
import './src/locales/index';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
    const isDarkMode = useColorScheme() === 'dark';
    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <PaperProvider theme={theme}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={theme.colors.background}
                />
                <Index />
            </GestureHandlerRootView>
        </PaperProvider>
    );
}

export default App;

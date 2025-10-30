import { ScrollView } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// import { showBorder } from "./common.js"

const _goBack = () => console.log('Went back');
const _handleSearch = () => console.log('Searching');
const _handleMore = () => console.log('Shown more');

const EditLocationPage = () => {
    const navigation = useNavigation();

    return (
        <>
            <Appbar.Header>
                <Appbar.Action icon="map-marker" onPress={_handleSearch} />
                {/* TODO: 현재위치 가져오는거 */}
                <Appbar.Content title="현재위치" />
                <Appbar.Action
                    icon="magnify"
                    onPress={() => {
                        navigation.navigate('SearchPage');
                    }}
                />
                <Appbar.Action icon="bell" onPress={_handleMore} />
            </Appbar.Header>
            <ScrollView
                contentContainerStyle={{ gap: 10, backgroundColor: '#eeeeee' }}
            >
                <Text>EditLocationPage</Text>
            </ScrollView>
        </>
    );
};

export default EditLocationPage;

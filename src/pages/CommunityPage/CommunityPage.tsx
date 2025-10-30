import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import {
    ActivityIndicator,
    Appbar,
    Avatar,
    Button,
    Card,
    Text,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// import { showBorder } from "./common.js"
import apis from '../../apis';
import PlainHeader from '../MainPage/PlainHeader';

const _goBack = () => console.log('Went back');
const _handleSearch = () => console.log('Searching');
const _handleMore = () => console.log('Shown more');

const CommunityPage = () => {
    const navigation = useNavigation();
    const [communites, setCommunites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const tmp = async () => {
        // const res = await fetch(apis.urls.communites);
        // const json = await res.json();
        // console.log(json);

        const json = apis.mock.getCommunities();

        setCommunites(json.Community);
        setIsLoading(false);
    };

    useEffect(() => {
        tmp();
    }, []);

    console.log(communites);

    const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

    return (
        <>
            <PlainHeader/>
            <ScrollView
                contentContainerStyle={{
                    gap: 10,
                    backgroundColor: '#eeeeee',
                    padding: 10,
                }}
            >
                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                    communites.map((community) => {
                        return (
                            <Card
                                key={community.id}
                                style={{ marginBottom: 30 }}
                                onPress={() => {
                                    navigation.navigate('CommunityDetailPage', {
                                        id: community.id,
                                    });
                                }}
                            >
                                <Card.Title
                                    title="Card Title"
                                    subtitle="Card Subtitle"
                                    left={LeftContent}
                                />
                                <Card.Content>
                                    <Text variant="titleLarge">Card title</Text>
                                    <Text variant="bodyMedium">
                                        Card content
                                    </Text>
                                </Card.Content>
                                <Card.Cover
                                    source={{
                                        uri: 'https://picsum.photos/700',
                                    }}
                                />
                                <Card.Actions>
                                    <Button>Cancel</Button>
                                    <Button>Ok</Button>
                                </Card.Actions>
                            </Card>
                        );
                    })
                )}
            </ScrollView>
        </>
    );
};

export default CommunityPage;

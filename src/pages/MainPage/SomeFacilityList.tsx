import { View } from 'react-native';
import {
    Button,
    Card,
    Chip,
    IconButton,
    Text,
    useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function SomeFacilityList() {
    const navigation = useNavigation();
    const theme = useTheme();

    return (
        <View
            style={{
                padding: 10,
                backgroundColor: '#ffffff',
            }}
        >
            {/* text */}
            <View style={{ marginVertical: 10 }}>
                <Text variant="titleLarge">지금 걸어갈 수 있는 병원</Text>
            </View>
            {/* filter */}
            <View
                style={{
                    marginVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                }}
            >
                <Chip icon="hospital" onPress={() => console.log('Pressed')}>
                    요양병원
                </Chip>
                <Chip icon="forest" onPress={() => console.log('Pressed')}>
                    요양원
                </Chip>
                <Chip
                    icon="sun-clock-outline"
                    onPress={() => console.log('Pressed')}
                >
                    주간데이케어센터
                </Chip>
            </View>
            {/* items */}
            <View style={{ gap: 10, marginVertical: 20 }}>
                <Card onPress={() => console.log('card pressed')}>
                    {/* <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} /> */}
                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                    <Card.Content>
                        <Text variant="titleLarge">병원이름</Text>
                        {/* TODO: 밑 요소에 별점, 위치, 종류 */}
                        <Text variant="bodyMedium">Card content</Text>
                    </Card.Content>
                    <Card.Actions>
                        {/* TODO: 옆으로 보내기 */}
                        <IconButton
                            icon={'heart-outline'}
                            onPress={() => console.log('Adsfsa')}
                        />
                    </Card.Actions>
                </Card>
                <Card onPress={() => console.log('card pressed')}>
                    {/* <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} /> */}
                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                    <Card.Content>
                        <Text variant="titleLarge">병원이름</Text>
                        {/* TODO: 밑 요소에 별점, 위치, 종류 */}
                        <Text variant="bodyMedium">Card content</Text>
                    </Card.Content>
                    <Card.Actions>
                        {/* TODO: 옆으로 보내기 */}
                        <Button>like</Button>
                    </Card.Actions>
                </Card>
            </View>
            {/* moreButton */}
            <View style={{ marginBottom: 20 }}>
                <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('SearchPage')}
                >
                    <Text variant="labelLarge">더보기</Text>
                </Button>
            </View>
        </View>
    );
}

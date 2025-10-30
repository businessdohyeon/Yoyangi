import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function EntrepreneurInfo() {
    const entrepreneurInfo = `(주)굿닥 사업자정보
대표: 이민석
사업자등록번호
통신판매업신고번호
서울특별시강남구역삼로2길
대표전화
이메일`;

    return (
        <View style={{ backgroundColor: '#ffffff' }}>
            <View style={{ padding: 10 }}>
                <Text>{entrepreneurInfo}</Text>
            </View>
            <View
                style={{
                    marginTop: 30,
                    marginBottom: 50,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    gap: 10,
                    paddingHorizontal: 10,
                }}
            >
                <Button
                    mode="outlined"
                    onPress={() => console.log('Pressed')}
                    style={{ flex: 1 }}
                    contentStyle={{}}
                >
                    <Text variant="bodySmall">서비스이용약관</Text>
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => console.log('Pressed')}
                    style={{ flex: 1 }}
                >
                    <Text variant="bodySmall">개인정보처리방침</Text>
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => console.log('Pressed')}
                    style={{ flex: 1 }}
                >
                    <Text variant="bodySmall">위치기반서비스이용약관</Text>
                </Button>
            </View>
        </View>
    );
}

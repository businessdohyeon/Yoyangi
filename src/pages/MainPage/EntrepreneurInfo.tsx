import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export default function EntrepreneurInfo() {
    const theme = useTheme();
    const entrepreneurInfo = `(주)굿닥 사업자정보
대표: 이민석
사업자등록번호
통신판매업신고번호
서울특별시강남구역삼로2길
대표전화
이메일`;

    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                paddingVertical: 8,
            }}
        >
            <View style={{ padding: 10 }}>
                <Text style={{ color: theme.colors.onBackground }}>
                    {entrepreneurInfo}
                </Text>
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
                    style={{ flex: 1, borderColor: theme.colors.primary }}
                    textColor={theme.colors.primary}
                    contentStyle={{ paddingVertical: 6 }}
                >
                    서비스이용약관
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => console.log('Pressed')}
                    style={{ flex: 1, borderColor: theme.colors.primary }}
                    textColor={theme.colors.primary}
                    contentStyle={{ paddingVertical: 6 }}
                >
                    개인정보처리방침
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => console.log('Pressed')}
                    style={{ flex: 1, borderColor: theme.colors.primary }}
                    textColor={theme.colors.primary}
                    contentStyle={{ paddingVertical: 6 }}
                >
                    위치기반서비스이용약관
                </Button>
            </View>
        </View>
    );
}

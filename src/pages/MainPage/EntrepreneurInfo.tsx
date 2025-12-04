import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { OnPressDev } from '../../common';

export default function EntrepreneurInfo() {
  const theme = useTheme();
  const entrepreneurInfo = `(주)요양이(가명) 사업자정보
대표: 홍길동
사업자등록번호: 123-45-67890
통신판매업신고번호: 2021-서울강남-01234
주소: 서울특별시 강남구 역삼로 2길 10, 5층
대표전화: 02-1234-5678
이메일: support@yoyangi.example`;

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
          onPress={OnPressDev}
          style={{ flex: 1, borderColor: theme.colors.primary }}
          textColor={theme.colors.primary}
          contentStyle={{ paddingVertical: 6 }}
        >
          서비스이용약관
        </Button>
        <Button
          mode="outlined"
          onPress={OnPressDev}
          style={{ flex: 1, borderColor: theme.colors.primary }}
          textColor={theme.colors.primary}
          contentStyle={{ paddingVertical: 6 }}
        >
          개인정보처리방침
        </Button>
        <Button
          mode="outlined"
          onPress={OnPressDev}
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

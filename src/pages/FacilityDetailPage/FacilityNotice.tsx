import { Image, useWindowDimensions, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import { showBorder } from '../../common';
import { useNavigation } from '@react-navigation/native';
import { FacilityData_t } from '../SearchPage/scheme';

export function FacilityNotice({
    facilityData,
}: {
    facilityData: FacilityData_t;
}) {
    const navigation = useNavigation();
    const theme = useTheme();
    const { width: viewportWidth } = useWindowDimensions();

    return (
        <View
            style={{
                width: viewportWidth,
                gap: 10,
            }}
        >
            {/* 메뉴판 */}
            <View
                style={{
                    paddingVertical: 20,
                    paddingHorizontal: 10,
                    backgroundColor: theme.colors.background,
                }}
            >
                <View style={{ marginVertical: 10 }}>
                    <Text variant="titleMedium">오늘의 메뉴</Text>
                </View>
                <View
                    style={{
                        gap: 10,
                        marginVertical: 10,
                    }}
                >
                    {['아침', '점식', '저녁'].map((when) => {
                        return (
                            <View
                                key={when}
                                style={{
                                    flexDirection: 'row',
                                    gap: 10,
                                }}
                            >
                                <View
                                    style={{
                                        flex: 3,
                                    }}
                                >
                                    <Image
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC"
                                        style={{
                                            flex: 1,
                                            borderRadius: 10,
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        flex: 5,
                                    }}
                                >
                                    <View style={{}}>
                                        <Text variant="bodyLarge">
                                            {`${when}: 대표메뉴`}
                                        </Text>
                                    </View>
                                    <View style={{}}>
                                        <Text variant="bodyMedium">나머지</Text>
                                    </View>
                                    <View style={{}}>
                                        <Text variant="bodyMedium">나머지</Text>
                                    </View>
                                    <View style={{}}>
                                        <Text variant="bodyMedium">나머지</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text variant="titleMedium">일주일식단표</Text>
                </View>
                <View
                    style={{
                        height: 150,
                    }}
                >
                    <Image
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC"
                        style={{ flex: 1 }}
                    />
                </View>
            </View>
            {/* 병원소식 */}
            <View
                style={{
                    backgroundColor: theme.colors.background,
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                }}
            >
                <View style={{ marginVertical: 10 }}>
                    <Text variant="titleMedium">병원소식</Text>
                </View>
                <View style={{ ...showBorder }}>
                    <View style={{ ...showBorder }}>
                        <View
                            style={{
                                ...showBorder,
                                height: 250,
                            }}
                        >
                            <Image
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC"
                                style={{ flex: 1 }}
                            />
                        </View>
                        <View style={{ ...showBorder }}>
                            <Text>제목</Text>
                        </View>
                        <View style={{ ...showBorder }}>
                            <Text>줄글</Text>
                        </View>
                    </View>
                    <View style={{ ...showBorder }}>
                        <View
                            style={{
                                ...showBorder,
                                height: 250,
                            }}
                        >
                            <Image
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC"
                                style={{ flex: 1 }}
                            />
                        </View>
                        <View style={{ ...showBorder }}>
                            <Text>제목</Text>
                        </View>
                        <View style={{ ...showBorder }}>
                            <Text>줄글</Text>
                        </View>
                    </View>
                </View>
                <View style={{ ...showBorder }}>
                    <Button
                        icon="camera"
                        mode="contained"
                        onPress={() => console.log('Pressed')}
                        style={{ flex: 1 }}
                    >
                        더보기
                    </Button>
                </View>
            </View>
        </View>
    );
}

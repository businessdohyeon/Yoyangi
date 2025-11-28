import { Image, View } from 'react-native';
import { Icon, IconButton, Text, useTheme } from 'react-native-paper';
import { FacilityData_t } from '../../types/FacilityDataScheme';
import { tileData } from './data';

export default function HeroSection({
    facilityData,
    userLike,
}: {
    facilityData: FacilityData_t;
    userLike: () => void;
}) {
    const theme = useTheme();

    return (
        <View style={{ backgroundColor: theme.colors.background }}>
            {/* banner */}
            <View style={{}}>
                <View style={{ height: 350, flex: 1 }}>
                    <Image
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAOVBMVEXm6ezb3uGXoazq7e/Dyc/l6ey/xcyrs7vX3OCnr7jV2d6Zo63O09ibpa+5wMezusLv8fTP1NnIzdMlnmvOAAABdElEQVR4nO3Z0ZKaMBiAUUwQlsaIy/s/bAHdabXxdmn7n3PDCDeZb0JA0nUAAAAAAAAAAAAAAAAAAAAAAAAAAP+u3HT0qA6UT/3Q1J+iZslDemsIGmVJpY5NtaTl6NEdItcyt5eTnMdSY06UlD7eXMk/UvrWofwtzu+bdNGb5NPl4/VGCd4kz+tjZnq5FrxJn8pqfp4psZvkqVxvfUmabB5Naulvn78S3NsEbzKkMpYy3lvkft6PsZt03bSusfW8n8rXVPblNnqTfBkeL/JbkrJHid6k+1pe1yRp/txnSvgmD3uSnC9bFE129yTbrbRG0WTzleQepVZNfkuyR9HkOck9Svgmz0nW30uJ3uQ1iWdxI0n4Jo0k0Zu0kgRv0kwStsn23T63k4RtkmsZb+s/4euttb8zxdzfWbYvA7WO0x9qSZejR3eM3Ke0ZmnuF/cxp8m2s7MMfctyjpoEAAAAAAAAAAAAAAAAAAAAAAAAAPgPnHj1E96TDiAitj9wAAAAAElFTkSuQmCC"
                        style={{ flex: 1 }}
                    />
                </View>
            </View>
            {/* 주요 정보들 */}
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: theme.colors.background,
                }}
            >
                <View style={{ flex: 5, padding: 10 }}>
                    {!facilityData.approval_status ? (
                        <View style={{}}>
                            <Text>"인증시설입니다"</Text>
                        </View>
                    ) : null}
                    <View style={{}}>
                        <Text variant="titleLarge">{facilityData.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginRight: 10 }}>
                            <Text>별점</Text>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <Text>{`${facilityData.sggu_name} ${facilityData.sido_name}`}</Text>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <Text>{facilityData.kind}</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                >
                    <IconButton icon={'heart'} onPress={userLike} size={30} />
                </View>
            </View>
            {/* 주소랑 당일 운영시간 */}
            <View style={{ padding: 10 }}>
                <View>
                    <Text>{facilityData.address}</Text>
                </View>
                <View>
                    <Text>대충 운영시간</Text>
                </View>
                <View>
                    <Text>{facilityData.url || 'url...'}</Text>
                </View>
            </View>
            {/* 타일 정보판 */}
            <View
                style={{
                    height: 250,
                    backgroundColor: '#eeeeee',
                    marginVertical: 20,
                }}
            >
                {tileData.map((row, idx) => {
                    return (
                        <View
                            key={`tileDataRow${idx}`}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}
                        >
                            {row.map((item) => (
                                <View
                                    key={item.label}
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Icon
                                        source={item.iconSource}
                                        size={40}
                                        color={item.iconColor}
                                    />
                                    <Text variant="labelSmall">
                                        {item.label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

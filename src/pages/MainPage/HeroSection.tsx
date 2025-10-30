import { useRef } from 'react';
import { Dimensions, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Carousel, {
    ICarouselInstance,
    Pagination,
} from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

export default function HeroSection() {
    const navigation = useNavigation();
    const theme = useTheme();

    return (
        <View style={{ backgroundColor: theme.colors.background }}>
            <AdBanner />
            <BigButtons />
        </View>
    );
}

const data = [...new Array(6).keys()];
const width = Dimensions.get('window').width;

function AdBanner() {
    const navigation = useNavigation();
    const theme = useTheme();

    const ref = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            /**
             * Calculate the difference between the current index and the target index
             * to ensure that the carousel scrolls to the nearest index
             */
            count: index - progress.value,
            animated: true,
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <Carousel
                ref={ref}
                width={width}
                height={width / 2}
                data={data}
                onProgressChange={progress}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 30,
                            }}
                        >
                            {index}
                        </Text>
                    </View>
                )}
            />
            <Pagination.Basic
                progress={progress}
                data={data}
                dotStyle={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 50,
                }}
                containerStyle={{ gap: 5, marginTop: 10 }}
                onPress={onPressPagination}
            />
        </View>
    );
}

function BigButtons() {
    const navigation = useNavigation();
    const theme = useTheme();

    // TODO: button 개조하거나 따로 만들어야 할지도..? */

    return (
        <View
            style={{
                height: 300,
                flex: 1,
                paddingHorizontal: 10,
                marginVertical: 20,
            }}
        >
            <View
                style={{
                    flex: 2,
                    flexDirection: 'row',
                }}
            >
                <View style={{ flex: 1, margin: 5 }}>
                    <Button
                        style={{}}
                        textColor={theme.dark ? 'white' : 'black'}
                        contentStyle={{ height: '100%' }}
                        icon="camera"
                        mode="elevated"
                        onPress={() => console.log('Pressed')}
                    >
                        주변 요양병원 검색
                    </Button>
                </View>
                <View style={{ flex: 1, margin: 5 }}>
                    <Button
                        style={{}}
                        textColor={theme.dark ? 'white' : 'black'}
                        contentStyle={{ height: '100%' }}
                        icon="camera"
                        mode="elevated"
                        onPress={() => console.log('Pressed')}
                    >
                        주변 요양원 검색
                    </Button>
                </View>
                <View style={{ flex: 1, margin: 5 }}>
                    <Button
                        style={{}}
                        textColor={theme.dark ? 'white' : 'black'}
                        contentStyle={{ height: '100%' }}
                        icon="camera"
                        mode="elevated"
                        onPress={() => console.log('Pressed')}
                    >
                        주변 주간데이케이센터 검색
                    </Button>
                </View>
            </View>
            <View
                style={{
                    flex: 1,

                    flexDirection: 'row',
                }}
            >
                <View style={{ flex: 1, margin: 5 }}>
                    <Button
                        style={{}}
                        textColor={theme.dark ? 'white' : 'black'}
                        contentStyle={{ height: '100%' }}
                        icon="camera"
                        mode="elevated"
                        onPress={() => console.log('Pressed')}
                    >
                        Press me
                    </Button>
                </View>
                <View style={{ flex: 1, margin: 5 }}>
                    <Button
                        style={{}}
                        textColor={theme.dark ? 'white' : 'black'}
                        contentStyle={{ height: '100%' }}
                        icon="camera"
                        mode="elevated"
                        onPress={() => console.log('Pressed')}
                    >
                        Press me
                    </Button>
                </View>
            </View>
        </View>
    );
}

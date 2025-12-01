import { useRef } from 'react';
import { Dimensions, View, Pressable, StyleSheet } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TabAndStackCompositeNav } from '../../types/Navigation';
import Carousel, {
    ICarouselInstance,
    Pagination,
} from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

export default function HeroSection() {
    const navigation =
        useNavigation<TabAndStackCompositeNav<'MainPage', 'Tabs'>>();
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
    const navigation =
        useNavigation<TabAndStackCompositeNav<'MainPage', 'Tabs'>>();
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
    const navigation =
        useNavigation<TabAndStackCompositeNav<'MainPage', 'Tabs'>>();
    const theme = useTheme();

    return (
        <View
            style={{
                height: 300,
                flex: 1,
                paddingHorizontal: 10,
                marginVertical: 20,
            }}
        >
            <View style={styles.row}>
                <View style={styles.cell}>
                    <FeatureButton
                        icon="hospital-building"
                        label="주변 요양병원 검색"
                        onPress={() =>
                            navigation.navigate('SearchPage', {
                                kind: ['요양병원'],
                            })
                        }
                        theme={theme}
                    />
                </View>
                <View style={styles.cell}>
                    <FeatureButton
                        icon="home-group"
                        label="주변 요양원 검색"
                        onPress={() =>
                            navigation.navigate('SearchPage', {
                                kind: ['요양원'],
                            })
                        }
                        theme={theme}
                    />
                </View>
                <View style={styles.cell}>
                    <FeatureButton
                        icon="calendar-check"
                        label="주변 주간보호케어센터 검색"
                        onPress={() =>
                            navigation.navigate('SearchPage', {
                                kind: ['주간보호케어센터'],
                            })
                        }
                        theme={theme}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.cell}>
                    <FeatureButton
                        icon="brain"
                        label="치매 자가 진단"
                        onPress={() => navigation.navigate('ExamDimentiaPage')}
                        theme={theme}
                    />
                </View>
                <View style={styles.cell}>
                    <FeatureButton
                        icon="pill"
                        label="질병 예측"
                        onPress={() =>
                            navigation.navigate('PredictDiseasePage')
                        }
                        theme={theme}
                    />
                </View>
                <View style={styles.cell} />
            </View>
        </View>
    );
}

function FeatureButton({
    icon,
    label,
    onPress,
    theme,
}: {
    icon: string;
    label: string;
    onPress: () => void;
    theme: any;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.featureButton,
                {
                    backgroundColor: pressed
                        ? theme.dark
                            ? '#222'
                            : '#eee'
                        : 'transparent',
                },
            ]}
        >
            <IconButton
                icon={icon}
                size={36}
                style={styles.iconButton}
                iconColor={theme.dark ? 'white' : 'black'}
            />
            <Text
                style={[
                    styles.featureLabel,
                    { color: theme.dark ? 'white' : 'black' },
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    cell: { flex: 1, margin: 5 },
    featureButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    iconButton: {
        margin: 0,
        backgroundColor: 'transparent',
    },
    featureLabel: {
        textAlign: 'center',
        fontSize: 14,
        flexWrap: 'wrap',
    },
});

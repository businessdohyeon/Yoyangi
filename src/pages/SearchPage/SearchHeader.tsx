import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
    Appbar,
    Chip,
    Icon,
    Searchbar,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import apis from '../../apis';
// import { showBorder } from "./common.js"

// TODO: 어느정도되면 Map, FacilityList 컴포넌트 분리, 각각 상태 가져가서 그에 따라 display설정하는 것 잊지말고

export default function SearchHeader({setFacilityArray}) {
    const navigation = useNavigation();
    const theme = useTheme();

    const { width, height } = useWindowDimensions();

    const [searchQuery, setSearchQuery] = useState('');


    const onSearchQuerySubmit = async () => {
        console.log(`${apis.urls.facilities}?keyword=${searchQuery}`);

        const res = await fetch(
            `${apis.urls.facilities}?keyword=${searchQuery}`,
        );
        const json = await res.json();

        setFacilityArray(json.Response);

        console.log('onSubmit', json);
    };

    return (
        <Appbar.Header
            elevated
            style={{
                flexDirection: 'column',
                height: 'auto',
                backgroundColor: theme.colors.background,
            }}
        >
            {/* 검색박스 */}
            <Searchbar
                placeholder="증상, 진료과, 병원을 검색해보세요"
                onChangeText={setSearchQuery}
                value={searchQuery}
                mode="view"
                icon={'magnify'}
                showDivider={false}
                style={{
                    backgroundColor: theme.colors.background,
                    // ...showBorder
                }}
                onSubmitEditing={onSearchQuerySubmit}
            />
            {/* 검색관련 */}
            <View style={{}}>
                {/* 위치설정 */}
                {/* TODO: ripple이 안되는데.. 흠... */}
                <TouchableRipple
                    onPress={() => {
                        navigation.navigate('EditLocationPage');
                    }}
                    style={{
                        backgroundColor: '#eeeeee',
                        paddingHorizontal: 10,
                        width: width,
                    }}
                    rippleColor="rgba(0, 0, 0, .32)"
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            marginVertical: 10,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Icon source={'map-marker'} size={20} />
                        </View>
                        <View style={{ flex: 6, justifyContent: 'center' }}>
                            <Text>현재위치</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text>변경</Text>
                        </View>
                    </View>
                </TouchableRipple>
                {/* 필터 */}
                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: theme.colors.background,
                        padding: 10,
                        paddingHorizontal: 10,
                        justifyContent: 'space-around',
                        width: width,
                    }}
                >
                    <Chip
                        icon="hospital"
                        onPress={() => console.log('Pressed')}
                    >
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
            </View>
        </Appbar.Header>
    );
}

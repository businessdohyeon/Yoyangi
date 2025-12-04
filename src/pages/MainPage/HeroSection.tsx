import { useRef } from 'react';
import { Dimensions, View, Pressable, StyleSheet, Image } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TabAndStackCompositeNav } from '../../types/Navigation';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import ad1 from './ad1.jpg';
import ad2 from './ad2.png';
import ad3 from './ad3.jpg';

export default function HeroSection() {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <AdBanner />
      <BigButtons />
    </View>
  );
}

const tmp = {
  daycare: `주변 주간보호
케어센터 검색`,
  hospital: `주변 요양병원
검색`,
  one: `주변 요양원
검색`,
};
const ads = [ad2, ad1, ad3];
const width = Dimensions.get('window').width;

function AdBanner() {
  // navigation and theme not required inside AdBanner

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
        height={300}
        data={ads}
        onProgressChange={progress}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
        )}
      />
      <Pagination.Basic
        progress={progress}
        data={ads}
        dotStyle={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: 50,
        }}
        containerStyle={{ gap: 5, marginTop: -20 }}
        onPress={onPressPagination}
      />
    </View>
  );
}

function BigButtons() {
  const navigation =
    useNavigation<TabAndStackCompositeNav<'MainPage', 'Tabs'>>();

  return (
    <View
      style={{
        height: 280,
        flex: 1,
        paddingHorizontal: 10,
        marginVertical: 20,
      }}
    >
      <View style={{ ...styles.row, flex: 2 }}>
        <View style={styles.cell}>
          <FeatureButton
            icon="hospital-building"
            label={tmp.hospital}
            onPress={() =>
              navigation.navigate('SearchPage', {
                kind: ['요양병원'],
              })
            }
          />
        </View>
        <View style={styles.cell}>
          <FeatureButton
            icon="home-group"
            label={tmp.one}
            onPress={() =>
              navigation.navigate('SearchPage', {
                kind: ['요양원'],
              })
            }
          />
        </View>
        <View style={styles.cell}>
          <FeatureButton
            icon="calendar-check"
            label={tmp.daycare}
            onPress={() =>
              navigation.navigate('SearchPage', {
                kind: ['주야간보호센터'],
              })
            }
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.cell, { flex: 1 }]}>
          <FeatureButton
            icon="brain"
            label="치매 자가 진단"
            onPress={() => navigation.navigate('ExamDimentiaPage')}
          />
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <FeatureButton
            icon="pill"
            label="질병 예측"
            onPress={() => navigation.navigate('PredictDiseasePage')}
          />
        </View>
      </View>
    </View>
  );
}

function FeatureButton({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.featureButton,
        styles.featureShadow,
        {
          backgroundColor: pressed
            ? theme.colors.primary + '12'
            : theme.colors.surface,
        },
      ]}
    >
      <IconButton
        icon={icon}
        size={36}
        style={styles.iconButton}
        iconColor={theme.colors.primary}
      />
      <Text
        style={[
          styles.featureLabel,
          { color: theme.colors.onPrimaryContainer },
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
  featureShadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
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

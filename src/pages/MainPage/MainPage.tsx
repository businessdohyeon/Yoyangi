import { ScrollView, StyleSheet } from 'react-native';

import PlainHeader from './PlainHeader';
import EntrepreneurInfo from './EntrepreneurInfo';
import HeroSection from './HeroSection';
import SomeFacilityList from './SomeFacilityList';

const styles = StyleSheet.create({
    container: { gap: 10, backgroundColor: '#eeeeee' },
});

export default function MainPage() {
    // const { t } = useTranslation();

    return (
        <>
            <PlainHeader />
            <ScrollView contentContainerStyle={styles.container}>
                <HeroSection />
                <SomeFacilityList />
                <EntrepreneurInfo />
            </ScrollView>
        </>
    );
}

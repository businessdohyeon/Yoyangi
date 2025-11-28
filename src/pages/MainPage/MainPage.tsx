import { ScrollView, StyleSheet, View } from 'react-native';

import PlainHeader from './PlainHeader';
import EntrepreneurInfo from './EntrepreneurInfo';
import HeroSection from './HeroSection';
import SomeFacilityList from './SomeFacilityList';
import { useState } from 'react';
import apis from '../../apis';
import { Button, Text } from 'react-native-paper';

const styles = StyleSheet.create({
    container: { gap: 10, backgroundColor: '#eeeeee' },
});

export default function MainPage() {
    // const { t } = useTranslation();
    // const {height: vh, width: vw} = useWindowㅅDimensions();
    
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

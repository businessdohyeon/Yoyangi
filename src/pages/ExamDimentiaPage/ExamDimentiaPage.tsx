// ExamDimentiaPage.js
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import {
    Card,
    RadioButton,
    Button,
    Text,
    TextInput,
    DataTable,
    Divider,
} from 'react-native-paper';
import GoBackHeader from '../FacilityDetailPage/GoBackHeader';
import patternImg from './patternImg.png';
import paintingImg from './painting.png';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExamDimentiaPage() {
    // 선택지 방식으로 변경 (0점 / 정답점)
    type YesNo = 'yes' | 'no' | null;

    const [orientationYear, setOrientationYear] = useState<YesNo>(null);
    const [orientationMonth, setOrientationMonth] = useState<YesNo>(null);
    const [orientationDay, setOrientationDay] = useState<YesNo>(null);
    const [orientationWeekday, setOrientationWeekday] = useState<YesNo>(null);

    const [placeCorrect, setPlaceCorrect] = useState<YesNo>(null);
    const [memoryRegisterCorrect, setMemoryRegisterCorrect] =
        useState<YesNo>(null);
    const [attentionCorrect, setAttentionCorrect] = useState<YesNo>(null);
    const [execFunctionCorrect, setExecFunctionCorrect] = useState<YesNo>(null);

    const [recallMinsoo, setRecallMinsoo] = useState<YesNo>(null);
    const [recallBicycle, setRecallBicycle] = useState<YesNo>(null);
    const [recallPark, setRecallPark] = useState<YesNo>(null);
    const [recall11, setRecall11] = useState<YesNo>(null);
    const [recallBaseball, setRecallBaseball] = useState<YesNo>(null);

    const [languageCorrect, setLanguageCorrect] = useState<YesNo>(null);

    const [age, setAge] = useState('');
    const [education, setEducation] = useState('비문해');

    const [showResult, setShowResult] = useState(false);

    // 점수 계산
    const calcScore = () => {
        let s = 0;
        s += orientationYear === 'yes' ? 1 : 0;
        s += orientationMonth === 'yes' ? 1 : 0;
        s += orientationDay === 'yes' ? 1 : 0;
        s += orientationWeekday === 'yes' ? 1 : 0;

        s += placeCorrect === 'yes' ? 1 : 0;
        s += memoryRegisterCorrect === 'yes' ? 5 : 0;
        s += attentionCorrect === 'yes' ? 1 : 0;
        s += execFunctionCorrect === 'yes' ? 2 : 0;

        s += recallMinsoo === 'yes' ? 2 : 0;
        s += recallBicycle === 'yes' ? 2 : 0;
        s += recallPark === 'yes' ? 2 : 0;
        s += recall11 === 'yes' ? 2 : 0;
        s += recallBaseball === 'yes' ? 2 : 0;

        s += languageCorrect === 'yes' ? 1 : 0;
        return s;
    };

    const interpretResult = (v: number) => {
        if (v >= 20) return '정상 범위';
        if (v >= 14) return '경미한 인지저하 가능성';
        return '인지저하 가능성';
    };

    return (
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
            <GoBackHeader title={'치매 간단 검사'} />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.section}>지남력</Text>
                        <SelectBlock
                            label="올해는 몇 년도입니까?"
                            value={orientationYear}
                            onChange={setOrientationYear}
                        />
                        <SelectBlock
                            label="지금은 몇 월입니까?"
                            value={orientationMonth}
                            onChange={setOrientationMonth}
                        />
                        <SelectBlock
                            label="오늘은 며칠입니까?"
                            value={orientationDay}
                            onChange={setOrientationDay}
                        />
                        <SelectBlock
                            label="오늘은 무슨 요일입니까?"
                            value={orientationWeekday}
                            onChange={setOrientationWeekday}
                        />
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.section}>장소</Text>
                        <SelectBlock
                            label="현재 있는 장소를 맞힘"
                            value={placeCorrect}
                            onChange={setPlaceCorrect}
                        />
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.section}>기억 등록</Text>
                        <Text>문장 따라하기</Text>
                        <SelectBlock
                            label="문장을 정확히 따라함"
                            value={memoryRegisterCorrect}
                            onChange={setMemoryRegisterCorrect}
                        />
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.section}>주의력</Text>
                        <Text>숫자 6-9-7-3 따라하기</Text>
                        <SelectBlock
                            label="정확히 따라함"
                            value={attentionCorrect}
                            onChange={setAttentionCorrect}
                        />
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.section}>집행기능</Text>
                        <Text>패턴 문제 보기</Text>
                        <Image
                            style={{ width: '100%' }}
                            resizeMode="contain"
                            source={patternImg}
                        />
                        <SelectBlock
                            label="정답 선택함"
                            value={execFunctionCorrect}
                            onChange={setExecFunctionCorrect}
                        />
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.section}>기억 회상</Text>

                        <SelectBlock
                            label="민수"
                            value={recallMinsoo}
                            onChange={setRecallMinsoo}
                        />
                        <SelectBlock
                            label="자전거"
                            value={recallBicycle}
                            onChange={setRecallBicycle}
                        />
                        <SelectBlock
                            label="공원"
                            value={recallPark}
                            onChange={setRecallPark}
                        />
                        <SelectBlock
                            label="11시"
                            value={recall11}
                            onChange={setRecall11}
                        />
                        <SelectBlock
                            label="야구"
                            value={recallBaseball}
                            onChange={setRecallBaseball}
                        />
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.section}>언어 기능</Text>
                        <Text>그림 이름 맞히기</Text>
                        <Image
                            style={{ width: '100%' }}
                            resizeMode="contain"
                            source={paintingImg}
                        />
                        <SelectBlock
                            label="그림 이름을 맞힘"
                            value={languageCorrect}
                            onChange={setLanguageCorrect}
                        />
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.section}>검사자 정보</Text>
                        <TextInput
                            label="어르신 만 나이"
                            value={age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                            style={{ marginBottom: 12 }}
                        />
                        <Text style={{ marginBottom: 6 }}>최종 학력</Text>
                        <RadioButton.Group
                            onValueChange={setEducation}
                            value={education}
                        >
                            <RadioButton.Item label="비문해" value="비문해" />
                            <RadioButton.Item
                                label="무학/문해(~5년)"
                                value="무학/문해"
                            />
                            <RadioButton.Item
                                label="초졸(6~8년)"
                                value="초졸"
                            />
                            <RadioButton.Item
                                label="중졸(9~11년)"
                                value="중졸"
                            />
                            <RadioButton.Item
                                label="고졸(12~15년)"
                                value="고졸"
                            />
                            <RadioButton.Item
                                label="대졸 이상(16년~)"
                                value="대졸"
                            />
                        </RadioButton.Group>
                    </Card.Content>
                </Card>
                <Button
                    mode="contained"
                    onPress={() => setShowResult(true)}
                    style={styles.btn}
                >
                    결과 확인
                </Button>
                {showResult && (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.section}>결과</Text>
                            <Divider style={{ marginVertical: 8 }} />

                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title>판정</DataTable.Title>
                                </DataTable.Header>

                                <DataTable.Row>
                                    <DataTable.Cell>
                                        {interpretResult(calcScore())}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            </DataTable>
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

function SelectBlock({
    label,
    value,
    onChange,
}: {
    label: string;
    value: 'yes' | 'no' | null | undefined;
    onChange: React.Dispatch<React.SetStateAction<'yes' | 'no' | null>>;
}) {
    return (
        <View style={styles.block}>
            <Text style={styles.label}>{label}</Text>
            <RadioButton.Group
                onValueChange={(v: string) => onChange(v as 'yes' | 'no')}
                value={value ?? ''}
            >
                <RadioButton.Item label="정답" value="yes" />
                <RadioButton.Item label="하지 못함" value="no" />
            </RadioButton.Group>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 12, paddingBottom: 40 },
    card: { marginBottom: 12 },
    section: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
    block: { marginBottom: 12 },
    label: { marginBottom: 4 },
    btn: { marginTop: 16 },
});

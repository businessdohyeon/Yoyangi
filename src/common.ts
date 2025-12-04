import { Alert, Platform, ToastAndroid } from "react-native";

export function OnPressDev() {
  if (Platform.OS === 'android') {
    ToastAndroid.show('아직 준비 중인 기능입니다.', ToastAndroid.SHORT);
  } else {
    Alert.alert('개발중이에ㅕ요', '아직 준비 중인 기능입니다.');
  }
}

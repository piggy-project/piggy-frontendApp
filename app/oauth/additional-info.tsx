import { useAuth } from '@/components/utils/AuthContext';
import { authApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SocialBasicInfo() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const { loginWithToken } = useAuth();
  const { logout } = useAuth();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [phoneNum, setPhoneNum] = useState('');

  // 토큰이 들어오면 즉시 로그인 처리 (다음 페이지 API 호출을 위해)
  useEffect(() => {
    if (token) loginWithToken(token.toString());
  }, [token]);

  // 뒤로가기 버튼 감지 로직
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // 닉네임 페이지로 '다음' 버튼 눌러서 가는 경우는 제외 (action type 확인)
      if (e.data.action.type === 'PUSH' || e.data.action.type === 'REPLACE') {
        return;
      }
      // 뒤로가기 발생 시 실행
      handleCancelSignup();
    });

    return unsubscribe;
  }, [navigation]);

  const isNameValid = name.length >= 2;
  const isPhoneValid = /^\d{11}$/.test(phoneNum);
  const isBirthValid = /^\d{8}$/.test(birth);
  const isValid = isNameValid && isPhoneValid && isBirthValid;

  // 다음 단계(닉네임)로 데이터 가지고 이동
  const handleNext = () => {
    router.push({
      pathname: '/oauth/additional-nickname',
      params: { name, birth, phoneNum }
    });
  };
  // 취소 로직: 서버 데이터 지우고 뒤로 가기
  const handleCancelSignup = async () => {
  try {
    await logout(); 

    // 서버에 삭제 요청
    authApi.cancelSocialSignup().catch(err => console.error("서버 삭제 실패:", err));

    // 즉시 로그인 화면으로 교체
    router.replace('/'); 
  } catch (error) {
    console.error("취소 처리 중 에러:", error);
  } finally {
    await logout(); 
    router.replace('/'); 
  }
};

  const formatBirthDateView = (text: string) => {
    const cleaned = ('' + text).replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 4)} / ${cleaned.slice(4)}`;
    if (cleaned.length > 6) formatted = `${formatted.slice(0, 9)} / ${formatted.slice(9)}`;
    return formatted;
  };

  const formatPhoneNumberView = (text: string) => {
    const cleaned = ('' + text).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) return `${match[1]} ${match[2]} ${match[3]}`;
    return cleaned;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, Typography.Pretendard_B_24]}>기본정보를 입력해주세요</Text>

        {/* 이름 */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, Typography.Pretendard_M_14]}>이름</Text>
          <TextInput
            style={[styles.input, Typography.Pretendard_M_16]}
            placeholder="성함"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* 전화번호 */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, Typography.Pretendard_M_14]}>전화번호</Text>
          <TextInput
            style={[styles.input, Typography.Pretendard_M_16]}
            placeholder="010 0000 0000"
            value={formatPhoneNumberView(phoneNum)}
            onChangeText={(text) => setPhoneNum(text.replace(/\s/g, ''))} // 저장할 땐 공백 제거
            keyboardType="number-pad"
            maxLength={13}
          />
        </View>

        {/* 생년월일 */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, Typography.Pretendard_M_14]}>생년월일</Text>
          <View style={styles.dateInputContainer}>
            <TextInput
              style={[styles.dateInput, Typography.Pretendard_M_16]}
              placeholder="2000 / 00 / 00"
              value={formatBirthDateView(birth)}
              onChangeText={(text) => setBirth(text.replace(/\D/g, '').slice(0, 8))}
              keyboardType="number-pad"
              maxLength={14}
            />
            <Ionicons name="calendar-outline" size={24} color="#ccc" style={styles.icon} />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.disabledButton]}
        onPress={handleNext}
        disabled={!isValid}
      >
        <Text style={[styles.buttonText, Typography.Pretendard_M_16]}>다음</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 60 },
  content: { marginTop: 20 },
  title: { marginBottom: 40, lineHeight: 32 },
  inputGroup: { marginBottom: 30 },
  label: { marginBottom: 10, color: '#333' },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10 },
  dateInputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  dateInput: { flex: 1, paddingVertical: 10 },
  icon: { marginLeft: 10 },
  button: { backgroundColor: '#333', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { color: '#fff' },
});
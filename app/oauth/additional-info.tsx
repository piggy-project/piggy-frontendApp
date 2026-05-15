import { useAuth } from '@/components/utils/AuthContext';
import { authApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SocialBasicInfo() {
  const router = useRouter();
  const { token, refreshToken } = useLocalSearchParams();
  const { loginWithToken, logout } = useAuth();
  const navigation = useNavigation();

  const [birth, setBirth] = useState('');
  const [phoneNum, setPhoneNum] = useState('');

  useEffect(() => {
    const handleSocialToken = async () => {
      if (!token) return;

      if (!refreshToken) {
        Alert.alert('오류', '로그인 정보가 부족합니다. 다시 로그인해 주세요.');
        router.replace('/login');
        return;
      }

      try {
        await loginWithToken(token.toString(), refreshToken.toString());
      } catch {
        Alert.alert('오류', '소셜 로그인 처리 중 오류가 발생했습니다.');
        router.replace('/login');
      }
    };

    handleSocialToken();
  }, [loginWithToken, refreshToken, router, token]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'PUSH' || e.data.action.type === 'REPLACE') {
        return;
      }
      handleCancelSignup();
    });
    return unsubscribe;
  }, [navigation]);

  const isPhoneValid = /^\d{11}$/.test(phoneNum);
  const isBirthValid = /^\d{8}$/.test(birth);
  const isValid = isPhoneValid && isBirthValid;

  const handleNext = () => {
    router.push({
      pathname: '/oauth/additional-nickname',
      params: { birth, phoneNum }
    });
  };

  const handleCancelSignup = async () => {
    try {
      await logout(); 
      authApi.cancelSocialSignup().catch(err => console.error("서버 삭제 실패:", err));
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

        {/* 전화번호 */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, Typography.Pretendard_M_14]}>전화번호</Text>
          <TextInput
            style={[styles.input, Typography.Pretendard_M_16]}
            placeholder="010 0000 0000"
            value={formatPhoneNumberView(phoneNum)}
            onChangeText={(text) => setPhoneNum(text.replace(/\s/g, ''))}
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

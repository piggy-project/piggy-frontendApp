import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignupData } from '../../components/utils/SignupContext';

export default function SignupNickname() {
  const router = useRouter();
  const { data } = useSignupData(); // 지금까지 모은 데이터 다 가져오기
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      // 1. 생년월일 포맷 변경 (YYYYMMDD -> YYYY-MM-DD)
      const formattedBirth = data.birth.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

      const requestBody = {
        email: data.email,
        password: data.password,
        checkedPassword: data.password, // 백엔드 요구사항
        name: data.name,
        nickname: nickname, // 현재 입력한 닉네임
        birth: formattedBirth,
        phoneNum: data.phoneNum,
      };

      console.log('가입 요청:', requestBody);

      // 2. 서버 요청 (안드로이드 에뮬레이터 기준 10.0.2.2)
      const response = await fetch('http://10.0.2.2:8080/users/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // 성공 시 성공 페이지로 이동
        router.push('/signup/success'); 
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert('가입 실패', errorData.message || '정보를 확인해주세요.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>마지막이에요!{'\n'}닉네임을 정해주세요</Text>
        <TextInput 
          style={styles.input}
          placeholder="닉네임 입력"
          value={nickname}
          onChangeText={setNickname}
        />
      </View>
      <TouchableOpacity 
        style={[styles.button, !nickname && styles.disabledButton]} 
        onPress={handleSignUp}
        disabled={!nickname}
      >
        <Text style={styles.buttonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 60 },
  content: { marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', fontSize: 18, paddingVertical: 10 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
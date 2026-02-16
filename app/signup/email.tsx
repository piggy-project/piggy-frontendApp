import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignupData } from '../../components/utils/SignupContext';

import { authApi } from '../../components/utils/api';

export default function SignupEmail() {
  const router = useRouter();
  const { updateData } = useSignupData();
  
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false); // 로딩 상태
  const [isAvailable, setIsAvailable] = useState(false); // 중복확인 통과 여부
  const [showCheckError, setShowCheckError] = useState(false); // 중복체크 에러 표시 여부
  const [duplicateError, setDuplicateError] = useState(''); // 이미 존재하는 이메일 표시용

  
  // 이메일 정규식 (형식 검사)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFormatValid = emailRegex.test(email);

  // 이메일 입력값이 바뀔 때 상태 초기화
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsAvailable(false);    // 다시 검사해야 함
    setShowCheckError(false); // "중복체크 해주세요" 숨김
    setDuplicateError('');    // "이미 존재합니다" 숨김
  };

  // 서버에 중복 체크 요청
  const checkEmailDuplicate = async () => {
    if (!isFormatValid) {
      Alert.alert('알림', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsChecking(true);
    setShowCheckError(false);
    setDuplicateError('');

    try {
      // (내부에서 에러가 나면 catch로 넘어감)
      const data = await authApi.checkEmail(email);

      // 성공적으로 데이터를 받으면(200 OK) 여기로 옴
      if (data.isAvailable) {
        setIsAvailable(true);
      } else {
        // 200이지만 사용 불가능한 경우 (백엔드 로직에 따라 다름)
        setIsAvailable(false);
        setDuplicateError('이미 존재하는 이메일입니다.');
      }

    } catch (error: any) {
      // api.ts에서 던진 에러를 여기서 잡음
      if (error.status === 400 || (error.data && !error.data.isAvailable)) {
        setIsAvailable(false);
        setDuplicateError('이미 존재하는 이메일입니다.');
      } else {
        Alert.alert('오류', error.message || '서버 연결 실패');
      }
    } finally {
      setIsChecking(false);
    }
  };

  // 다음 버튼 클릭 시
  const handleNext = () => {
    // 1. 이메일 형식이 틀렸을 때
    if (!isFormatValid) return;

    // 2. 중복 체크를 통과하지 못했을 때
    if (!isAvailable) {
      // 만약 이미 중복 에러가 떠있다면 "체크해주세요"는 안 띄워도 됨 (선택사항)
      // 여기서는 중복 에러가 없는데 available하지 않은 경우(즉, 체크 안한 경우)만 처리
      if (!duplicateError) {
        setShowCheckError(true); // 에러 표시
      }
      return;
    }

    // 3. 모두 통과하면 다음 페이지로 이동
    updateData({ email });
    router.push('/signup/password');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>로그인에 사용할{'\n'}이메일을 입력해주세요</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder="이메일 입력"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          {/* 우측 체크 아이콘 영역 */}
          <View style={styles.iconArea}>
            {isChecking ? (
              <ActivityIndicator size="small" color="#333" />
            ) : isAvailable ? (
              // 중복확인 완료 (채워진 초록 체크)
              <Image 
                source={require('../../assets/images/circlecheckicon.png')} 
                style={styles.checkIcon}
                resizeMode="contain"
              />
            ) : (
              // 중복확인 전 (빈 회색 체크) - 누르면 확인 실행
              <TouchableOpacity onPress={checkEmailDuplicate}>
                <Ionicons 
                  name="checkmark-circle-outline" 
                  size={28} 
                  color={isFormatValid ? "#333" : "#ccc"} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 1. 형식 에러 */}
        {email.length > 0 && !isFormatValid && (
          <Text style={styles.errorText}>올바른 이메일 형식이 아닙니다.</Text>
        )}
        
        {/* 2. 중복 에러 (서버 400 응답 시) */}
        {duplicateError ? (
          <Text style={styles.errorText}>{duplicateError}</Text>
        ) : null}

        {/* 3. "중복체크를 해주세요" 에러 (다음 버튼 눌렀을 때, 중복 에러 없을 시) */}
        {showCheckError && !isAvailable && isFormatValid && !duplicateError && (
          <Text style={styles.errorText}>이메일 중복체크를 해주세요.</Text>
        )}

        {/* 4. 사용 가능 메시지 */}
        {isAvailable && (
          <Text style={styles.successText}>사용 가능한 이메일입니다.</Text>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.button, !isFormatValid && styles.disabledButton]} 
        onPress={handleNext}
        disabled={!isFormatValid}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 60 },
  content: { marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: { 
    flex: 1,
    fontSize: 18, 
    paddingVertical: 10 
  },
  iconArea: {
    marginLeft: 10,
    justifyContent: 'center',
    width: 30,
    alignItems: 'center',
  },
  checkIcon: {
    width: 28,
    height: 28,
  },
  errorText: { color: 'red', marginTop: 10, fontSize: 14 },
  successText: { color: '#03C75A', marginTop: 10, fontSize: 14 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
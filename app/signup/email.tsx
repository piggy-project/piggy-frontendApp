import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignupData } from '../../components/utils/SignupContext';

import { authApi } from '../../components/utils/api';
import { Typography } from '@/constants/Typography';

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
      // 1. API 호출
      const data = await authApi.checkEmail(email);

      // 2. 응답 처리
      if (data.isAvailable) {
        setIsAvailable(true);
      } else {
        // 200 OK지만 사용 불가능한 경우 (백엔드 로직에 따라)
        setIsAvailable(false);
        setDuplicateError('이미 사용 중인 이메일입니다.');
      }

    } catch (error: any) {
      // 3. 에러 처리
      console.log('Check Email Error:', error);

      // 백엔드가 중복일 때 409 Conflict 처리
      const status = error.response?.status; 

      if (status === 409 || status === 400 || status === 500) { 
        // 500은 아까 보셨던 "GET method not supported" 같은 서버 에러일 때도
        // 일단 '사용 불가'로 처리하거나, 별도 처리를 위해 추가하면 좋습니다.
        setIsAvailable(false);
        setDuplicateError('이미 사용 중인 이메일입니다.');
    } else {
        Alert.alert('오류', error.message || '서버 연결에 실패했습니다.');
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
        <Text style={[styles.title, Typography.Pretendard_B_24]}>이메일을 입력해주세요</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={[styles.input, Typography.Pretendard_M_14]}
            placeholder="이메일을 입력해주세요"
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
              <Ionicons 
                name="checkmark-circle" 
                size={28}
                color="#333" 
              />
            ) : (
              // 중복확인 전 (빈 회색 체크)
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
          <Text style={[styles.errorText, Typography.Pretendard_M_14]}>올바른 이메일 형식이 아닙니다.</Text>
        )}
        
        {/* 2. 중복 에러 (서버 400 응답 시) */}
        {duplicateError ? (
          <Text style={[styles.errorText, Typography.Pretendard_M_14]}>{duplicateError}</Text>
        ) : null}

        {/* 3. "중복체크를 해주세요" 에러 (다음 버튼 눌렀을 때, 중복 에러 없을 시) */}
        {showCheckError && !isAvailable && isFormatValid && !duplicateError && (
          <Text style={[styles.errorText, Typography.Pretendard_M_14]}>이메일 중복체크를 해주세요.</Text>
        )}

        {/* 4. 사용 가능 메시지 */}
        {isAvailable && (
          <Text style={[styles.successText, Typography.Pretendard_M_14]}>사용 가능한 이메일입니다.</Text>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.button, !isFormatValid && styles.disabledButton]} 
        onPress={handleNext}
        disabled={!isFormatValid}
      >
        <Text style={[styles.buttonText, Typography.Pretendard_M_16]}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 60 },
  content: { marginTop: 50 },
  title: { marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: { 
    flex: 1,
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
  errorText: { color: 'red', marginTop: 10 },
  successText: { color: '#03C75A', marginTop: 10 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { color: '#fff' },
});
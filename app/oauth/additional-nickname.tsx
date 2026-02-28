import { authApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AdditionalInfo() {
  const router = useRouter();
  


  // 입력 데이터 상태
  const [nickname, setNickname] = useState('');
  const [birth, setBirth] = useState(''); // YYYYMMDD
  const [phoneNum, setPhoneNum] = useState(''); // 01012345678
  const isFormatValid = nickname.length >= 2 && nickname.length <= 10;
  // UI 상태 관리
  const [isChecking, setIsChecking] = useState(false); // 닉네임 중복 체크 로딩
  const [isAvailable, setIsAvailable] = useState(false); // 닉네임 사용 가능 여부
  const [duplicateError, setDuplicateError] = useState(''); // 중복 에러 메시지
  const [showCheckError, setShowCheckError] = useState(false); // 중복 확인 요청 메시지
  const [loading, setLoading] = useState(false); // 최종 제출 로딩

  // 유효성 검사 로직
  const isNicknameValid = nickname.length >= 2 && nickname.length <= 10;
  const isBirthValid = birth.length === 8;
  const isPhoneValid = phoneNum.length === 11;
  const isAllValid = isAvailable && isBirthValid && isPhoneValid;

  // 입력 핸들러
  const handleNicknameChange = (text: string) => {
    setNickname(text);
    setIsAvailable(false);
    setDuplicateError('');
    setShowCheckError(false);
  };

  // 1. 닉네임 중복 체크 (기존 코드와 동일)
  const checkNicknameDuplicate = async () => {
    if (!isNicknameValid) {
      Alert.alert('알림', '닉네임은 2자 이상 10자 이하로 설정해주세요.');
      return;
    }

    setIsChecking(true);
    setDuplicateError('');
    try {
      const resData = await authApi.checkNickname(nickname);
      if (resData.isAvailable) {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
        setDuplicateError('이미 존재하는 닉네임입니다.');
      }
    } catch (error: any) {
      setIsAvailable(false);
      setDuplicateError('이미 존재하는 닉네임입니다.');
    } finally {
      setIsChecking(false);
    }
  };

  // 2. 최종 정보 업데이트 제출
  const handleSignUp = async () => {
    if (!isAvailable) {
      setShowCheckError(true);
      return;
    }

    setLoading(true);
    try {
      // 생년월일 포맷팅: YYYYMMDD -> YYYY-MM-DD
      const formattedBirth = birth.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      
      const requestBody = {
        nickname: nickname,
        birth: formattedBirth,
        phoneNum: phoneNum.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'), // 010-0000-0000
      };

      // PATCH API 호출 (소셜 로그인 추가 정보 전용)
      await authApi.updateAdditionalInfo(requestBody);

      Alert.alert('환영합니다!', '추가 정보 입력이 완료되었습니다.');
      router.replace('/(tabs)'); // 메인으로 이동
    } catch (error: any) {
      console.error(error);
      Alert.alert('저장 실패', error.message || '정보 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={[styles.loadingText, Typography.Pretendard_M_14]}>정보를 저장하고 있어요...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
          <View style={styles.content}>
            <Text style={[styles.title, Typography.Pretendard_B_24]}>마지막이에요!{'\n'}닉네임을 정해주세요</Text>
            
            <View style={styles.inputContainer}>
              <TextInput 
                style={[styles.input, Typography.Pretendard_M_14]}
                placeholder="닉네임 (2~10자)"
                value={nickname}
                onChangeText={handleNicknameChange}
                maxLength={10}
                autoCapitalize="none"
              />
    
               {/* 우측 체크 아이콘 영역 */}
               <View style={styles.iconArea}>
                {isChecking ? (
                  <ActivityIndicator size="small" color="#333" />
                ) : isAvailable ? (
                  // 중복확인 완료
                  <Ionicons 
                    name="checkmark-circle" 
                    size={28} 
                    color="#333" 
                  />
                ) : (
                  // 중복확인 전
                  <TouchableOpacity onPress={checkNicknameDuplicate}>
                    <Ionicons 
                      name="checkmark-circle-outline" 
                      size={28} 
                      color={isFormatValid ? "#333" : "#ccc"} 
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text style={[styles.helperText, Typography.Pretendard_M_11]}>- 공백없이 12자 이하 입력</Text>
              
    
            {/* 1. 형식 에러 */}
            {nickname.length > 0 && !isFormatValid && (
                <Text style={[styles.errorText, Typography.Pretendard_M_14]}>2자 이상 10자 이하로 입력해주세요.</Text>
            )}
    
            {/* 2. 중복 에러 */}
            {duplicateError ? (
              <Text style={[styles.errorText, Typography.Pretendard_M_14]}>{duplicateError}</Text>
            ) : null}
    
            {/* 3. 체크 요청 에러 */}
            {showCheckError && !isAvailable && isFormatValid && !duplicateError && (
              <Text style={[styles.errorText, Typography.Pretendard_M_14]}>닉네임 중복체크를 해주세요.</Text>
            )}
    
            {/* 4. 사용 가능 메시지 */}
            {isAvailable && (
              <Text style={[styles.successText, Typography.Pretendard_M_14]}>사용 가능한 닉네임입니다.</Text>
            )}
    
          </View>
    
          <TouchableOpacity 
            style={[styles.button, !isFormatValid && styles.disabledButton]} 
            onPress={handleSignUp}
            disabled={!isFormatValid}
          >
            <Text style={[styles.buttonText, Typography.Pretendard_M_16]}>완료</Text>
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
  loadingText: {
    marginTop: 15,
    color: '#666',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  iconArea: {
    marginLeft: 10,
    justifyContent: 'center',
    width: 30,
    alignItems: 'center',
  },
  helperText: { marginTop: 5, color: '#888' },
  errorText: { color: 'red', marginTop: 10 },
  successText: { color: '#03C75A', marginTop: 10, fontSize: 14 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { color: '#fff' },
});
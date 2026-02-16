import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignupData } from '../../components/utils/SignupContext';
import { authApi } from '../../components/utils/api';

export default function SignupNickname() {
  const router = useRouter();
  const { data } = useSignupData();
  
  const [nickname, setNickname] = useState('');
  const [isChecking, setIsChecking] = useState(false); // 로딩 상태
  const [isAvailable, setIsAvailable] = useState(false); // 사용 가능 여부
  const [duplicateError, setDuplicateError] = useState(''); // 중복 에러 메시지
  const [showCheckError, setShowCheckError] = useState(false); // 중복 표시 여부
  const [loading, setLoading] = useState(false); // 가입 요청 로딩

  // 닉네임 유효성 검사 (예: 2자 이상 10자 이하, 특수문자 제외 등)
  const isFormatValid = nickname.length >= 2 && nickname.length <= 10;

  // 입력값 변경 시 상태 초기화
  const handleNicknameChange = (text: string) => {
    setNickname(text);
    setIsAvailable(false);
    setDuplicateError('');
    setShowCheckError(false);
  };

  // 1. 닉네임 중복 체크
  const checkNicknameDuplicate = async () => {
    if (!isFormatValid) {
      Alert.alert('알림', '닉네임은 2자 이상 10자 이하로 설정해주세요.');
      return;
    }

    setIsChecking(true);
    setDuplicateError('');
    setShowCheckError(false);

    try {
      const data = await authApi.checkNickname(nickname);

      if (data.isAvailable) {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
        setDuplicateError('이미 존재하는 닉네임입니다.');
      }
    } catch (error: any) {
      // 400 에러 등이 발생했을 때 처리
      if (error.status === 400 || (error.data && !error.data.isAvailable)) {
        setIsAvailable(false);
        setDuplicateError('이미 존재하는 닉네임입니다.');
      } else {
        Alert.alert('오류', error.message || '서버 연결 실패');
      }
    } finally {
      setIsChecking(false);
    }
  };

  // 2. 최종 회원가입 요청
  const handleSignUp = async () => {
    // 닉네임 확인 절차
    if (!isFormatValid) return;
    
    if (!isAvailable) {
      if (!duplicateError) {
        setShowCheckError(true);
      }
      return;
    }

    setLoading(true);
    try {
      // 생년월일 포맷 변경
      const formattedBirth = data.birth.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

      const requestBody = {
        email: data.email,
        password: data.password,
        checkedPassword: data.password,
        name: data.name,
        nickname: nickname, // 확정된 닉네임
        birth: formattedBirth,
        phoneNum: data.phoneNum,
      };

      console.log('가입 요청:', requestBody);

      const responseData = await authApi.signUp(requestBody);

      router.push('/signup/success');

    } catch (error: any) {
      console.error(error);
      Alert.alert('가입 실패', error.message || '정보를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 가입 처리 중 로딩 화면
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
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder="닉네임 (2~10자)"
            value={nickname}
            onChangeText={handleNicknameChange}
            maxLength={10}
          />

           {/* 우측 체크 아이콘 영역 */}
           <View style={styles.iconArea}>
            {isChecking ? (
              <ActivityIndicator size="small" color="#333" />
            ) : isAvailable ? (
              // 중복확인 완료
              <Image 
                source={require('../../assets/images/circlecheckicon.png')} 
                style={styles.checkIcon}
                resizeMode="contain"
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

        {/* 1. 형식 에러 */}
        {nickname.length > 0 && !isFormatValid && (
            <Text style={styles.errorText}>2자 이상 10자 이하로 입력해주세요.</Text>
        )}

        {/* 2. 중복 에러 */}
        {duplicateError ? (
          <Text style={styles.errorText}>{duplicateError}</Text>
        ) : null}

        {/* 3. 체크 요청 에러 */}
        {showCheckError && !isAvailable && isFormatValid && !duplicateError && (
          <Text style={styles.errorText}>닉네임 중복체크를 해주세요.</Text>
        )}

        {/* 4. 사용 가능 메시지 */}
        {isAvailable && (
          <Text style={styles.successText}>사용 가능한 닉네임입니다.</Text>
        )}

      </View>

      <TouchableOpacity 
        style={[styles.button, !isFormatValid && styles.disabledButton]} 
        onPress={handleSignUp}
        disabled={!isFormatValid}
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
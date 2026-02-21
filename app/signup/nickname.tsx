import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'; // Image 제거
import { useSignupData } from '../../components/utils/SignupContext';
import { authApi } from '../../components/utils/api';
import { Typography } from '@/constants/Typography';

export default function SignupNickname() {
  const router = useRouter();
  const { data, updateData } = useSignupData(); // updateData 추가 (필요시 사용)
  
  const [nickname, setNickname] = useState('');
  const [isChecking, setIsChecking] = useState(false); // 로딩 상태
  const [isAvailable, setIsAvailable] = useState(false); // 사용 가능 여부
  const [duplicateError, setDuplicateError] = useState(''); // 중복 에러 메시지
  const [showCheckError, setShowCheckError] = useState(false); // 중복 표시 여부
  const [loading, setLoading] = useState(false); // 가입 요청 로딩

  // 닉네임 유효성 검사 (2자 이상 10자 이하)
  const isFormatValid = nickname.length >= 2 && nickname.length <= 10;

  // 입력값 변경 시 상태 초기화
  const handleNicknameChange = (text: string) => {
    setNickname(text);
    setIsAvailable(false);
    setDuplicateError('');
    setShowCheckError(false);
  };

  // 1. 닉네임 중복 체크 API 연결
  const checkNicknameDuplicate = async () => {
    if (!isFormatValid) {
      Alert.alert('알림', '닉네임은 2자 이상 10자 이하로 설정해주세요.');
      return;
    }

    setIsChecking(true);
    setDuplicateError('');
    setShowCheckError(false);

    try {
      // API 호출
      const resData = await authApi.checkNickname(nickname);

      // 응답 처리
      if (resData.isAvailable) {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
        setDuplicateError('이미 존재하는 닉네임입니다.');
      }
    } catch (error: any) {
      console.log('Check Nickname Error:', error);
      
      const status = error.response?.status;
      
      // 409(Conflict), 400(Bad Request), 500(서버 에러) 처리
      if (status === 409 || status === 400 || status === 500) {
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
    
    // 중복 체크를 통과하지 못했으면 에러 표시
    if (!isAvailable) {
      if (!duplicateError) {
        setShowCheckError(true);
      }
      return;
    }

    setLoading(true);
    try {
      // 생년월일 포맷 변경 (YYYYMMDD -> YYYY-MM-DD)
      // data.birth가 존재한다고 가정
      const formattedBirth = data.birth 
        ? data.birth.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
        : ''; 

      const requestBody = {
        email: data.email,
        password: data.password,
        checkedPassword: data.password,
        name: data.name,
        nickname: nickname,
        birth: formattedBirth,
        phoneNum: data.phoneNum,
        provider: 'LOCAL',
        providerId: null,
      };

      console.log('가입 요청:', requestBody);

      // 회원가입 API 호출
      await authApi.signUp(requestBody);

      // 성공 시 페이지 이동
      router.push('/signup/success');

    } catch (error: any) {
      console.error(error);
      Alert.alert('가입 실패', error.message || '가입 처리 중 오류가 발생했습니다.');
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
import { authApi } from '@/components/utils/api';
import { useAuth } from '@/components/utils/AuthContext';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AdditionalInfo() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  
  const { birth: prevBirth, phoneNum: prevPhoneNum } = useLocalSearchParams();

  const [nickname, setNickname] = useState('');
  const [birth, setBirth] = useState(prevBirth ? prevBirth.toString() : ''); 
  const [phoneNum, setPhoneNum] = useState(prevPhoneNum ? prevPhoneNum.toString() : '');
  
  const isFormatValid = nickname.length >= 2 && nickname.length <= 10;
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [duplicateError, setDuplicateError] = useState('');
  const [showCheckError, setShowCheckError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    setIsAvailable(false);
    setDuplicateError('');
    setShowCheckError(false);
  };

  const checkNicknameDuplicate = async () => {
    if (!isFormatValid) {
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

  const handleSignUp = async () => {
    if (!isAvailable) {
      setShowCheckError(true);
      return;
    }

    setLoading(true);
    try {
      const formattedBirth = birth.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      
      const requestBody = {
        nickname: nickname,
        birth: formattedBirth,
        phoneNum: phoneNum.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
        // name 필드 제거됨
      };

      await authApi.updateAdditionalInfo(requestBody);

      const updatedUserInfo = await authApi.getMyInfo(); 

      if (setUser) {
        setUser(updatedUserInfo); 
      }

      Alert.alert('환영합니다!', '추가 정보 입력이 완료되었습니다.');
      router.replace('/(tabs)');
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

           <View style={styles.iconArea}>
            {isChecking ? (
              <ActivityIndicator size="small" color="#333" />
            ) : isAvailable ? (
              <Ionicons name="checkmark-circle" size={28} color="#333" />
            ) : (
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
          
        {nickname.length > 0 && !isFormatValid && (
            <Text style={[styles.errorText, Typography.Pretendard_M_14]}>2자 이상 10자 이하로 입력해주세요.</Text>
        )}

        {duplicateError ? (
          <Text style={[styles.errorText, Typography.Pretendard_M_14]}>{duplicateError}</Text>
        ) : null}

        {showCheckError && !isAvailable && isFormatValid && !duplicateError && (
          <Text style={[styles.errorText, Typography.Pretendard_M_14]}>닉네임 중복체크를 해주세요.</Text>
        )}

        {isAvailable && (
          <Text style={[styles.successText, Typography.Pretendard_M_14]}>사용 가능한 닉네임입니다.</Text>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.button, !isAvailable && styles.disabledButton]} 
        onPress={handleSignUp}
        disabled={!isAvailable}
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
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  input: { flex: 1, paddingVertical: 10 },
  loadingText: { marginTop: 15, color: '#666', textAlign: 'center' },
  iconArea: { marginLeft: 10, justifyContent: 'center', width: 30, alignItems: 'center' },
  helperText: { marginTop: 5, color: '#888' },
  errorText: { color: 'red', marginTop: 10 },
  successText: { color: '#03C75A', marginTop: 10, fontSize: 14 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { color: '#fff' },
});
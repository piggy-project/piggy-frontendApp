import { authApi } from '@/components/utils/api';
import { useAuth } from '@/components/utils/AuthContext';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function PasswordResetPage() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { logout } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureMode, setSecureMode] = useState(true);

  const handleResetPassword = async () => {
    if (!token) {
      Alert.alert("오류", "유효하지 않은 접근입니다. 메일의 링크를 다시 확인해주세요.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("알림", "비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
    setLoading(true);
    
    // 1. API 호출 (성공하면 response를 받고, 실패하면 바로 catch로 갑니다)
    await authApi.resetPassword({ 
      token, 
      newPassword 
    });
    await logout();

    // 2. 여기까지 코드가 내려왔다면 성공한 것입니다!
    Alert.alert(
      "성공", 
      "비밀번호가 변경되었습니다. 새로운 비밀번호로 로그인해주세요!", 
      [{ 
        text: "확인", 
        onPress: () => router.replace('/login') // 로그인 페이지로 이동
      }]
    );
    } catch (error: any) {
      await logout();
      const message = error.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      Alert.alert("오류", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView를 써야 키보드가 올라올 때 입력창을 가리지 않아요!
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={[Typography.Pretendard_B_24, styles.title]}>비밀번호 재설정</Text>
          <Text style={[Typography.Pretendard_M_14, styles.subtitle]}>
            새로 사용할 비밀번호를 입력해주세요.
          </Text>

          {/* 새 비밀번호 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>새 비밀번호</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.input}
                placeholder="8자 이상 입력"
                secureTextEntry={secureMode}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setSecureMode(!secureMode)}>
                <Ionicons name={secureMode ? "eye-off" : "eye"} size={20} color="#ADB5BD" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 비밀번호 확인 입력 (여기에 스타일 적용!) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호 확인</Text>
            {/* 아래와 같이 passwordWrapper를 추가해서 테두리가 생기게 합니다 */}
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.input}
                placeholder="비밀번호 다시 입력"
                secureTextEntry={secureMode}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={[Typography.Pretendard_B_16, styles.buttonText]}>변경하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // 스크롤 뷰용 컨테이너 추가
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FDF2F4',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    color: '#FFB7C5',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#868E96',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#495057',
    marginBottom: 8,
    fontWeight: '600',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#212529',
  },
  button: {
    backgroundColor: '#FFB7C5',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#FFD1DC',
  },
  buttonText: {
    color: '#FFF',
  },
});
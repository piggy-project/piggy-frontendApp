import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import LoginHeader from '../Header/LoginHeader';
import { useAuth } from '../utils/AuthContext';
import { styles } from './LoginPage.styles';
import ActionLinks from './component/ActionLinks';
import InputField from './component/InputField';
import LoginButton from './component/LoginButton';
import { Typography } from '@/constants/Typography';

type Props = {
  onBack: () => void;
  onLoginSuccess?: () => void; 
};

export default function LoginPage({ onBack, onLoginSuccess }: Props) {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 5. Context의 login 함수 호출
      await login({ email, password });

      // 6. 성공 시 메인 화면으로 이동
      if (onLoginSuccess) onLoginSuccess(); // 부모 콜백이 있다면 실행
      
      // 'replace'를 써야 뒤로가기 했을 때 로그인 화면으로 다시 안 돌아옴
      // RootLayout에서 설정한 메인 탭 경로 (보통 '(tabs)' 또는 'index')
      router.replace('/(tabs)'); 

    } catch (error: any) {
      console.error('로그인 에러:', error);
      Alert.alert('로그인 실패', error.message || '이메일이나 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LoginHeader onBack={onBack} />
      
      <View style={styles.contentContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View>
              <Text style={[styles.title, Typography.Pretendard_B_24]}>기존 계정으로{'\n'}로그인 해주세요</Text>
              <View style={styles.inputContainer}>
                <InputField
                  placeholder="이메일을 입력해주세요" 
                  value={email}
                  onChangeText={setEmail} 
                />
                <InputField 
                  placeholder="비밀번호를 입력해주세요" 
                  value={password} 
                  onChangeText={setPassword} 
                  secureTextEntry={true} 
                />
              </View>

              <ActionLinks 
                onFindId={() => console.log('아이디 찾기')} 
                onFindPw={() => console.log('비번 찾기')} 
              />
            </View>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.bottomContainer}>
          <LoginButton 
            onPress={handleLogin} 
            disabled={!email || !password || loading} // 로딩 중 클릭 방지
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
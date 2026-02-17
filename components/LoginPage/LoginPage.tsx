import React, { useState } from 'react';
import { 
  Alert, 
  Text, 
  View, 
  KeyboardAvoidingView, // ✅ 추가
  Platform,             // ✅ 추가
  TouchableWithoutFeedback, // ✅ 추가
  Keyboard              // ✅ 추가
} from 'react-native';
import LoginHeader from '../Header/LoginHeader';
import { styles } from './LoginPage.styles';
import ActionLinks from './component/ActionLinks';
import InputField from './component/InputField';
import LoginButton from './component/LoginButton';

import { authApi } from '../utils/api';
import { saveToken } from '../utils/authStore';

type Props = {
  onBack: () => void;
  onLoginSuccess: () => void;
};

export default function LoginPage({ onBack, onLoginSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await authApi.login({ email, password });

      if (data.accessToken) {
        console.log('받은 토큰:', data.accessToken);
        await saveToken(data.accessToken);
        Alert.alert('성공', '로그인 되었습니다!');
        onLoginSuccess();
      } else {
        Alert.alert('오류', '토큰을 받아오지 못했습니다.');
      }

    } catch (error: any) {
      console.error('로그인 에러:', error);
      Alert.alert('로그인 실패', error.message || '이메일이나 비밀번호를 확인해주세요.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // 필요하다면 높이 미세조정
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0} 
    >
      
      {/* 전체 컨테이너 (패딩 적용) */}
      <View style={styles.contentContainer}>
        
        {/* 빈 곳을 누르면 키보드가 내려가는 영역 (상단 ~ 입력창) */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View>
              <LoginHeader onBack={onBack} />
              <Text style={styles.title}>환영합니다</Text>

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

        {/* 터치 간섭 없이 즉시 클릭되어야 하는 영역 (로그인 버튼) */}
        <View style={styles.bottomContainer}>
          <LoginButton 
            onPress={handleLogin} 
            disabled={!email || !password} 
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
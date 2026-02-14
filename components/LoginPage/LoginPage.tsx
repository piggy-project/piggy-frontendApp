import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import LoginHeader from '../Header/LoginHeader';
import { styles } from './LoginPage.styles';
import ActionLinks from './component/ActionLinks';
import InputField from './component/InputField';
import LoginButton from './component/LoginButton';
import SocialLoginButtons from './component/SocialLoginButtons';

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
      // 1. 백엔드로 로그인 요청
      const response = await fetch('http://10.0.2.2:8080/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. 백엔드에서 받은 accessToken 확인
        // 백엔드 LoginResponse DTO에 accessToken 필드가 있으므로 data.accessToken으로 접근
        const token = data.accessToken; 
        
        console.log('받은 토큰:', token);

        // 3. 핸드폰에 토큰 저장 (비동기 처리)
        await saveToken(token);

        // 4. 로그인 성공 처리 (화면 전환)
        Alert.alert('성공', '로그인 되었습니다!');
        onLoginSuccess();
        
      } else {
        Alert.alert('실패', '이메일이나 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '서버 연결 실패');
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 1. 상단 헤더 */}
      <LoginHeader onBack={onBack} />

      {/* 2. 타이틀 */}
      <Text style={styles.title}>환영합니다</Text>

      {/* 3. 입력 폼 */}
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

      {/* 4. 아이디/비번 찾기 */}
      <ActionLinks 
        onFindId={() => console.log('아이디 찾기')} 
        onFindPw={() => console.log('비번 찾기')} 
      />

      {/* 5. 하단 영역 */}
      <View style={styles.bottomContainer}>
        <Text style={styles.socialTitle}>SNS 계정으로 간편하게 로그인</Text>
        <SocialLoginButtons />
        
        <LoginButton 
          onPress={handleLogin} 
          disabled={!email || !password} 
        />
      </View>
    </View>
  );
}
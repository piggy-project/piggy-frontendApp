import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import LoginHeader from '../Header/LoginHeader';
import { styles } from './LoginPage.styles';
import ActionLinks from './component/ActionLinks';
import InputField from './component/InputField';
import LoginButton from './component/LoginButton';
import SocialLoginButtons from './component/SocialLoginButtons';

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
      // 1. authApi를 통해 로그인 요청
      const data = await authApi.login({ email, password });

      // 2. 성공 시 로직
      if (data.accessToken) {
        console.log('받은 토큰:', data.accessToken);

        // 3. 토큰 저장
        await saveToken(data.accessToken);

        // 4. 화면 전환
        Alert.alert('성공', '로그인 되었습니다!');
        onLoginSuccess();
      } else {
        // 성공은 했는데 토큰이 없는 이상한 경우
        Alert.alert('오류', '토큰을 받아오지 못했습니다.');
      }

    } catch (error: any) {
      console.error('로그인 에러:', error);
      
      // 5. 실패 처리
      Alert.alert('로그인 실패', error.message || '이메일이나 비밀번호를 확인해주세요.');
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
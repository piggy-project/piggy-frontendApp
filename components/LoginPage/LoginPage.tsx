import React, { useState } from 'react';
import { View, Text } from 'react-native';
import LoginHeader from '../Header/LoginHeader';
import { styles } from './LoginPage.styles';
import InputField from './component/InputField';
import ActionLinks from './component/ActionLinks';
import LoginButton from './component/LoginButton';
import SocialLoginButtons from './component/SocialLoginButtons';

type Props = {
  onBack: () => void;
  onLoginSuccess: () => void;
};

export default function LoginPage({ onBack, onLoginSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('로그인 시도:', email, password);
    onLoginSuccess();
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
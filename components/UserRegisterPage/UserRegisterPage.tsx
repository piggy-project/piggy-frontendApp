import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

// 단계별 컴포넌트 불러오기
import Step0_Welcome from './steps/Step0_Welcome';
import Step1_Terms from './steps/Step1_Terms';
import Step2_Email from './steps/Step2_Email';
import Step3_Password from './steps/Step3_Password';
import Step4_1_PersonalInfo from './steps/Step4_1_PersonalInfo';
import Step5_Nickname from './steps/Step5_Nickname';
import Step6_Success from './steps/Step6_Success';

type Props = {
  onLoginPress?: () => void;
  onFinish?: () => void;
};

export default function UserRegisterPage({ onLoginPress, onFinish }: Props) {
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  const initialFormData = {
    email: '',
    password: '',
    name: '',       
    birth: '',      
    phoneNum: '',   
    nickname: '',
    termsAgreed: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  // 탭을 나갈 때 상태를 초기화
  useFocusEffect(
    useCallback(() => {
      return () => {
        setStep(0); 
        setFormData(initialFormData); 
        setLoading(false);
      };
    }, [])
  );

  const updateData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const formattedBirth = formData.birth.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

      const requestBody = {
        email: formData.email,
        password: formData.password,
        checkedPassword: formData.password,
        name: formData.name,
        nickname: formData.nickname,
        birth: formattedBirth, 
        phoneNum: formData.phoneNum,
      };

      console.log('회원가입 요청 데이터:', requestBody);

      const response = await fetch('http://10.0.2.2:8080/users/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setStep(6); // 성공 시 Step 6 (성공 화면)으로 이동
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert('회원가입 실패', errorData.message || '입력 정보를 다시 확인해주세요.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '서버와 통신할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    // 로딩 중이면 로딩 표시
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      );
    }

    switch (step) {
      case 0:
        return <Step0_Welcome onNext={nextStep} onLoginPress={onLoginPress} />;
      case 1:
        return <Step1_Terms onNext={nextStep} />;
      case 2:
        return (
          <Step2_Email 
            value={formData.email} 
            onChange={(text) => updateData('email', text)}
            onNext={nextStep} 
          />
        );
      case 3:
        return (
          <Step3_Password 
            value={formData.password}
            onChange={(text) => updateData('password', text)}
            onNext={nextStep}
          />
        );
      
      case 4:
        return (
          <Step4_1_PersonalInfo 
            name={formData.name}
            birth={formData.birth}
            phoneNum={formData.phoneNum}
            onChangeName={(text) => updateData('name', text)}
            onChangeBirth={(text) => updateData('birth', text)}
            onChangePhone={(text) => updateData('phoneNum', text)}
            onNext={nextStep}
          />
        );

      case 5:
        return (
          <Step5_Nickname 
            value={formData.nickname}
            onChange={(text) => updateData('nickname', text)}
            onNext={handleSignUp}
          />
        );

      case 6:
        return <Step6_Success formData={formData} onFinish={onFinish} />; 
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
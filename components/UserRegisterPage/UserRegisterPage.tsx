import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

// 단계별 컴포넌트 불러오기
import Step0_Welcome from './steps/Step0_Welcome';
import Step1_Terms from './steps/Step1_Terms';
import Step2_Email from './steps/Step2_Email';
import Step3_Password from './steps/Step3_Password';
import Step4_Nickname from './steps/Step4_Nickname';
import Step5_Success from './steps/Step5_Success';

type Props = {
  onLoginPress?: () => void; // 로그인 화면으로 전환하는 함수
  onFinish?: () => void;     // 회원가입 완료 후 실행할 함수 (선택사항)
};

export default function UserRegisterPage({ onLoginPress, onFinish }: Props) {
  const [step, setStep] = useState(0); 
  
  const initialFormData = {
    email: '',
    password: '',
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
      };
    }, [])
  );

  const updateData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Step0_Welcome 
            onNext={nextStep} 
            onLoginPress={onLoginPress} 
          />
        );
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
          <Step4_Nickname 
            value={formData.nickname}
            onChange={(text) => updateData('nickname', text)}
            onNext={nextStep}
          />
        );
      case 5:
        return <Step5_Success formData={formData} onFinish={onFinish} />; 
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
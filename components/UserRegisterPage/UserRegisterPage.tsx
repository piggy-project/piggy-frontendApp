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

export default function UserRegisterPage() {
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
        // 화면을 나갈 때(다른 탭 이동 시) 실행되는 정리 함수
        setStep(0); // 단계를 0으로 초기화
        setFormData(initialFormData); // (선택사항) 입력하던 데이터도 초기화하고 싶다면 추가
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
        return <Step0_Welcome onNext={nextStep} />;
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
        return <Step5_Success formData={formData} />; 
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
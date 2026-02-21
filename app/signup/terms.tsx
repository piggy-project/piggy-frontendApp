import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSignupData } from '../../components/utils/SignupContext';
import { Typography } from '@/constants/Typography';

export default function SignupTerms() {
  const router = useRouter();
  const { updateData } = useSignupData();

  const [allAgreed, setAllAgreed] = useState(false);
  const [term1, setTerm1] = useState(false);
  const [term2, setTerm2] = useState(false);

  const toggleAll = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setTerm1(newValue);
    setTerm2(newValue);
  };

  const toggleTerm1 = () => {
    const nextVal = !term1;
    setTerm1(nextVal);
    if (nextVal && term2) setAllAgreed(true);
    else setAllAgreed(false);
  };

  const toggleTerm2 = () => {
    const nextVal = !term2;
    setTerm2(nextVal);
    if (term1 && nextVal) setAllAgreed(true);
    else setAllAgreed(false);
  };

  const handleNext = () => {
    updateData({ termsAgreed: true });
    router.push('/signup/email');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, Typography.Pretendard_B_24]}>서비스 이용약관에{'\n'}동의해주세요</Text>
        
        {/* 전체 동의 */}
        <TouchableOpacity style={styles.checkboxRow} onPress={toggleAll}>
          <View style={[styles.checkbox, allAgreed && styles.checked]}>
            {allAgreed && <Text style={[styles.checkMark, Typography.Pretendard_M_14]}>✓</Text>}
          </View>
          <Text style={Typography.Pretendard_M_14}>모두 동의</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 개별 약관 */}
        <TouchableOpacity style={styles.checkboxRow} onPress={toggleTerm1}>
          <Text style={[styles.checkIcon, term1 && styles.activeText, Typography.Pretendard_M_14]}>✓</Text>
          <Text style={[styles.checkboxLabel, Typography.Pretendard_M_14]}>[필수] 서비스 이용약관 동의</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkboxRow} onPress={toggleTerm2}>
          <Text style={[styles.checkIcon, term2 && styles.activeText, Typography.Pretendard_M_14]}>✓</Text>
          <Text style={[styles.checkboxLabel, Typography.Pretendard_M_14]}>[필수] 개인정보 처리방침 동의</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, (!term1 || !term2) && styles.disabledButton]} 
        onPress={handleNext}
        disabled={!term1 || !term2}
      >
        <Text style={[styles.buttonText, Typography.Pretendard_M_16]}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 60 },
  content: { marginTop: 50 },
  title: { marginBottom: 40 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 24, height: 24, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: '#333', borderColor: '#333' },
  checkMark: { color: '#fff' },
  checkIcon: { color: '#ccc', marginRight: 10 },
  activeText: { color: '#333' },
  checkboxLabel: { color: '#555' },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 20 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { color: '#fff' },
});
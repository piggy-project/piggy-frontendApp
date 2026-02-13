import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  onNext: () => void;
};

export default function Step1_Terms({ onNext }: Props) {
  const [allAgreed, setAllAgreed] = useState(false);
  const [term1, setTerm1] = useState(false);
  const [term2, setTerm2] = useState(false);

  // 전체 동의 토글
  const toggleAll = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setTerm1(newValue);
    setTerm2(newValue);
  };

  // 개별 토글 시 전체 동의 상태 업데이트
  const toggleTerm1 = () => {
    setTerm1(!term1);
    if (!term1 && term2) setAllAgreed(true);
    else setAllAgreed(false);
  };

  const toggleTerm2 = () => {
    setTerm2(!term2);
    if (term1 && !term2) setAllAgreed(true);
    else setAllAgreed(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>서비스 이용약관에{'\n'}동의해주세요</Text>
        
        {/* 전체 동의 */}
        <TouchableOpacity style={styles.checkboxRow} onPress={toggleAll}>
          <View style={[styles.checkbox, allAgreed && styles.checked]}>
            {allAgreed && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabelBold}>모두 동의</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 개별 약관 1 */}
        <TouchableOpacity style={styles.checkboxRow} onPress={toggleTerm1}>
          <Text style={[styles.checkIcon, term1 && styles.activeText]}>✓</Text>
          <Text style={styles.checkboxLabel}>[필수] 서비스 이용약관 동의</Text>
        </TouchableOpacity>

        {/* 개별 약관 2 */}
        <TouchableOpacity style={styles.checkboxRow} onPress={toggleTerm2}>
          <Text style={[styles.checkIcon, term2 && styles.activeText]}>✓</Text>
          <Text style={styles.checkboxLabel}>[필수] 개인정보 처리방침 동의</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, (!term1 || !term2) && styles.disabledButton]} 
        onPress={onNext}
        disabled={!term1 || !term2}
      >
        <Text style={styles.buttonText}>동의하고 가입하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff' },
  content: { marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, lineHeight: 32 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 24, height: 24, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: '#333', borderColor: '#333' },
  checkMark: { color: '#fff', fontSize: 16 },
  checkIcon: { fontSize: 18, color: '#ccc', marginRight: 10 },
  activeText: { color: '#333' },
  checkboxLabelBold: { fontSize: 16, fontWeight: 'bold' },
  checkboxLabel: { fontSize: 16, color: '#555' },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 20 },
  button: { backgroundColor: '#ddd', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#f0f0f0' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#333' },
});
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSignupData } from '../../components/utils/SignupContext';

export default function SignupPersonalInfo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateData } = useSignupData();
  
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [phoneNum, setPhoneNum] = useState('');

  const formatPhoneNumberView = (text: string) => {
    const cleaned = ('' + text).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) return `${match[1]} ${match[2]} ${match[3]}`;
    return cleaned;
  };

  const formatBirthDateView = (text: string) => {
    const cleaned = ('' + text).replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 4)} / ${cleaned.slice(4)}`;
    if (cleaned.length > 6) formatted = `${formatted.slice(0, 9)} / ${formatted.slice(9)}`;
    return formatted;
  };

  const isNameValid = name.length >= 2;
  const isPhoneValid = /^\d{10,11}$/.test(phoneNum); 
  const isBirthValid = /^\d{8}$/.test(birth); 
  const isValid = isNameValid && isPhoneValid && isBirthValid;

  const handleNext = () => {
    updateData({ name, birth, phoneNum });
    router.push('/signup/nickname');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, Typography.Pretendard_B_24]}>기본정보를 입력해주세요</Text>
        
        {/* 이름 */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, Typography.Pretendard_M_14]}>이름</Text>
          <TextInput 
            style={[styles.input, Typography.Pretendard_M_16]} 
            placeholder="성함" 
            value={name} 
            onChangeText={setName} 
          />
        </View>

        {/* 전화번호 */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, Typography.Pretendard_M_14]}>전화번호</Text>
          <TextInput 
            style={[styles.input, Typography.Pretendard_M_16]} 
            placeholder="010 0000 0000" 
            value={formatPhoneNumberView(phoneNum)} 
            onChangeText={(text) => setPhoneNum(text.replace(/\s/g, ''))} // 저장할 땐 공백 제거
            keyboardType="number-pad"
            maxLength={13} 
          />
        </View>

        {/* 생년월일 */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, Typography.Pretendard_M_14]}>생년월일</Text>
          <View style={styles.dateInputContainer}>
            <TextInput 
              style={[styles.dateInput, Typography.Pretendard_M_16]} 
              placeholder="2000 / 00 / 00" 
              value={formatBirthDateView(birth)}
              onChangeText={(text) => setBirth(text.replace(/\D/g, '').slice(0, 8))}
              keyboardType="number-pad" 
              maxLength={14} 
            />
            <Ionicons name="calendar-outline" size={24} color="#ccc" style={styles.icon} />
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.button, 
          !isValid && styles.disabledButton,
          { marginBottom: Math.max(insets.bottom, 20) }
        ]} 
        onPress={handleNext}
        disabled={!isValid}
      >
        <Text style={[styles.buttonText, Typography.Pretendard_M_16]}>다음</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 60 },
  content: { marginTop: 50 },
  title: { marginBottom: 40 },
  inputGroup: { marginBottom: 30 },
  label: { marginBottom: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10 },
  dateInputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  dateInput: { flex: 1, paddingVertical: 10 },
  icon: { marginLeft: 10 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { color: '#fff' },
});
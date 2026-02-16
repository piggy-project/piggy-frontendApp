import { Ionicons } from '@expo/vector-icons'; // 아이콘 추가
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignupData } from '../../components/utils/SignupContext';

export default function SignupPersonalInfo() {
  const router = useRouter();
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
        <Text style={styles.title}>기본정보를 입력해주세요</Text>
        
        {/* 이름 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이름</Text>
          <TextInput 
            style={styles.input} 
            placeholder="성명" 
            value={name} 
            onChangeText={setName} 
          />
        </View>

        {/* 전화번호 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>전화번호</Text>
          <TextInput 
            style={styles.input} 
            placeholder="010 0000 0000" 
            value={formatPhoneNumberView(phoneNum)} 
            onChangeText={(text) => setPhoneNum(text.replace(/\s/g, ''))} // 저장할 땐 공백 제거
            keyboardType="number-pad"
            maxLength={13} 
          />
        </View>

        {/* 생년월일 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>생년월일</Text>
          <View style={styles.dateInputContainer}>
            <TextInput 
              style={styles.dateInput} 
              placeholder="1999 / 01 / 01" 
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
        style={[styles.button, !isValid && styles.disabledButton]} 
        onPress={handleNext}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 60 },
  content: { marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
  inputGroup: { marginBottom: 30 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', fontSize: 16, paddingVertical: 10 },
  dateInputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  dateInput: { flex: 1, fontSize: 16, paddingVertical: 10 },
  icon: { marginLeft: 10 },
  button: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#ddd' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
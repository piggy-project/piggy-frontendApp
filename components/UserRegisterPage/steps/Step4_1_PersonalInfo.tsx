import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  name: string;
  birth: string;
  phoneNum: string;
  onChangeName: (text: string) => void;
  onChangeBirth: (text: string) => void;
  onChangePhone: (text: string) => void;
  onNext: () => void;
};

export default function Step4_1_PersonalInfo({ 
  name, birth, phoneNum, 
  onChangeName, onChangeBirth, onChangePhone, onNext 
}: Props) {
  
  const formatPhoneNumberView = (text: string) => {
    const cleaned = ('' + text).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return cleaned;
  };

  const formatBirthDateView = (text: string) => {
    const cleaned = ('' + text).replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 4)} / ${cleaned.slice(4)}`;
    }
    if (cleaned.length > 6) {
      formatted = `${formatted.slice(0, 9)} / ${formatted.slice(9)}`;
    }
    return formatted;
  };

  // 유효성
  const isNameValid = name.length >= 2;
  const isPhoneValid = /^\d{10,11}$/.test(phoneNum); // 숫자만 10~11자리
  const isBirthValid = /^\d{8}$/.test(birth); // 숫자만 8자리 (YYYYMMDD)

  const isValid = isNameValid && isPhoneValid && isBirthValid;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>기본정보를 입력해주세요</Text>
        
        {/* 1. 이름 입력 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이름</Text>
          <TextInput 
            style={styles.input}
            placeholder="성명"
            value={name}
            onChangeText={onChangeName}
          />
        </View>

        {/* 2. 전화번호 입력 (순서 변경) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>전화번호</Text>
          <TextInput 
            style={styles.input}
            placeholder="010 0000 0000"
            value={formatPhoneNumberView(phoneNum)} // 보여줄 땐 포맷팅 적용
            onChangeText={(text) => onChangePhone(text.replace(/\s/g, ''))} // 저장할 땐 숫자만
            keyboardType="number-pad"
            maxLength={13} // 공백 포함 최대 길이
          />
        </View>

        {/* 3. 생년월일 입력 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>생년월일</Text>
          <View style={styles.dateInputContainer}>
            <TextInput 
              style={styles.dateInput}
              placeholder="2000 / 01 / 01"
              value={formatBirthDateView(birth)} // 보여줄 땐 포맷팅 적용
              // 저장할 땐 숫자만 추출해서 최대 8자리까지만
              onChangeText={(text) => onChangeBirth(text.replace(/\D/g, '').slice(0, 8))}
              keyboardType="number-pad"
              maxLength={14} // "YYYY / MM / DD" 길이
            />
            <Ionicons name="calendar-outline" size={24} color="#ccc" style={styles.icon} />
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, !isValid && styles.disabledButton]} 
        onPress={onNext}
        disabled={!isValid}
      >
        <Text style={[styles.buttonText, !isValid && styles.disabledButtonText]}>다음</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff' },
  content: { marginTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, color: '#000' },
  inputGroup: { marginBottom: 30 },
  label: { fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', fontSize: 16, paddingVertical: 10, color: '#000' },
  // 생년월일 입력창 스타일 (아이콘 포함)
  dateInputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  dateInput: { flex: 1, fontSize: 16, paddingVertical: 10, color: '#000' },
  icon: { marginLeft: 10 },
  
  button: { backgroundColor: '#ddd', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  disabledButton: { backgroundColor: '#f0f0f0' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#000' },
  disabledButtonText: { color: '#aaa' },
});
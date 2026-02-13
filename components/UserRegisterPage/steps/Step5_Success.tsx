import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 필요하다면 부모의 formData를 받아서 "000님 환영합니다" 처럼 쓸 수 있습니다.
type Props = {
  formData: any; 
  onFinish?: () => void; // 메인 화면으로 이동하는 함수 등
};

export default function Step5_Success({ formData, onFinish }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 캐릭터 이미지 들어갈 자리 (임시 원형 뷰) */}
        <View style={styles.circlePlaceholder}>
          <Text style={styles.placeholderText}>캐릭터</Text>
        </View>

        <Text style={styles.title}>가입을 축하합니다!</Text>
        <Text style={styles.subTitle}>똑똑한 여행을 도와드릴게요!</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onFinish}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  circlePlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  placeholderText: { color: '#666' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subTitle: { fontSize: 16, color: '#666' },
  button: { backgroundColor: '#ddd', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#333' },
});
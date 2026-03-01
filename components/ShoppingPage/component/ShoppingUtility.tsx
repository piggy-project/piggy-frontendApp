import OCRScanner from '@/components/utils/OCRScanner';
import { Typography } from '@/constants/Typography';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ShoppingUtility.styles';

export default function ShoppingUtility() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <View style={styles.container}>
      {/* AR 스캐너 버튼 클릭 시 showScanner를 true로 변경 */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setShowScanner(true)}
      >
        <Text style={[styles.buttonText, Typography.Pretendard_M_14]}>AR 스캐너</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={[styles.buttonText, Typography.Pretendard_M_14]}>환전 계산기</Text>
      </TouchableOpacity>

      {/* 모달 형식으로 카메라 화면 띄우기 */}
      <Modal visible={showScanner} animationType="slide">
        <OCRScanner onClose={() => setShowScanner(false)} />
      </Modal>
    </View>
  );
}
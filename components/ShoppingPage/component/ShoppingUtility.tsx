import OCRScanner from '@/components/utils/OCRScanner';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { styles } from './ShoppingUtility.styles';

export default function ShoppingUtility() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <View style={styles.floatingActionContainer} pointerEvents="box-none">
      <Modal visible={showScanner} animationType="slide">
        <OCRScanner onClose={() => setShowScanner(false)} />
      </Modal>

      <TouchableOpacity
        style={styles.floatingCameraButton}
        onPress={() => setShowScanner(true)}
      >
        <Ionicons name="camera" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
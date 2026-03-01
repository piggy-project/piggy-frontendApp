import { shoppingApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 통화별 설정 데이터
const CURRENCIES = [
  { label: '유럽 유로 (EUR)', value: 'EUR', type: 'long' },
  { label: '미국 달러 (USD)', value: 'USD', type: 'long' },
  { label: '일본 엔화 (JPY)', value: 'JPY', type: 'short' },
  { label: '태국 바트 (THB)', value: 'THB', type: 'short' },
  { label: '대만 달러 (TWD)', value: 'TWD', type: 'short' },
  { label: '필리핀 페소 (PHP)', value: 'PHP', type: 'short' },
];

const STORAGE_KEY = '@last_selected_currency';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function OCRScanner({ onClose }: { onClose: () => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[2]);
  const [showPicker, setShowPicker] = useState(false);
  const cameraRef = useRef<any>(null);

  // 1. 초기 로드 시 저장된 통화 불러오기
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const found = CURRENCIES.find(c => c.value === saved);
          if (found) setSelectedCurrency(found);
        }
      } catch (e) {
        console.error("Failed to load currency", e);
      }
    };
    loadCurrency();
  }, []);

  // 2. 통화 변경 시 저장하기
  const changeCurrency = async (currency: typeof CURRENCIES[0]) => {
    setSelectedCurrency(currency);
    setShowPicker(false);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, currency.value);
    } catch (e) {
      console.error("Failed to save currency", e);
    }
  };

  // 3. 가변형 가이드 박스 수치 계산
  const currentGuideWidth = selectedCurrency.type === 'long' ? screenWidth * 0.85 : screenWidth * 0.7;
  const currentGuideHeight = 120;

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', marginBottom: 20 }}>카메라 권한이 필요합니다.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={{ color: '#000' }}>권한 허용하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || loading) return;

    try {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });

      const resizeWidth = 1000;
      const ratio = resizeWidth / screenWidth;

      const cropWidth = currentGuideWidth * ratio;
      const cropHeight = currentGuideHeight * ratio;
      
      const originX = (resizeWidth - cropWidth) / 2;
      const originY = (screenHeight * ratio - cropHeight) / 2;

      const manipulated = await manipulateAsync(
        photo.uri,
        [
          { resize: { width: resizeWidth } },
          {
            crop: {
              originX: originX,
              originY: originY,
              width: cropWidth,
              height: cropHeight,
            }
          }
        ],
        { base64: true, format: SaveFormat.JPEG }
      );

      if (!manipulated.base64) throw new Error("이미지 데이터 생성 실패");

      // API 호출 시 선택된 통화 정보(selectedCurrency.value)를 함께 보낼 수 있습니다.
      const result = await shoppingApi.scanProductPrice(manipulated.base64, selectedCurrency.value);

      if (result && result.statusCode === 200 && result.data) {
        const { originalText, krwAmount, exchangeRate } = result.data;
        Alert.alert(
          "환율 계산 결과",
          `인식된 가격: ${originalText} (${selectedCurrency.value})\n\n` +
          `현재 환율 ${Number(exchangeRate).toFixed(2)}원 기준,\n` +
          `원화 약 ${krwAmount?.toLocaleString()}원입니다!`
        );
      } else {
        Alert.alert("인식 실패", result?.message || "가격표를 찾지 못했습니다.");
      }
    } catch (error) {
      Alert.alert("알림", "가격을 인식하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />

      {/* 오버레이 레이어 */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* 상단 헤더: 닫기 및 통화 선택 */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.currencySelector} onPress={() => setShowPicker(true)}>
            <Text style={styles.currencyText}>{selectedCurrency.label}</Text>
            <Ionicons name="chevron-down" size={18} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* 가변형 가이드 박스 */}
        <View style={[styles.guideBox, { width: currentGuideWidth, height: currentGuideHeight }]} />
        <Text style={[styles.guideText, Typography.Pretendard_M_14]}>
          [{selectedCurrency.value}] 가격표를 사각형 안에 맞춰주세요
        </Text>
      </View>

      {/* 하단 촬영 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleCapture} disabled={loading} style={styles.captureButton}>
          {loading ? (
            <ActivityIndicator color="white" size="large" />
          ) : (
            <Ionicons name="scan-circle" size={80} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {/* 통화 선택 모달 (드롭다운 역할) */}
      <Modal visible={showPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
          <View style={styles.pickerContainer}>
            {CURRENCIES.map((item) => (
              <TouchableOpacity 
                key={item.value} 
                style={styles.pickerItem} 
                onPress={() => changeCurrency(item)}
              >
                <Text style={[
                  styles.pickerItemText, 
                  selectedCurrency.value === item.value && { color: '#FFD700', fontWeight: 'bold' }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  topBar: {
    position: 'absolute',
    top: 50,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currencyText: { color: 'white', marginRight: 5, fontSize: 16, fontWeight: '600' },
  guideBox: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  guideText: { color: '#FFFFFF', marginTop: 20, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10 },
  buttonContainer: { position: 'absolute', bottom: 50, width: '100%', alignItems: 'center' },
  captureButton: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  permissionButton: { backgroundColor: '#fff', padding: 10, borderRadius: 8 },
  
  // 모달 스타일
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  pickerContainer: { width: '80%', backgroundColor: '#222', borderRadius: 15, padding: 10 },
  pickerItem: { paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: '#444', alignItems: 'center' },
  pickerItemText: { color: 'white', fontSize: 18 },
});
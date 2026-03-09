import { shoppingApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 통화별 설정 데이터
const CURRENCIES = [
  { label: '일본 엔화 (JPY)', value: 'JPY', type: 'short' },
  { label: '중국 위안화 (CNY)', value: 'CNY', type: 'short' },
  { label: '미국 달러 (USD)', value: 'USD', type: 'long' },
  { label: '베트남 동 (VND)', value: 'VND', type: 'long' },
  { label: '필리핀 페소 (PHP)', value: 'PHP', type: 'short' },
  { label: '태국 바트 (THB)', value: 'THB', type: 'short' },
  { label: '독일 유로 (EUR)', value: 'EUR', type: 'long' },
  { label: '프랑스 유로 (EUR)', value: 'EUR', type: 'long' },
  { label: '호주 달러 (AUD)', value: 'AUD', type: 'long' },
  { label: '영국 파운드 (GBP)', value: 'GBP', type: 'long' },
];
const STORAGE_KEY = '@last_selected_currency';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function OCRScanner({ onClose }: { onClose: () => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[2]);
  const [showPicker, setShowPicker] = useState(false);
  const cameraRef = useRef<any>(null);

  const [showResultModal, setShowResultModal] = useState(false);
  const [scanResult, setScanResult] = useState<{
    originalText: string;
    krwAmount: number;
    exchangeRate: string;
  } | null>(null);
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
  const currentGuideHeight = 150;

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
        setScanResult({
          originalText,
          krwAmount: krwAmount ?? 0,
          exchangeRate: Number(exchangeRate).toFixed(2),
        });
        setShowResultModal(true);

      } else {
        Alert.alert("인식 실패", result?.message || "가격표를 찾지 못했습니다.");
      }
    } catch (error) {
      Alert.alert("인식 실패", "가격표를 찾지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />

      {/* 오버레이 레이어 */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* 우상단 닫기 버튼 */}
        <TouchableOpacity onPress={onClose} style={styles.headerCloseButton}>
          <Ionicons name="close" size={26} color="#444" />
        </TouchableOpacity>

        {/* 중상단 통화 선택 Pill Bar */}
        <View style={styles.convertBarContainer} pointerEvents="box-none">
          <View style={styles.convertPill}>
            {/* 출발 통화: KRW (사진에 맞춰 static) */}
            <View style={styles.pillDropdown}>
              <Text style={[Typography.Pretendard_M_12, styles.pillText]}>대한민국 원</Text>
            </View>

            {/* 가운데 교환 아이콘: < > (사진 형식) */}
            <View style={styles.pillSeparator}>
              <Text style={styles.separatorText}>{"<>"}</Text>
            </View>

            {/* 도착 통화: 선택된 통화 Dynamic */}
            <TouchableOpacity style={styles.pillDropdown} onPress={() => setShowPicker(true)}>
              {/* 라벨에서 국가명만 추출: '일본 엔화 (JPY)' -> '일본 엔화' */}
              <Text style={[Typography.Pretendard_M_12, styles.pillText]}>
                {selectedCurrency.label.split('(')[0].trim()}
              </Text>
              <Ionicons name="chevron-down" size={12} color="#888" style={{marginLeft: 2}} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.guideText, Typography.Pretendard_M_14]}>
          상품의 가격을 스캔해주세요!
        </Text>
        {/* 가변형 가이드 박스 */}
        <View style={[styles.guideBox, { width: currentGuideWidth, height: currentGuideHeight }]}>
          <View style={styles.crosshair}>
            <View style={styles.crosshairVertical} />
            <View style={styles.crosshairHorizontal} />
          </View>
        </View>

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
                key={item.label}
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
      {/* 2. 새로운 사용자 지정 결과 모달 추가 */}
      <Modal visible={showResultModal} transparent animationType="slide">
        <View style={styles.resultModalOverlay}>
          <View style={styles.resultModalContent}>
            {/* 회색 상단 헤더 섹션 */}
            <View style={styles.resultModalHeader}>
              <Text style={[Typography.Pretendard_M_14, styles.headerText]}>
                인식된 가격 : {scanResult?.originalText} ({selectedCurrency.value})
              </Text>
              <Text style={[Typography.Pretendard_M_14, styles.headerText, { marginTop: 4 }]}>
                현재 환율 {scanResult?.exchangeRate} (원) 기준
              </Text>
            </View>

            {/* 본문 섹션: 큰 결과 숫자 */}
            <View style={styles.resultModalBody}>
              <Text style={[Typography.Pretendard_B_32, styles.resultText]}>
                {scanResult?.krwAmount?.toLocaleString()} (원)
              </Text>
            </View>

            {/* 분홍색 확인 버튼 */}
            <TouchableOpacity 
              style={styles.checkButton} 
              onPress={() => setShowResultModal(false)}
            >
              <Text style={[Typography.Pretendard_B_16, styles.checkButtonText]}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  
  headerCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 20,
    zIndex: 10,
    padding: 5,
  },
  convertBarContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    pointerEvents: 'box-none',
    zIndex: 9,
  },
  convertPill: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  pillDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  pillText: {
    color: '#333',
  },
  pillSeparator: {
    backgroundColor: '#F7F7F7',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginHorizontal: 10,
  },
  separatorText: {
    color: '#999',
    fontSize: 14,
    fontWeight: 'bold',
  },

  guideBox: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  crosshair: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairVertical: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  guideText: {
    position: 'absolute',
    top: (screenHeight / 2) - 75 - 50,
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%', 
    paddingHorizontal: 10,
  },
  buttonContainer: { position: 'absolute', bottom: 50, width: '100%', alignItems: 'center' },
  captureButton: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  permissionButton: { backgroundColor: '#fff', padding: 10, borderRadius: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  pickerContainer: { width: '80%', backgroundColor: '#222', borderRadius: 15, padding: 10 },
  pickerItem: { paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: '#444', alignItems: 'center' },
  pickerItemText: { color: 'white', fontSize: 18 },

  resultModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultModalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  resultModalHeader: {
    paddingTop: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  headerText: {
    color: '#333',
    textAlign: 'center',
  },
  resultModalBody: {
    paddingVertical: 10, // 결과 숫자 주변 여백
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    color: '#000',
    textAlign: 'center',
  },
  checkButton: {
    backgroundColor: '#ffb7c5',
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 15,
    marginHorizontal: 15, // 버튼 옆 여백
    marginBottom: 15, // 버튼 아래 여백
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonText: {
    color: 'white',
  },
});
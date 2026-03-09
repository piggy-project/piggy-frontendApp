import { exchangeApi, shoppingApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './OCRScanner.styles';

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

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [currentRate, setCurrentRate] = useState<number>(0);

  const [showResultModal, setShowResultModal] = useState(false);
  const [scanResult, setScanResult] = useState<{
    originalText: string;
    krwAmount: number;
    exchangeRate: string;
  } | null>(null);

  const fetchRate = async (currencyCode: string) => {
    try {
      const response = await exchangeApi.getExchangeDetail(currencyCode);
      if (response && response.currentRate) {
        setCurrentRate(response.currentRate);
      } else if (response && response.data?.currentRate) {
        setCurrentRate(response.data.currentRate);
      }
    } catch (error) {
      console.error("환율 로드 실패:", error);
    }
  };

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

  // 통화가 바뀔 때마다 환율을 미리 받아둡니다.
  useEffect(() => {
    fetchRate(selectedCurrency.value);
  }, [selectedCurrency]);

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

  // 앨범에서 사진 선택 및 분석 함수
  const handlePickImage = async () => {
    // 1. 갤러리 접근 권한 확인
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('알림', '갤러리 접근 권한이 필요합니다.');
      return;
    }

    // 2. 이미지 선택 (편집 허용하여 부분 선택 가능하게 설정)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true, //사진의 일부분만 선택(크롭) 가능하게 함
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      try {
        setLoading(true);

        // 3. 서버로 OCR 분석 요청 (카메라 촬영과 동일한 API 사용)
        const response = await shoppingApi.scanProductPrice(
          result.assets[0].base64,
          selectedCurrency.value
        );

        if (response && response.statusCode === 200 && response.data) {
          const { originalText, krwAmount, exchangeRate } = response.data;

          // 4. 엔화/동화 등 100단위 통화 정밀 재계산 (기존 로직 활용)
          let finalKrw = krwAmount;
          const numericValue = parseFloat(originalText.replace(/[^0-9.]/g, '')) || 0;

          if (selectedCurrency.value === 'JPY' || selectedCurrency.value === 'VND') {
            finalKrw = (numericValue / 100) * parseFloat(exchangeRate);
          } else {
            finalKrw = numericValue * parseFloat(exchangeRate);
          }

          setScanResult({
            originalText,
            krwAmount: Math.floor(finalKrw),
            exchangeRate: Number(exchangeRate).toFixed(2),
          });
          setShowResultModal(true);
        } else {
          Alert.alert("인식 실패", "이미지에서 가격을 찾지 못했습니다.");
        }
      } catch (error) {
        Alert.alert("오류", "이미지를 분석하는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
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

        let finalKrw = krwAmount;
        const numericValue = parseFloat(originalText.replace(/[^0-9.]/g, '')) || 0;

        if (selectedCurrency.value === 'JPY' || selectedCurrency.value === 'VND') {
          finalKrw = (numericValue / 100) * parseFloat(exchangeRate);
        } else {
          finalKrw = numericValue * parseFloat(exchangeRate);
        }

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

  const getCalculatedAmount = (input: string, rate: number, currencyCode: string) => {
    const amount = parseFloat(input) || 0;
    if (currencyCode === 'JPY' || currencyCode === 'VND') {
      return (amount / 100) * rate;
    }
    return amount * rate;
  };
  // 실시간 계산 결과 (입력값 * 환율)
  const calculatedKrw = getCalculatedAmount(manualInput, currentRate, selectedCurrency.value);

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />

      {/* 오버레이 레이어 */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* 우상단 닫기 버튼 */}
        <TouchableOpacity onPress={onClose} style={styles.headerCloseButton}>
          <Ionicons name="close" size={26} color="#FFF" />
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
              <Text style={styles.separatorText}>{"->"}</Text>
            </View>

            {/* 도착 통화: 선택된 통화 Dynamic */}
            <TouchableOpacity style={styles.pillDropdown} onPress={() => setShowPicker(true)}>
              {/* 라벨에서 국가명만 추출: '일본 엔화 (JPY)' -> '일본 엔화' */}
              <Text style={[Typography.Pretendard_M_12, styles.pillText]}>
                {selectedCurrency.label.split('(')[0].trim()}
              </Text>
              <Ionicons name="chevron-down" size={12} color="#888" style={{ marginLeft: 2 }} />
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

      {/* 하단 버튼 영역 */}
      <View style={styles.buttonContainer}>
        {/* 왼쪽: 갤러리 버튼 (대칭을 위해 추가) */}
        <TouchableOpacity
          style={styles.sideButton}
          onPress={handlePickImage}
          disabled={loading}
        >
          <Ionicons name="image" size={26} color="#555" />
        </TouchableOpacity>

        {/* 중앙: 촬영 버튼 */}
        <TouchableOpacity onPress={handleCapture} disabled={loading} style={styles.captureButton}>
          {loading ? (
            <ActivityIndicator color="white" size="large" />
          ) : (
            <Ionicons name="scan-circle" size={80} color="#FFB7C5" />
          )}
        </TouchableOpacity>

        {/* 오른쪽: 수동 입력 'A' 버튼 */}
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => setShowManualModal(true)}
        >
          <Text style={[Typography.Pretendard_B_24, { color: '#444' }]}>A</Text>
        </TouchableOpacity>
      </View>
      {/* 수동 입력 계산기 모달 */}
      <Modal visible={showManualModal} transparent animationType="fade">
        <View style={styles.resultModalOverlay}>
          <View style={styles.manualModalContent}>
            <Text style={[Typography.Pretendard_B_16, styles.manualTitle]}>
              환전할 금액을 직접 입력해주세요!
            </Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={[Typography.Pretendard_B_32, styles.manualInput]}
                placeholder="0"
                keyboardType="numeric"
                value={manualInput}
                onChangeText={setManualInput}
                autoFocus
              />
              <View>
                <Text style={styles.currencySuffix}>{selectedCurrency.value}</Text>
                {(selectedCurrency.value === 'JPY' || selectedCurrency.value === 'VND') && (
                  <Text style={{ fontSize: 10, color: '#FFB7C5' }}>per 100</Text>
                )}
              </View>
            </View>

            <View style={styles.manualDivider} />

            <View style={styles.manualResultContainer}>
              <Text style={[Typography.Pretendard_B_24, styles.resultText]}>
                {Math.floor(calculatedKrw).toLocaleString()} (원)
              </Text>
            </View>
            <TouchableOpacity
              style={styles.manualCheckButton}
              onPress={() => {
                setShowManualModal(false);
                setManualInput('');
              }}
            >
              <Text style={[Typography.Pretendard_B_16, styles.checkButtonText]}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 통화 선택 모달 */}
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


import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function OCRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  // 1. 카메라 권한 체크
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', marginBottom: 20 }}>카메라 권한이 필요합니다.</Text>
        <TouchableOpacity 
          onPress={requestPermission}
          style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8 }}
        >
          <Text style={{ color: '#000' }}>권한 허용하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. 사진 촬영 및 백엔드 전송 함수
  const handleCapture = async () => {
    if (!cameraRef.current || loading) return;

    try {
      setLoading(true);

      // (1) 사진 촬영
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
      });

      // (2) 이미지 리사이징 및 Base64 변환
      const manipulated = await manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { base64: true, format: SaveFormat.JPEG }
      );

      // (3) 본인 백엔드 프록시 서버 호출
      const response = await fetch('https://your-backend-api.com/api/v1/ocr/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: manipulated.base64,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "환율 변환 결과",
          `인식된 가격: ${result.originalText}\n한국 돈: 약 ${result.krw?.toLocaleString()}원`
        );
      } else {
        throw new Error(result.message || "인식 실패");
      }
    } catch (error) {
      Alert.alert("에러", "가격을 인식하는 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} ref={cameraRef}>
        {/* 가이드 라인 오버레이 */}
        <View style={styles.overlay}>
          <View style={styles.guideBox} />
          <Text style={[styles.guideText, Typography.Pretendard_M_14]}>
            사각형 안에 가격표를 맞춰주세요
          </Text>
        </View>

        {/* 촬영 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={handleCapture} 
            disabled={loading}
            style={styles.captureButton}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons name="scan-circle" size={80} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

// 스타일 시트 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideBox: {
    width: width * 0.7,
    height: 120,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  guideText: {
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
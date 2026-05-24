import { CURRENCY_INFO_MAP, getCurrencyApiCode } from '@/constants/Currency';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import ExchangeGraph from '../../ExchangeDetailPage/component/ExchangeGraph';
import { styles } from './BottomInfoContainer.styles';

const screenWidth = Dimensions.get('window').width;

interface BottomInfoContainerProps {
  data: any;
  isLoading?: boolean;
  displayCode?: string;
}

export default function BottomInfoContainer({ data, isLoading, displayCode }: BottomInfoContainerProps) {

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!data) return null;

  const visualCode = displayCode || data.displayCode || data.code;
  const apiCode = getCurrencyApiCode(visualCode);
  const currentCurrency = CURRENCY_INFO_MAP[visualCode];
  const FlagIcon = currentCurrency?.FlagIcon;
  const countryName = currentCurrency?.label || '알 수 없음';

  const handleGoToDetail = () => {
    const target = {
      name: countryName,
      code: apiCode,
      displayCode: visualCode,
    };

    router.push({
      pathname: '/exchange_detail',
      params: { ...target }
    });
  };

  const handleGoToChatbot = () => {
    router.push('/chatbot');
  };

  return (
    <View style={styles.container}>

      {/* 1. 실시간 환율 정보 바 */}
      <View style={styles.rateInfoBar}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={[styles.rateText, Typography.Pretendard_B_24]}>{data.currentRate}</Text>
          <Text style={[Typography.Pretendard_M_16, { marginLeft: 4, color: '#333' }]}>₩</Text>
        </View>

        <View style={styles.countryInfo}>
          <Text style={[styles.countryName, Typography.Pretendard_M_14]}>{countryName}</Text>
          <View style={styles.flagIcon}>
            {FlagIcon && <FlagIcon width={30} height={30} />}
          </View>
        </View>
      </View>

      {/* 변동률 표시 */}
      <View style={{ paddingHorizontal: 10, marginTop: -10, marginBottom: 10 }}>
        <Text style={[Typography.Pretendard_M_12, { color: (data.change || 0) >= 0 ? '#E53935' : '#1E88E5' }]}>
          어제보다 {Math.abs(data.change || 0)}원 ({data.percentChange || 0}%) {(data.change || 0) >= 0 ? '▲' : '▼'}
        </Text>
      </View>

      {/* 2. 환율 그래프 영역 */}
      <View style={styles.graphArea}>
        <ExchangeGraph
          code={apiCode}
          height={160}
          width={screenWidth - 45}
        />
      </View>

      {/* 3. 하단 상세 보기 버튼 */}
      <TouchableOpacity
        style={{ alignSelf: 'center', marginVertical: 10 }}
        onPress={handleGoToDetail}
      >
        <Text style={[Typography.Pretendard_M_14, { color: '#888', textDecorationLine: 'underline' }]}>
          상세 정보 보러가기
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.chatbotButton}
        activeOpacity={0.85}
        onPress={handleGoToChatbot}
      >
        <View style={styles.chatbotButtonLeft}>
          <Image
            source={require('@/assets/images/piggysplash.png')}
            style={styles.chatbotButtonImage}
          />
          <Text style={[styles.chatbotButtonText, Typography.Pretendard_B_16]}>
            AI 챗봇 피기에게 물어보기
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#111" />
      </TouchableOpacity>

    </View>
  );
}

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
  const countryName = currentCurrency?.label || '알 수 없음';
  const change = Number(data.change || 0);
  const changeColor = change >= 0 ? '#FF3B57' : '#1E88E5';

  const handleGoToDetail = () => {
    router.push({
      pathname: '/exchange_detail',
      params: {
        name: countryName,
        code: apiCode,
        displayCode: visualCode,
      },
    });
  };

  const handleGoToChatbot = () => {
    router.push('/chatbot');
  };

  return (
    <View style={styles.container}>
      <View style={styles.rateInfoCard}>
        <View style={styles.rateInfoLeft}>
          <View style={styles.rateIconCircle}>
            <Text style={[styles.rateIconText, Typography.Pretendard_B_16]}>₩</Text>
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={[styles.rateText, Typography.Pretendard_B_16]}>{data.currentRate}</Text>
              <Text style={[Typography.Pretendard_M_12, { marginLeft: 2, color: '#333' }]}></Text>
            </View>
            <Text style={[styles.changeText, Typography.Pretendard_M_11, { color: changeColor }]}>
              {`${change >= 0 ? '+' : '-'}${Math.abs(change)}원 (${data.percentChange || 0}%)`}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.exchangeRecordButton} activeOpacity={0.8}>
          <Text style={[styles.exchangeRecordText, Typography.Pretendard_M_12]}>내 환전 기록</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.graphArea}>
        <ExchangeGraph
          code={apiCode}
          height={160}
          width={screenWidth - 45}
        />
      </View>

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
            source={require('@/assets/images/piggychatbot.png')}
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

import { exchangeApi } from '@/components/utils/api';
import { getAccessToken } from '@/components/utils/authStore';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './TodayPriceCard.styles';

interface TodayPriceCardProps {
  currencyCode: string;
  currentRate?: number;
  change?: number;
  percentChange?: number;
  initialFavorited?: boolean;
}

export default function TodayPriceCard({
  currencyCode,
  currentRate,
  change,
  percentChange,
  initialFavorited = false,
}: TodayPriceCardProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setFavorited(initialFavorited);
  }, [initialFavorited]);

  const isRise = (change ?? 0) >= 0;
  const changeColor = isRise ? '#FF3B30' : '#007AFF';
  const sign = isRise ? '+' : '';
  const hasChange = change !== undefined && percentChange !== undefined;

  const formatRate = (value?: number, maximumFractionDigits?: number) => {
    if (value === undefined || Number.isNaN(value)) return '-';

    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: maximumFractionDigits ?? (value >= 100 ? 2 : 4),
    });
  };

  const handleFavoritePress = async () => {
    const token = await getAccessToken();

    if (!token) {
      Alert.alert(
        '알림',
        '로그인이 필요한 서비스입니다.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '로그인하러 가기',
            onPress: () => router.push('/login')
          }
        ]
      );
      return;
    }

    try {
      setIsPending(true);
      const result = await exchangeApi.toggleFavorite(currencyCode);
      setFavorited(result.favorited);
    } catch (error: any) {
      Alert.alert('오류', error.response?.data?.message || '즐겨찾기 처리 중 오류가 발생했습니다.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.priceRow}>
        <Text style={[Typography.Pretendard_B_16, styles.currentRate]} numberOfLines={1}>
          {formatRate(currentRate)}원
        </Text>
        <Text style={[Typography.Pretendard_M_11, styles.changeText, { color: changeColor }]} numberOfLines={1}>
          {hasChange ? `${sign}${formatRate(change)}원 (${sign}${formatRate(percentChange, 2)}%)` : '-'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.heartButton}
        activeOpacity={0.7}
        onPress={handleFavoritePress}
        disabled={isPending}
      >
        <Ionicons
          name={favorited ? 'heart' : 'heart-outline'}
          size={22}
          color={favorited ? '#FF8FA3' : '#FFB7C5'}
        />
      </TouchableOpacity>
    </View>
  );
}

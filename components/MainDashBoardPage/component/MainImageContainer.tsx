import { exchangeApi, notificationApi } from '@/components/utils/api';
import { getCurrencyApiCode } from '@/constants/Currency';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, GestureResponderEvent, ImageBackground, LayoutChangeEvent, PanResponder, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './MainImageContainer.styles';

interface MainImageContainerProps {
  timing?: number;
  currentRate?: number | string;
  currencyCode?: string;
}

const piggyImages = {
  level1: require('@/assets/images/piggy0-20.png'),
  level2: require('@/assets/images/piggy20-40.png'),
  level3: require('@/assets/images/piggy40-60.png'),
  level4: require('@/assets/images/piggy60-80.png'),
  level5: require('@/assets/images/piggy80-100.png'),
};

const getPiggyStatus = (timing: number) => {
  if (timing > 80) return { img: piggyImages.level5, text: ['지금이 당장 환전할', '최고의 타이밍이에요!'] };
  if (timing > 60) return { img: piggyImages.level4, text: ['환율이 꽤 저렴해요!', '환전하기 좋은 날이에요.'] };
  if (timing > 40) return { img: piggyImages.level3, text: ['무난한 환율이에요.', '조금 더 기다려볼까요?'] };
  if (timing > 20) return { img: piggyImages.level2, text: ['지금은 조금 비싸네요.', '급하지 않다면 참아봐요.'] };
  return { img: piggyImages.level1, text: ['환율이 너무 올랐어요!', '나중에 다시 확인해요.'] };
};

const parseRate = (value?: number | string) => {
  if (typeof value === 'number') return value;
  const parsed = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatRate = (value: number) => {
  if (!value) return '0.0000';
  return value >= 100 ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value.toFixed(4);
};

export default function MainImageContainer({ timing, currentRate, currencyCode = 'JPY' }: MainImageContainerProps) {
  const { img, text } = getPiggyStatus(timing ?? 50);
  const rate = parseRate(currentRate);
  const minRate = useMemo(() => rate ? rate * 0.94 : 0, [rate]);
  const maxRate = useMemo(() => rate ? rate * 1.06 : 1, [rate]);
  const storageKey = `DASHBOARD_RECORDED_RATE_${currencyCode}`;
  const apiCurrencyCode = getCurrencyApiCode(currencyCode);
  const trackRef = useRef<View>(null);
  const trackLeftRef = useRef(0);
  const trackWidthRef = useRef(0);
  const latestRateRef = useRef(rate);
  const [barWidth, setBarWidth] = useState(0);
  const [recordedRate, setRecordedRate] = useState(rate);

  useEffect(() => {
    latestRateRef.current = recordedRate;
  }, [recordedRate]);

  useEffect(() => {
    let isMounted = true;

    const loadRecordedRate = async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        const parsed = parseRate(saved || rate);
        if (isMounted) {
          const nextRate = parsed || rate;
          latestRateRef.current = nextRate;
          setRecordedRate(nextRate);
        }
      } catch (error) {
        console.error('기록 환율 로딩 실패:', error);
        if (isMounted) {
          latestRateRef.current = rate;
          setRecordedRate(rate);
        }
      }
    };

    loadRecordedRate();

    return () => {
      isMounted = false;
    };
  }, [rate, storageKey]);

  const recordedPercent = useMemo(() => {
    if (!rate) return 50;
    const nextPercent = ((recordedRate - minRate) / (maxRate - minRate)) * 100;
    return Math.min(100, Math.max(0, nextPercent));
  }, [maxRate, minRate, rate, recordedRate]);

  const measureTrack = () => {
    requestAnimationFrame(() => {
      trackRef.current?.measureInWindow((x, _y, width) => {
        trackLeftRef.current = x;
        trackWidthRef.current = width;
        setBarWidth(width);
      });
    });
  };

  const handleBarLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidthRef.current = width;
    setBarWidth(width);
    measureTrack();
  };

  const calculateRateFromRatio = (ratio: number) => {
    return minRate + (maxRate - minRate) * Math.min(1, Math.max(0, ratio));
  };

  const updateRecordedRateByLocation = (locationX: number) => {
    const width = trackWidthRef.current || barWidth;
    if (!width || !rate) return;

    const nextRate = calculateRateFromRatio(locationX / width);
    latestRateRef.current = nextRate;
    setRecordedRate(nextRate);
  };

  const updateRecordedRateByPageX = (pageX: number) => {
    const width = trackWidthRef.current || barWidth;
    if (!width || !rate) return;

    const nextRate = calculateRateFromRatio((pageX - trackLeftRef.current) / width);
    latestRateRef.current = nextRate;
    setRecordedRate(nextRate);
  };

  const persistRecordedRate = async () => {
    try {
      await AsyncStorage.setItem(storageKey, String(latestRateRef.current));
    } catch (error) {
      console.error('기록 환율 저장 실패:', error);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event: GestureResponderEvent) => {
      measureTrack();
      updateRecordedRateByLocation(event.nativeEvent.locationX);
    },
    onPanResponderMove: (_event, gestureState) => {
      updateRecordedRateByPageX(gestureState.moveX);
    },
    onPanResponderRelease: persistRecordedRate,
    onPanResponderTerminate: persistRecordedRate,
  });

  const saveTargetPrice = () => {
    return notificationApi.updateTargetPrice({
      currencyCode: apiCurrencyCode,
      targetPrice: Number(recordedRate.toFixed(4)),
      direction: recordedRate <= rate ? 'BELOW' : 'ABOVE',
      isActive: true,
    });
  };

  const showLoginRequiredAlert = () => {
    Alert.alert(
      '알림',
      '로그인이 필요한 서비스입니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '로그인하러 가기', onPress: () => router.push('/login') },
      ]
    );
  };

  const handleSaveTargetPrice = async () => {
    if (!recordedRate || !rate) return;

    try {
      await saveTargetPrice();
      Alert.alert('알림', `₩${formatRate(recordedRate)} 목표 환율 알림을 설정했어요.`);
    } catch (error: any) {
      console.error('목표 환율 알림 설정 실패:', error.response?.data || error.message);

      if (error.response?.status === 401 || error.response?.status === 403) {
        showLoginRequiredAlert();
        return;
      }

      if (
        error.response?.status === 400 &&
        String(error.response?.data?.message || '').includes('즐겨찾기')
      ) {
        Alert.alert(
          '알림',
          '목표 환율 알림은 즐겨찾기에 등록된 통화만 설정할 수 있어요. 이 통화를 즐겨찾기에 추가하고 알림을 설정할까요?',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '설정하기',
              onPress: async () => {
                try {
                  const favoriteResult = await exchangeApi.toggleFavorite(apiCurrencyCode);

                  if (!favoriteResult?.favorited) {
                    Alert.alert('알림', '즐겨찾기 등록 후 다시 시도해주세요.');
                    return;
                  }

                  await saveTargetPrice();
                  Alert.alert('알림', `₩${formatRate(recordedRate)} 목표 환율 알림을 설정했어요.`);
                } catch (favoriteError: any) {
                  console.error('즐겨찾기 등록 후 목표가 알림 설정 실패:', favoriteError.response?.data || favoriteError.message);

                  if (favoriteError.response?.status === 401 || favoriteError.response?.status === 403) {
                    showLoginRequiredAlert();
                    return;
                  }

                  Alert.alert('오류', '즐겨찾기 등록 또는 알림 설정 중 문제가 발생했습니다.');
                }
              },
            },
          ]
        );
        return;
      }

      Alert.alert('오류', '목표 환율 알림 설정 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={img} style={styles.background} resizeMode="cover" imageStyle={{}}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, Typography.Pretendard_B_24]}>{text[0]}</Text>
          <Text style={[styles.title, Typography.Pretendard_B_24]}>{text[1]}</Text>
          <Text style={[styles.titletext, Typography.Pretendard_M_11]}>최근 3개월 기준으로 계산된 값이에요.</Text>
        </View>

        <View style={styles.rateRecorder}>
          <TouchableOpacity
            style={[styles.rateBubble, { left: `${recordedPercent}%` }]}
            activeOpacity={0.85}
            onPress={handleSaveTargetPrice}
          >
            <Text style={[styles.rateBubbleText, Typography.Pretendard_M_12]}>
              ₩{formatRate(recordedRate)}
            </Text>
            <Ionicons name="pencil" size={11} color="#555" style={styles.rateBubbleIcon} />
            <View style={styles.rateBubbleTail} />
          </TouchableOpacity>

          <View
            ref={trackRef}
            style={styles.rateBarTrack}
            onLayout={handleBarLayout}
            {...panResponder.panHandlers}
          >
            <View style={[styles.rateBarFill, { width: `${recordedPercent}%` }]} />
            <View style={[styles.rateBarThumb, { left: `${recordedPercent}%` }]} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

import { exchangeApi } from '@/components/utils/api';
import { DETAILED_FLAG_MAP, FLAG_MAP } from '@/constants/Currency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import ExchangeHeader from '../Header/ExchangeHeader';
import ShowCountry from './component/ShowCountry';
import TodayTravelDestination from './component/TodayTravelDestination';
import { styles } from './Exchange.styles';

const CACHE_KEY = 'EXCHANGE_DATA_CACHE';
const TIME_KEY = 'EXCHANGE_TIME_CACHE';

export interface CountryData {
  id: string;
  name: string;
  code: string;
  rate: string;
  percentChange: number;
  flag: string;
  time?: string;
}

const getDisplayName = (code: string, fallbackName: string) => {
  return DETAILED_FLAG_MAP[code]?.name || fallbackName.replace(/\s+\S+$/, '');
};

export default function ExchangePage() {
  const router = useRouter();
  const [exchangeData, setExchangeData] = useState<CountryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState('');
  const [currentSort, setCurrentSort] = useState('RISE');
  const currentSortRef = useRef(currentSort);

  useEffect(() => {
    currentSortRef.current = currentSort;
  }, [currentSort]);

  const formatData = (rawData: any[]): CountryData[] => {
    return rawData.map((item: any) => ({
      id: item.curUnit,
      name: getDisplayName(item.curUnit, item.curNm),
      code: item.curUnit,
      rate: `${item.rate?.toLocaleString(undefined, { minimumFractionDigits: 2 })} KRW`,
      percentChange: item.percentChange || 0,
      flag: FLAG_MAP[item.curUnit] || '🏳️',
      time: item.time,
    }));
  };

  const normalizeCachedData = (cachedData: CountryData[]): CountryData[] => {
    return cachedData.map((item) => ({
      ...item,
      name: getDisplayName(item.code, item.name),
    }));
  };

  // 데이터를 서버에서 가져오고 캐시에 저장하는 함수
  const fetchAndCacheData = async (sort: string, isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      const response = await exchangeApi.getExchangeRanking(sort);
      const rawData = response.data || response;
      if (Array.isArray(rawData)) {
        const formatted = formatData(rawData);
        const serverTime = rawData[0].time || '';

        // 상태 업데이트
        setExchangeData(formatted);
        setUpdateTime(formatTimeForDisplay(serverTime));

        // 창고(AsyncStorage)에 데이터 백업
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(formatted));
        await AsyncStorage.setItem(TIME_KEY, formatTimeForDisplay(serverTime));
      }
    } catch (error) {
      console.error('데이터 로드 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 시 랭킹 API 호출 함수
  const handleFilterChange = (sort: string) => {
    setCurrentSort(sort);
    fetchAndCacheData(sort);
  };

  const silentFetchExchangeRates = async () => {
    try {
      const response = await exchangeApi.getExchangeRanking(currentSortRef.current);
      const rawData = response.data || response;

      if (Array.isArray(rawData) && rawData.length > 0) {
        const formatted = formatData(rawData);
        const serverTime = rawData[0].time || '';

        setExchangeData(formatted);
        setUpdateTime(formatTimeForDisplay(serverTime));

        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(formatted));
        await AsyncStorage.setItem(TIME_KEY, formatTimeForDisplay(String(serverTime)));
      }
    } catch (e) {
      console.log("Silent update failed", e);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        // 1. 창고에서 기존 데이터 먼저 꺼내기
        const [cachedData, cachedTime] = await Promise.all([
          AsyncStorage.getItem(CACHE_KEY),
          AsyncStorage.getItem(TIME_KEY),
        ]);

        if (cachedData) {
          // 2. 캐시 데이터가 있으면 즉시 보여주기
          setExchangeData(normalizeCachedData(JSON.parse(cachedData)));
          setUpdateTime(cachedTime ? formatTimeForDisplay(cachedTime) : '');
          setIsLoading(false); // 캐시가 있으면 로딩 완료 처리
        }

        // 3. 캐시를 보여주는 동안 배경에서 새 데이터 받아오기
        await fetchAndCacheData('RISE', !!cachedData);
      } catch (e) {
        console.error("초기화 에러", e);
        fetchAndCacheData('RISE');
      }
    };

    initializeData();

    const calculateNextHourTick = () => {
      const now = new Date();
      const delay = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();
      return delay + 2000;
    };

    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      silentFetchExchangeRates();
      intervalId = setInterval(silentFetchExchangeRates, 3600000);
    }, calculateNextHourTick());

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handlePressItem = (item: CountryData) => {
    router.push({
      pathname: '/exchange_detail',
      params: { ...item }
    });
  };

  // 시간을 "20:00 기준" 포맷으로 변경하는 함수
  const formatTimeForDisplay = (timeStr: string) => {
    if (!timeStr) return '';
    // "2026.03.12 20:00" -> ["2026.03.12", "20:00"]
    const parts = timeStr.split(' ');
    if (parts.length > 1) {
      return `${parts[1]}`;
    }
    return timeStr;
  };

  return (
    <View style={styles.container}>
      <ExchangeHeader
        //title="환율 목록"
        time={updateTime}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionGap}>
          <TodayTravelDestination />
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
            </View>

          ) : (
            <ShowCountry
              data={exchangeData}
              onPressItem={handlePressItem}
              onFilterChange={handleFilterChange}
              activeFilter={currentSort}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

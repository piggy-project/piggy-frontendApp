import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { styles } from './Exchange.styles';

import { exchangeApi } from '@/components/utils/api';
import { FLAG_MAP } from '@/constants/Currency';
import ExchangeHeader from '../Header/ExchangeHeader';
import SearchCountry from './component/SearchCountry';
import ShowCountry from './component/ShowCountry';
import TodayTravelDestination from './component/TodayTravelDestination';

export interface CountryData {
  id: string;
  name: string;
  code: string;
  rate: string;
  percentChange: number;
  flag: string;
  time?: string;
}

export default function ExchangePage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [exchangeData, setExchangeData] = useState<CountryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState('');
  const [currentSort, setCurrentSort] = useState('RISE');

  const formatData = (rawData: any[]): CountryData[] => {
    return rawData.map((item: any) => ({
      id: item.curUnit,
      name: item.curNm,
      code: item.curUnit,
      rate: `${item.rate?.toLocaleString(undefined, { minimumFractionDigits: 2 })} KRW`,
      percentChange: item.percentChange || 0,
      flag: FLAG_MAP[item.curUnit] || '🏳️',
      time: item.time,
    }));
  };

  // 필터 변경 시 랭킹 API 호출 함수
  const handleFilterChange = async (sort: string) => {
    setCurrentSort(sort);
    try {
      setIsLoading(true);
      const response = await exchangeApi.getExchangeRanking(sort);
      const rawData = response.data || response;
      if (Array.isArray(rawData)) {
        if (rawData.length > 0 && rawData[0].time) setUpdateTime(rawData[0].time);
        setExchangeData(formatData(rawData));
      }
    } catch (error) {
      console.error('데이터 로드 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const silentFetchExchangeRates = async () => {
    try {
      const response = await exchangeApi.getExchangeRanking(currentSort); // 현재 선택된 필터 유지
      const rawData = response.data || response;
      if (Array.isArray(rawData)) {
        if (rawData.length > 0 && rawData[0].time) setUpdateTime(rawData[0].time);
        setExchangeData(formatData(rawData));
      }
    } catch (e) {
      console.log("Silent update failed", e);
    }
  };

  useEffect(() => {
    handleFilterChange('RISE');

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

  const filteredData = exchangeData.filter((item) =>
    item.name.includes(searchText) ||
    item.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePressItem = (item: CountryData) => {
    router.push({
      pathname: '/exchange_detail',
      params: { ...item }
    });
  };

  return (
    <View style={styles.container}>
      <ExchangeHeader
        //title="환율 목록"
        time={updateTime}
      />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        <TodayTravelDestination/>
        <SearchCountry value={searchText} onChangeText={setSearchText} />
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#4A90E2" />
          </View>
        ) : (
          <ShowCountry data={filteredData} onPressItem={handlePressItem} onFilterChange={handleFilterChange} activeFilter={currentSort}/>
        )}
      </View>
    </View>
  );
}
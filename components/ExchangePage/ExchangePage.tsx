import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { styles } from './Exchange.styles';

import { exchangeApi } from '@/components/utils/api';
import ExchangeHeader from '../Header/ExchangeHeader';
import SearchCountry from './component/SearchCountry';
import ShowCountry from './component/ShowCountry';

export interface CountryData {
  id: string;
  name: string;
  code: string;
  rate: string;
  flag: string;
  time?: string;
}

const FLAG_MAP: Record<string, string> = {
  USD: '🇺🇸', EUR: '🇪🇺', JPY: '🇯🇵', CNY: '🇨🇳', HKD: '🇭🇰',
  TWD: '🇹🇼', GBP: '🇬🇧', CHF: '🇨🇭', CAD: '🇨🇦', AUD: '🇦🇺',
  NZD: '🇳🇿', SGD: '🇸🇬', THB: '🇹🇭', MYR: '🇲🇾', IDR: '🇮🇩',
  VND: '🇻🇳', PHP: '🇵🇭', INR: '🇮🇳', SAR: '🇸🇦', AED: '🇦🇪',
  KWD: '🇰🇼', BHD: '🇧🇭'
};

export default function ExchangePage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [exchangeData, setExchangeData] = useState<CountryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState('');

  const formatData = (rawData: any[]): CountryData[] => {
    return rawData.map((item: any) => ({
      id: item.curUnit,
      name: item.curNm,
      code: item.curUnit,
      rate: `${item.rate?.toLocaleString(undefined, { minimumFractionDigits: 2 })} KRW`,
      flag: FLAG_MAP[item.curUnit] || '🏳️',
      time: item.time,
    }));
  };

  const fetchExchangeRates = async () => {
    try {
      setIsLoading(true);
      const response = await exchangeApi.getLatestRates();
      const rawData = response.data || response;
      if (Array.isArray(rawData)) {
        if (rawData.length > 0 && rawData[0].time) {
          setUpdateTime(rawData[0].time);
        }
        setExchangeData(formatData(rawData));
      }
    } catch (error) {
      console.error('환율 정보 호출 에러:', error);
      Alert.alert('알림', '환율 정보를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const silentFetchExchangeRates = async () => {
    try {
      const response = await exchangeApi.getLatestRates();
      const rawData = response.data || response;
      if (Array.isArray(rawData)) {
        if (rawData.length > 0 && rawData[0].time) {
          setUpdateTime(rawData[0].time);
        }
        setExchangeData(formatData(rawData));
      }
    } catch (e) {
      console.log("Silent update failed", e);
    }
  };

  useEffect(() => {
    // 1. 앱 진입 시 즉시 실행
    fetchExchangeRates();

    // 2. 다음 '정각'까지 남은 밀리초(ms) 계산 로직
    const calculateNextHourTick = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      // 다음 정각(60분)까지 남은 분 계산
      const nextMinuteTick = 60 - minutes;

      // 밀리초 단위 변환: (남은 분 * 60,000) - (현재 지난 초 * 1,000) - 현재 지난 밀리초
      const delay = (nextMinuteTick * 60 * 1000) - (seconds * 1000) - milliseconds;

      // 서버가 정각에 데이터를 갱신할 시간을 벌어주기 위해 2초 버퍼 추가
      return delay + 2000;
    };

    let intervalId: ReturnType<typeof setInterval> | undefined;

    // 3. 첫 번째 정각까지 기다리는 타이머
    const timeoutId = setTimeout(() => {
      silentFetchExchangeRates();

      // 4. 이후에는 정확히 '1시간(3,600,000ms)'마다 주기적으로 호출
      intervalId = setInterval(() => {
        silentFetchExchangeRates();
      }, 3600000);

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
        title="환율 목록"
        time={updateTime}
      />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        <SearchCountry value={searchText} onChangeText={setSearchText} />
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#4A90E2" />
          </View>
        ) : (
          <ShowCountry data={filteredData} onPressItem={handlePressItem} />
        )}
      </View>
    </View>
  );
}
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { styles } from './Exchange.styles';

import { exchangeApi } from '@/components/utils/api';
import ExchangeHeader from '../Header/ExchangeHeader';
import SearchCountry from './component/SearchCountry';
import ShowCountry from './component/ShowCountry';

// 1. 프론트엔드 데이터 타입 (백엔드 ExchangeRateResponseDto와 일치)
export interface CountryData {
  id: string;
  name: string;   
  code: string;   
  rate: string;   
  flag: string;   
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

  const fetchExchangeRates = async () => {
    try {
      setIsLoading(true);
      const response = await exchangeApi.getLatestRates();
      
      const rawData = response.data || response; 

      if (!Array.isArray(rawData)) {
        console.warn('데이터가 배열이 아닙니다:', rawData);
        return;
      }

      // 2. 데이터 변환 (백엔드 필드명: curUnit, curNm, rate)
      const formattedData: CountryData[] = rawData.map((item: any) => ({
        id: item.curUnit,
        name: item.curNm,
        code: item.curUnit,
        // 숫자로 오는 rate를 3자리 콤마 포맷팅
        rate: `${item.rate?.toLocaleString(undefined, { minimumFractionDigits: 2 })} KRW`,
        flag: FLAG_MAP[item.curUnit] || '🏳️',
      }));

      setExchangeData(formattedData);
    } catch (error) {
      console.error('환율 정보 호출 에러:', error);
      Alert.alert('알림', '환율 정보를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
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
      <ExchangeHeader title="실시간 환율 목록" />
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
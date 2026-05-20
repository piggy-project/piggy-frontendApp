import { exchangeApi } from '@/components/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import ExchangeHeader from '../Header/ExchangeHeader';
import DailyPriceList from './component/DailyPriceList';
import ExchangeGraph, { Period } from './component/ExchangeGraph';
import PeriodSelector from './component/PeriodSelector';
import TodayPriceCard from './component/TodayPriceCard';
import { styles } from './ExchangeDetail.styles';

interface ExchangeDetail {
  currentRate: number;
  high: number;
  low: number;
  change: number;
  percentChange: number;
  favorited?: boolean;
  isFavorited?: boolean;
  favorite?: boolean;
}

interface HistoryItem {
  date: string;
  rate: number;
}

export default function ExchangeDetailPage() {
  const params = useLocalSearchParams();
  const [detail, setDetail] = useState<ExchangeDetail | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1D');

  const getCacheKey = (code: string) => `EXCHANGE_DETAIL_${code}`;
  const getHistoryKey = (code: string) => `EXCHANGE_HISTORY_${code}`;

  useEffect(() => {
    const fetchData = async () => {
      const code = String(params.code);
      try {
        // 1. 상세 정보 (상단 요약용 - 필요시 유지하거나 정리)
        const cachedDetail = await AsyncStorage.getItem(getCacheKey(code));
        if (cachedDetail) setDetail(JSON.parse(cachedDetail));
        
        const detailRes = await exchangeApi.getExchangeDetail(code);
        setDetail(detailRes);
        await AsyncStorage.setItem(getCacheKey(code), JSON.stringify(detailRes));

        // 2. 히스토리 정보 (일일 시세용)
        const cachedHistory = await AsyncStorage.getItem(getHistoryKey(code));
        if (cachedHistory) processHistory(JSON.parse(cachedHistory));

        const historyRes = await exchangeApi.getExchangeHistory(code);
        processHistory(historyRes);
        await AsyncStorage.setItem(getHistoryKey(code), JSON.stringify(historyRes));

      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const processHistory = (data: HistoryItem[]) => {
      // 최근 10일치 추출 및 등락 계산
      const latest10 = data.slice(-10).reverse();
      const processed = latest10.map((item, index, array) => {
        // 이전 날짜(배열상 다음 인덱스) 데이터 찾기
        const prevItem = data[data.indexOf(item) - 1];
        const change = prevItem ? item.rate - prevItem.rate : 0;
        const percentChange = prevItem ? (change / prevItem.rate) * 100 : 0;
        
        return {
          date: item.date,
          rate: item.rate,
          change,
          percentChange
        };
      });
      setHistory(processed);
    };

    if (params.code) fetchData();
  }, [params.code]);

  return (
    <View style={styles.container}>
      <ExchangeHeader 
        country={String(params.name)} 
        code={String(params.code)}
        flag={String(params.flag)}
        showBackButton
      />
      
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionGap}>
          <View style={{ paddingHorizontal: 20 }}>
            <TodayPriceCard
              currencyCode={String(params.code)}
              currentRate={detail?.currentRate}
              change={detail?.change}
              percentChange={detail?.percentChange}
              initialFavorited={Boolean(detail?.favorited ?? detail?.isFavorited ?? detail?.favorite)}
            />
            <ExchangeGraph code={String(params.code)} period={selectedPeriod} />
            <PeriodSelector 
              selectedPeriod={selectedPeriod} 
              onPeriodChange={setSelectedPeriod} 
            />
          </View>
          
          {isLoading && history.length === 0 ? (
            <ActivityIndicator size="large" color="#FF3B30" style={{ marginTop: 40 }} />
          ) : (
            <DailyPriceList data={history} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

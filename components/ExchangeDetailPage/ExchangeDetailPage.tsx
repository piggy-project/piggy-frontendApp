import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { styles } from './ExchangeDetail.styles';

import { exchangeApi } from '@/components/utils/api';
import ExchangeHeader from '../Header/ExchangeHeader';
import ExchangeGraph from './component/ExchangeGraph';
import ExchangeInfo from './component/ExchangeInfo';

interface ExchangeDetail {
  currentRate: number;
  high: number;
  low: number;
  change: number;
  percentChange: number;
}

export default function ExchangeDetailPage() {
  const params = useLocalSearchParams();
  const [detail, setDetail] = useState<ExchangeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const response = await exchangeApi.getExchangeDetail(String(params.code));
        console.log('서버 응답 데이터:', response);
        setDetail(response.data || response);
      } catch (error) {
        console.error('상세 정보 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.code) fetchDetail();
  }, [params.code]);

  // 렌더링을 위한 변수 가공
  const changeValue = detail?.change ?? 0;
  const percentValue = detail?.percentChange ?? 0;
  const sign = changeValue > 0 ? '+' : '';

  return (
    <View style={styles.container}>
      <ExchangeHeader 
        country={String(params.name)} 
        code={String(params.code)}
        flag={String(params.flag)}
      />
      
      <View style={[styles.sectionGap, { flex: 1 }]}>
        <ExchangeGraph code={String(params.code)} />
        
        {/* isLoading이 false이면서 detail이 있을 때만 렌더링 */}
        {isLoading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : detail ? (
          <ExchangeInfo 
            // 1. 모든 수치 데이터에 ?? 0 을 붙여서 undefined 방지
            currentRate={(detail?.currentRate ?? 0).toLocaleString()}
            rateChange={`${sign}${changeValue.toFixed(2)} (${percentValue.toFixed(2)}%)`}
            
            // 2. 여기서 에러가 났을 확률이 높습니다! (Optional Chaining + 기본값 추가)
            high={(detail?.high ?? 0).toLocaleString()}
            low={(detail?.low ?? 0).toLocaleString()}
            
            inflation="2.4" 
            inflationChange="-0.1"
          />
        ) : (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text>데이터를 불러올 수 없습니다.</Text>
          </View>
        )}
      </View>
    </View>
  );
}
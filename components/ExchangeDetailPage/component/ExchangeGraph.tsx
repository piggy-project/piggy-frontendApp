import { exchangeApi } from '@/components/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { styles } from './ExchangeGraph.styles';

const screenWidth = Dimensions.get('window').width;

const getHistoryCacheKey = (code: string) => `EXCHANGE_HISTORY_${code}`;

interface ExchangeGraphProps {
  code: string; // 예: USD, JPY
  hideTitle?: boolean;
  height?: number;
  width?: number;
}

// 백엔드에서 받아올 데이터 타입 정의
interface HistoryData {
  date: string;  // "05-01"
  rate: number;  // 1350.5
}

export default function ExchangeGraph({
  code,
  height = 220,
  width = screenWidth - 40
}: ExchangeGraphProps) {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [graphData, setGraphData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchGraphData();
  }, [code]);

  // 데이터 가공 로직 분리
  const processData = (result: HistoryData[]) => {
    const lastMonthData = result.slice(-30);
    const newRates = lastMonthData.map(item => item.rate);
    const newLabels = lastMonthData.map((item, index) => {
      const isFirst = index === 0;
      const isLast = index === lastMonthData.length - 1;
      const isWeekly = (lastMonthData.length - 1 - index) % 7 === 0;
      return (isFirst || isLast || isWeekly) ? item.date : "";
    });
    return { newRates, newLabels };
  };

  const fetchGraphData = async () => {
    const cacheKey = getHistoryCacheKey(code);
    
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const cachedResult: HistoryData[] = JSON.parse(cached);
        const { newRates, newLabels } = processData(cachedResult);
        setLabels(newLabels);
        setGraphData(newRates);
        setLoading(false);
      } else {
        setLoading(true);
      }

      const result: HistoryData[] = await exchangeApi.getExchangeHistory(code);
      
      if (result && result.length > 0) {
        const { newRates, newLabels } = processData(result);
        
        setLabels(newLabels);
        setGraphData(newRates);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
      } else {
        if (!cached) throw new Error('데이터가 존재하지 않습니다.');
      }
    } catch (e: any) {
      console.error("그래프 데이터 로딩 에러:", e);
      if (graphData.length === 0) {
        setError(true);
        setErrorMessage(e.message || '데이터를 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 1. 로딩 상태
  if (loading) {
    return (
      <View style={[styles.graphContainer, styles.center]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>최신 환율 정보를 불러오는 중...</Text>
      </View>
    );
  }

  // 2. 에러 또는 데이터가 없을 때
  if (error || graphData.length === 0) {
    return (
      <View style={[styles.graphContainer, styles.center]}>
        <Text style={styles.loadingText}>
          {errorMessage || "그래프를 표시할 수 없습니다."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.graphWrapper}>
        <LineChart
          data={{
            labels: labels, // X축: 날짜 배열
            datasets: [
              {
                data: graphData, // Y축: 환율 값 배열
              },
            ],
          }}
          width={width}
          height={height}
          yAxisLabel=""
          yAxisSuffix="원"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1, // 소수점 첫째자리까지 표시
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`, // 메인 선 색상 (파란색 계열)
            labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`, // 축 글자 색상
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#4A90E2",
            },
            // 그리드 라인 투명도 조절
            propsForBackgroundLines: {
              strokeDasharray: "", // 실선으로 변경 (원하면 유지)
              strokeOpacity: 0.1
            }
          }}
          bezier // 곡선 적용
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          // 데이터 포인트 클릭 시 가이드라인 등을 위한 설정
          fromZero={false} // 데이터의 최소값에 맞춰서 그래프 시작 (변동폭 강조)
        />
      </View>
    </View>
  );
}
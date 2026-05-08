import { exchangeApi } from '@/components/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { styles } from './ExchangeGraph.styles';

const screenWidth = Dimensions.get('window').width;

// 일일 데이터용 캐시 키 구분
const getDailyCacheKey = (code: string) => `EXCHANGE_DAILY_${code}`;
const getHistoryCacheKey = (code: string) => `EXCHANGE_HISTORY_${code}`;

interface HistoryData {
  date: string;
  rate: number;
}

export type Period = '1D' | '1M' | '3M' | '1Y';

export default function ExchangeGraph({
  code,
  height = 220,
  width = screenWidth - 40,
  period = '1D' // 외부에서 기간을 주입받음
}: { code: string; height?: number; width?: number; period?: Period }) {
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const maxVal = graphData.length > 0 ? Math.max(...graphData) : 0;
  const minVal = graphData.length > 0 ? Math.min(...graphData) : 0;
  const maxIndex = graphData.indexOf(maxVal);
  const minIndex = graphData.indexOf(minVal);

  useEffect(() => {
    fetchGraphData();
  }, [code, period]);

  // 시간별 데이터 전용 가공 로직 (1일용)
  const processDailyData = (result: HistoryData[]) => {
    const newRates = result.map(item => item.rate);
    const newLabels = result.map((item, index) => {
      const hour = item.date.split(':')[0]; 
      const isLast = index === result.length - 1;
      const majorHours = ["09", "12", "15", "18", "21"];
      return (majorHours.includes(hour) || isLast) ? hour : "";
    });
    return { newRates, newLabels };
  };

  // 기간별 데이터 가공 로직 (1개월, 3개월, 1년용)
  const processPeriodData = (result: HistoryData[], selectedPeriod: Period) => {
    let filteredData: HistoryData[] = [];
    let finalLabels: string[] = [];

    if (selectedPeriod === '1M') {
      // 1개월: 일주일 단위로 5개 추출
      const step = Math.max(1, Math.floor(result.length / 4));
      for (let i = 0; i < 5; i++) {
        const idx = Math.min(result.length - 1, i * step);
        if (result[idx]) filteredData.push(result[idx]);
      }
    } else if (selectedPeriod === '3M') {
      // 3개월: 4개 추출
      const step = Math.max(1, Math.floor(result.length / 3));
      for (let i = 0; i < 4; i++) {
        const idx = Math.min(result.length - 1, i * step);
        if (result[idx]) filteredData.push(result[idx]);
      }
    } else if (selectedPeriod === '1Y') {
      // 1년: 각 월별로 마지막 데이터 하나씩만 추출 (최대 12개)
      const monthsMap = new Map<string, HistoryData>();
      result.forEach(d => {
        const month = d.date.split('-')[0];
        monthsMap.set(month, d); // 같은 월이면 덮어씌워져서 마지막 데이터가 남음
      });
      filteredData = Array.from(monthsMap.values()).slice(-12);
    }

    const newRates = filteredData.map(d => d.rate);
    const newLabels = filteredData.map(d => {
      if (selectedPeriod === '1Y') {
        return d.date.split('-')[0]; // 1년 그래프일 경우 월(Month)만 표시
      }
      return d.date; // 그 외에는 MM-DD 표시
    });
    return { newRates, newLabels };
  };

  const fetchGraphData = async () => {
    setLoading(true);
    const cacheKey = period === '1D' ? getDailyCacheKey(code) : getHistoryCacheKey(code);
    
    try {
      // 1. 캐시 확인
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        const { newRates, newLabels } = period === '1D' 
          ? processDailyData(data) 
          : processPeriodData(data.slice(- (period === '1M' ? 30 : period === '3M' ? 90 : 365)), period);
        
        setLabels(newLabels);
        setGraphData(newRates);
      }

      // 2. API 호출
      let result: HistoryData[];
      if (period === '1D') {
        result = await exchangeApi.getDailyHourlyHistory(code);
      } else {
        result = await exchangeApi.getExchangeHistory(code);
      }
      
      if (result && result.length > 0) {
        await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
        const { newRates, newLabels } = period === '1D' 
          ? processDailyData(result) 
          : processPeriodData(result.slice(- (period === '1M' ? 30 : period === '3M' ? 90 : 365)), period);
        
        setLabels(newLabels);
        setGraphData(newRates);
      }
    } catch (e) {
      console.error(`${period} 그래프 로딩 실패:`, e);
    } finally {
      setLoading(false);
    }
  };

  if (loading && graphData.length === 0) {
    return (
      <View style={[styles.graphContainer, styles.center]}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  return (
    <View style={[styles.chartCard, { width: width }]}>
      <View style={styles.chartContainer}>
        <View style={styles.chartWrapper}>
          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: graphData }],
            }}
            width={width + 70}
            height={height}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={false}
            withVerticalLabels={false}
            withHorizontalLabels={false}
            fromZero={false}
            chartConfig={{              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
              propsForDots: { r: "0" },
              fillShadowGradientFrom: "#FF3B30",
              fillShadowGradientTo: "#ffffff",
              fillShadowGradientFromOpacity: 0.1,
              fillShadowGradientToOpacity: 0,
            }}
            renderDotContent={({ x, y, index }) => {
              const isMax = index === maxIndex;
              const isMin = index === minIndex;
              const isLast = index === graphData.length - 1;
              const isTarget = isMax || isMin || isLast;

              if (!isTarget) return null;

              let labelPrefix = "";
              if (period === '1D') {
                if (isMax) labelPrefix = "최고 ";
                if (isMin && !isMax) labelPrefix = "최저 ";
              }

              return (
                <View key={index} style={{ position: 'absolute', top: y - 11, left: x - 11, width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
                  {/* 텍스트를 점 위로 띄움 (절대 위치로 점 위치에 영향 안 주게 함) */}
                  <View style={{ position: 'absolute', top: -22, width: 100, alignItems: 'center' }}>
                    <Text style={[styles.pointText, { marginBottom: 0 }, isMax && { color: '#FF3B30' }, isMin && !isMax && { color: '#007AFF' }]}>
                      {labelPrefix}{graphData[index].toLocaleString()}
                    </Text>
                  </View>
                  
                  {/* 점의 중심을 정확히 y 좌표에 맞춤 */}
                  <View style={styles.dotGlow}>
                    <View style={[styles.dotHighlight, isMax && { backgroundColor: '#FF3B30' }, isMin && !isMax && { backgroundColor: '#007AFF' }]} />
                  </View>
                </View>
              );
            }}
            style={{ 
              paddingRight: 0,
              marginLeft: -45,
              marginTop: 35, // 차트 자체를 아래로 밀어서 상단 라벨 공간 확보
            }}
          />
        </View>
      </View>
      
      <View style={styles.labelBar}>
        {labels.map((label, idx) => (
          label !== "" ? <Text key={idx} style={styles.labelText}>{label}</Text> : null
        ))}
      </View>
    </View>
  );
}
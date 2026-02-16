import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { styles } from './ExchangeGraph.styles';

const screenWidth = Dimensions.get('window').width;

interface ExchangeGraphProps {
  code: string; // 예: USD
  hideTitle?: boolean;
  height?: number;
  width?: number;
}

export default function ExchangeGraph({ code, 
  hideTitle = false, 
  height = 220,
  width = screenWidth - 40 }: ExchangeGraphProps) {

  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    fetchGraphData();
  }, [code]); // 국가 코드가 바뀌면 다시 불러옴

  const fetchGraphData = async () => {
    try {
      setLoading(true);
      // 👇 [중요] 여기에 실제 백엔드 API 주소를 넣으세요!
      // const response = await fetch(`http://your-backend/api/rates/history/${code}`);
      // const json = await response.json();
      
      // 지금은 테스트를 위해 1초 뒤에 가짜 데이터를 만듭니다.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // [가짜 데이터 생성 로직] - 백엔드 연결 시 지우세요
      const mockData = [1310, 1315, 1312, 1320, 1318, 1325]; // 환율 추이
      const mockLabels = ["1월", "2월", "3월", "4월", "5월", "6월"]; // 날짜

      setGraphData(mockData);
      setLabels(mockLabels);

    } catch (error) {
      console.error("그래프 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중일 때 보여줄 화면
  if (loading) {
    return (
      <View style={[styles.graphContainer, styles.center]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>환율 정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!hideTitle && <Text style={styles.title}>{code} 최근 동향</Text>}
      
      <View style={styles.graphWrapper}>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: graphData,
              },
            ],
          }}
          width={width} 
          height={height} 
          yAxisLabel="" 
          yAxisSuffix="원" 
          yAxisInterval={1} 
          chartConfig={{
            backgroundColor: "#f5f5f5",
            backgroundGradientFrom: "#f5f5f5",
            backgroundGradientTo: "#f5f5f5",
            decimalPlaces: 0, // 소수점 없애기
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 선 색상 (검정)
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 글자 색상
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier // 곡선 그래프로 만들기 (직선 원하면 제거)
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
}

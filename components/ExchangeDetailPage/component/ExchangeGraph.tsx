import { exchangeApi } from '@/components/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { styles } from './ExchangeGraph.styles';

const screenWidth = Dimensions.get('window').width;
const Y_AXIS_WIDTH = 46;
const CHART_AXIS_GAP = 12;
const CHART_CARD_HORIZONTAL_PADDING = 20;
const CHART_RIGHT_SAFE_SPACE = 12;

const getDailyCacheKey = (code: string) => `EXCHANGE_DAILY_${code}`;
const getHistoryCacheKey = (code: string) => `EXCHANGE_HISTORY_${code}`;

interface HistoryData {
  date: string;
  rate: number;
}

export type Period = '1D' | '1M' | '3M' | '1Y';

const getNiceStep = (range: number, targetSteps = 4) => {
  if (range <= 0) return 1;

  const rawStep = range / targetSteps;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const fraction = rawStep / magnitude;

  if (fraction <= 1) return magnitude;
  if (fraction <= 2) return 2 * magnitude;
  if (fraction <= 2.5) return 2.5 * magnitude;
  if (fraction <= 5) return 5 * magnitude;
  return 10 * magnitude;
};

const getDecimalPlaces = (value: number) => {
  const fixedValue = value.toFixed(6).replace(/0+$/, '');
  const decimalPart = fixedValue.split('.')[1];
  return decimalPart ? decimalPart.length : 0;
};

const getYAxisScale = (minVal: number, maxVal: number) => {
  if (maxVal === minVal) {
    const step = getNiceStep(Math.abs(maxVal) * 0.01 || 1);
    return {
      labels: [maxVal + step, maxVal, maxVal - step],
      max: maxVal + step,
      min: maxVal - step,
      decimalPlaces: getDecimalPlaces(step),
    };
  }

  const step = getNiceStep(maxVal - minVal);
  let axisMin = Math.floor(minVal / step) * step;
  let axisMax = Math.ceil(maxVal / step) * step;

  if (axisMin >= minVal) axisMin -= step;
  if (axisMax <= maxVal) axisMax += step;

  const tickCount = Math.round((axisMax - axisMin) / step) + 1;
  const labels = Array.from({ length: tickCount }, (_, index) => axisMax - step * index);

  return {
    labels,
    max: axisMax,
    min: axisMin,
    decimalPlaces: getDecimalPlaces(step),
  };
};

export default function ExchangeGraph({
  code,
  height = 220,
  width = screenWidth - 40,
  period = '1D'
}: { code: string; height?: number; width?: number; period?: Period }) {
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const maxVal = graphData.length > 0 ? Math.max(...graphData) : 0;
  const minVal = graphData.length > 0 ? Math.min(...graphData) : 0;
  const maxIndex = graphData.indexOf(maxVal);
  const minIndex = graphData.indexOf(minVal);
  const chartWidth = Math.max(
    width - Y_AXIS_WIDTH - CHART_AXIS_GAP - CHART_CARD_HORIZONTAL_PADDING - CHART_RIGHT_SAFE_SPACE,
    160
  );
  const yAxisScale = graphData.length > 0 ? getYAxisScale(minVal, maxVal) : null;
  const yAxisLabels = yAxisScale?.labels ?? [];
  const yAxisRange = yAxisScale ? yAxisScale.max - yAxisScale.min : 0;
  const yAxisBoundsData = yAxisScale
    ? graphData.map((_, index) => (index === 0 ? yAxisScale.max : yAxisScale.min))
    : graphData;

  const formatRateLabel = (value: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: yAxisScale?.decimalPlaces ?? 0,
    });

  useEffect(() => {
    fetchGraphData();
  }, [code, period]);

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

  const processPeriodData = (result: HistoryData[], selectedPeriod: Period) => {
    let filteredData: HistoryData[] = [];

    if (selectedPeriod === '1M') {
      const step = Math.max(1, Math.floor(result.length / 4));
      for (let i = 0; i < 5; i++) {
        const idx = Math.min(result.length - 1, i * step);
        if (result[idx]) filteredData.push(result[idx]);
      }
    } else if (selectedPeriod === '3M') {
      const step = Math.max(1, Math.floor(result.length / 3));
      for (let i = 0; i < 4; i++) {
        const idx = Math.min(result.length - 1, i * step);
        if (result[idx]) filteredData.push(result[idx]);
      }
    } else if (selectedPeriod === '1Y') {
      const monthsMap = new Map<string, HistoryData>();
      result.forEach(d => {
        const month = d.date.split('-')[0];
        monthsMap.set(month, d);
      });
      filteredData = Array.from(monthsMap.values()).slice(-12);
    }

    const newRates = filteredData.map(d => d.rate);
    const newLabels = filteredData.map(d => {
      if (selectedPeriod === '1Y') return d.date.split('-')[0];
      return d.date;
    });
    return { newRates, newLabels };
  };

  const fetchGraphData = async () => {
    setLoading(true);
    const cacheKey = period === '1D' ? getDailyCacheKey(code) : getHistoryCacheKey(code);

    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        const { newRates, newLabels } = period === '1D'
          ? processDailyData(data)
          : processPeriodData(data.slice(-(period === '1M' ? 30 : period === '3M' ? 90 : 365)), period);
        setLabels(newLabels);
        setGraphData(newRates);
      }

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
          : processPeriodData(result.slice(-(period === '1M' ? 30 : period === '3M' ? 90 : 365)), period);
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
    <View style={[styles.chartCard, { width }]}>
      <View style={{ overflow: 'visible', width: '100%' }}>
        <View pointerEvents="none" style={styles.yAxisOverlay}>
          <View style={styles.yAxisLine} />
          {yAxisLabels.map((value, index) => (
            <View
              key={`${value}-${index}`}
              style={[
                styles.yAxisTickRow,
                {
                  top: yAxisScale && yAxisRange > 0
                    ? `${((yAxisScale.max - value) / yAxisRange) * 100}%`
                    : `${(index / Math.max(yAxisLabels.length - 1, 1)) * 100}%`,
                },
              ]}
            >
              <Text style={styles.yAxisLabel}>{formatRateLabel(value)}</Text>
              <View style={styles.yAxisTick} />
            </View>
          ))}
        </View>

        <View style={{ marginLeft: Y_AXIS_WIDTH + CHART_AXIS_GAP, overflow: 'visible', width: chartWidth }}>
          <LineChart
            data={{
              labels,
              datasets: [
                { data: graphData },
                {
                  data: yAxisBoundsData,
                  color: () => 'rgba(0, 0, 0, 0)',
                  strokeWidth: 0,
                  withDots: false,
                },
              ],
            }}
            width={chartWidth}
            height={height}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={false}
            withVerticalLabels={false}
            withHorizontalLabels={false}
            fromZero={false}
            withShadow={false}
            segments={3}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
              propsForDots: { r: '0' },
              fillShadowGradientFrom: '#FF3B30',
              fillShadowGradientTo: '#ffffff',
              fillShadowGradientFromOpacity: 0.1,
              fillShadowGradientToOpacity: 0,
              propsForLabels: {
                fontSize: 10,
                fontWeight: '500',
              },
            }}
            renderDotContent={({ x, y, index }) => {
            const isMax = index === maxIndex;
            const isMin = index === minIndex;
            const isLast = index === graphData.length - 1;
            if (!isMax && !isMin && !isLast) return null;

            let labelText = graphData[index].toLocaleString();
            let dotColor = '#555555';
            let glowColor = 'rgba(100,100,100,0.15)';

            if (isMax) {
              labelText = `최고 ${labelText}`;
              dotColor = '#FF3B30';
              glowColor = 'rgba(255,59,48,0.15)';
            } else if (isMin) {
              labelText = `최저 ${labelText}`;
              dotColor = '#007AFF';
              glowColor = 'rgba(0,122,255,0.15)';
            }

            const LABEL_WIDTH = Math.min(Math.max(labelText.length * 7 + 8, 62), 92);
            const LABEL_HEIGHT = 14;
            const labelGap = isMin && !isMax ? 8 : 16;
            let labelLeft = x - LABEL_WIDTH / 2;
            if (labelLeft < 0) labelLeft = 4;
            if (labelLeft + LABEL_WIDTH > chartWidth) labelLeft = chartWidth - LABEL_WIDTH - 4;
            const labelTop = isMin && !isMax
              ? Math.min(y + labelGap, height - LABEL_HEIGHT)
              : Math.max(y - LABEL_HEIGHT - labelGap, 0);

            return (
              <View key={index}>
                {/* 포인트 라벨 텍스트 */}
                <View
                  style={{
                    position: 'absolute',
                    top: labelTop,
                    left: labelLeft,
                    width: LABEL_WIDTH,
                    alignItems: 'center',
                  }}
                >
                  <Text style={[styles.pointText, { color: dotColor }]}>
                    {labelText}
                  </Text>
                </View>

                {/* 포인트 점 */}
                <View
                  style={{
                    position: 'absolute',
                    top: y - 11,
                    left: x - 11,
                    width: 22,
                    height: 22,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={[styles.dotGlow, { backgroundColor: glowColor }]}>
                    <View style={[styles.dotHighlight, { backgroundColor: dotColor }]} />
                  </View>
                </View>
              </View>
            );
            }}
            style={{
              paddingRight: 0,
              marginLeft: 0,
              marginTop: 30,
            }}
          />
        </View>
      </View>

      <View style={styles.labelBar}>
        {labels.map((label, idx) =>
          label !== '' ? (
            <Text key={idx} style={styles.labelText}>{label}</Text>
          ) : null
        )}
      </View>
    </View>
  );
}

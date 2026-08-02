import { Typography } from '@/constants/Typography';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { exchangeApi } from '../../utils/api';
import { styles } from './TodayTravelDestination.styles';

// 가성비 국가 데이터 인터페이스 (백엔드 DTO 기준)
interface TravelRecommendation {
  destination: string;      // 국가
  location: string;         // 도시
  reason: string;           // 추천 이유
  currencyCode: string;     // 통화 코드
  currencyName: string;     // 통화명
  exchangeRate: number;     // 현재 환율
  percentChange: number;    // 변동률
  imageUrl: string;         // 이미지 URL
}

interface TodayTravelDestinationProps {
  updateTime?: string;
}

const DEFAULT_RECOMMENDATIONS: TravelRecommendation[] = [
  {
    destination: '일본',
    location: '도쿄',
    reason: '엔화 가치 안정화로 가성비 쇼핑과 먹거리를 함께 즐길 수 있는 추천 여행지!',
    currencyCode: 'JPY',
    currencyName: '엔',
    exchangeRate: 950.5,
    percentChange: -0.35,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
  },
  {
    destination: '베트남',
    location: '다낭',
    reason: '저렴한 물가와 럭셔리 해변 리조트를 합리적인 가격에 이용할 수 있는 여행지',
    currencyCode: 'VND',
    currencyName: '동',
    exchangeRate: 5.4,
    percentChange: -0.12,
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400',
  },
  {
    destination: '태국',
    location: '방콕',
    reason: '다채로운 스트리트 푸드와 화려한 야시장이 반기는 최고의 가성비 식도락 여행',
    currencyCode: 'THB',
    currencyName: '바트',
    exchangeRate: 38.2,
    percentChange: 0.15,
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400',
  },
];

const TodayTravelDestination: React.FC<TodayTravelDestinationProps> = ({ updateTime }) => {
  // API를 통해 추천 여행지 데이터 가져오기
  const { data: recommendations, isLoading } = useQuery<TravelRecommendation[]>({
    queryKey: ['travelRecommendations'],
    queryFn: exchangeApi.getTravelRecommendations,
  });

  const displayList = (Array.isArray(recommendations) && recommendations.length > 0)
    ? recommendations
    : DEFAULT_RECOMMENDATIONS;

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingVertical: 20, alignItems: 'center' }]}>
        <ActivityIndicator size="small" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 섹션 타이틀 */}
      <View style={styles.titleRow}>
        <Text style={[styles.title, Typography.Pretendard_M_16, { marginTop: 8 }]}>오늘의 가성비 여행지</Text>
        {!!updateTime && (
          <Text style={[styles.timeText, Typography.Pretendard_M_12]}>
            {updateTime} 기준
          </Text>
        )}
      </View>
      
      {/* 가로 스크롤 카드 리스트 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardContainer}
      >
        {displayList.map((item, index) => (
          <View key={`${item.destination}-${index}`} style={styles.destinationCard}>
            {/* 이미지 영역 */}
            <View style={styles.imageWrapper}>
              {item.imageUrl ? (
                <Image 
                  source={{ uri: item.imageUrl }} 
                  style={{ width: '100%', height: '100%' }} 
                  resizeMode="cover"
                />
              ) : (
                <View style={{ flex: 1, backgroundColor: '#d9d9d9' }} />
              )}
            </View>
            
            {/* 정보 영역 */}
            <View style={styles.infoWrapper}>
              {/* 국가 - 도시 */}
              <Text style={styles.destinationLocation}>
                {item.destination} - {item.location}
              </Text>
              
              {/* 간단한 설명 (이유) */}
              <Text 
                style={styles.reasonText} 
                numberOfLines={3} 
                ellipsizeMode="tail"
              >
                {item.reason}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TodayTravelDestination;

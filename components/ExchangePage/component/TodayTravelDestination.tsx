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

const TodayTravelDestination: React.FC<TodayTravelDestinationProps> = ({ updateTime }) => {
  // API를 통해 추천 여행지 데이터 가져오기
  const { data: recommendations, isLoading, isError } = useQuery<TravelRecommendation[]>({
    queryKey: ['travelRecommendations'],
    queryFn: exchangeApi.getTravelRecommendations,
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingVertical: 20, alignItems: 'center' }]}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  if (isError || !recommendations) {
    return null; // 에러 시 노출하지 않음
  }

  return (
    <View style={styles.container}>
      {/* 섹션 타이틀 */}
      <View style={styles.titleRow}>
        <Text style={[styles.title, Typography.Pretendard_M_16]}>오늘의 가성비 여행지</Text>
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
        {recommendations.map((item, index) => (
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

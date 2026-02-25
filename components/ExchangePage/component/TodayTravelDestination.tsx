import { Typography } from '@/constants/Typography';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { styles } from './TodayTravelDestination.styles';

// 가성비 국가 데이터 인터페이스
interface Destination {
  id: number;
  name: string;
  imageUrl?: string;
}

interface TodayTravelDestinationProps {
  destinations?: Destination[];
}

// 기본값(Mock Data) 설정
const MOCK_DESTINATIONS: Destination[] = [
  { id: 1, name: '' },
  { id: 2, name: '' },
  { id: 3, name: '' },
];

const TodayTravelDestination: React.FC<TodayTravelDestinationProps> = ({ 
  destinations = MOCK_DESTINATIONS 
}) => {
  return (
    <View style={styles.container}>
      {/* 섹션 타이틀 */}
      <Text style={[styles.title, Typography.Pretendard_B_24]}>오늘의 TOP3 여행지</Text>
      
      {/* 가로 스크롤 카드 리스트 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardContainer}
      >
        {destinations.map((item) => (
          <View key={item.id} style={styles.destinationCard}>
            {/* 이미지 영역 */}
            <View style={styles.imagePlaceholder}>
              {item.imageUrl ? (
                <Image 
                  source={{ uri: item.imageUrl }} 
                  style={{ width: '100%', height: '100%' }} 
                  resizeMode="cover"
                />
              ) : (
                // 이미지가 없을 때 보여줄 기본 배경(스타일 시트의 backgroundColor 적용됨)
                <View style={{ flex: 1 }} />
              )}
            </View>
            
            {/* 국가명 */}
            <Text style={styles.destinationName}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TodayTravelDestination;
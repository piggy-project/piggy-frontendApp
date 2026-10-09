import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TravelRecommendation {
  destination?: string;
  location?: string;
  reason?: string;
  currencyCode?: string;
  imageUrl?: string;
  image?: string;
  name?: string;
}

const DEFAULT_SPOTS: TravelRecommendation[] = [
  { destination: '일본', location: '도쿄', reason: '도쿄 타워', currencyCode: 'JPY', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300' },
  { destination: '베트남', location: '다낭', reason: '바나힐 리조트', currencyCode: 'VND', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=300' },
  { destination: '태국', location: '방콕', reason: '왓 아룬 사원', currencyCode: 'THB', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300' },
  { destination: '미국', location: '하와이', reason: '와이키키 해변', currencyCode: 'USD', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300' },
  { destination: '프랑스', location: '파리', reason: '에펠탑 공원', currencyCode: 'FRA_EUR', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300' },
];

export default function TravelSpotSection() {
  const router = useRouter();
  const displaySpots = DEFAULT_SPOTS;

  const handleSpotPress = (item: TravelRecommendation) => {
    const code = item.currencyCode || item.name || 'JPY';
    const destinationName = item.destination || item.location || '추천국가';
    router.push({
      pathname: '/exchange_detail',
      params: {
        code,
        name: destinationName,
        displayCode: code,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, Typography.Pretendard_M_16]}>가볼만한 관광지</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {displaySpots.map((item, index) => {
          // 백엔드 DTO 필드 매핑: destination(국가), location(도시/지역), reason(추천 사유)
          const regionName = item.destination 
            ? `${item.destination}${item.location ? ` ${item.location}` : ''}`
            : (item.location || '추천 지역');
            
          const spotTitle = item.location || item.reason || item.destination || '추천 관광지';
          const imgUrl = item.imageUrl || item.image;

          return (
            <TouchableOpacity
              key={`${item.currencyCode || item.destination || index}-${index}`}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => handleSpotPress(item)}
            >
              <View style={styles.imageBox}>
                {imgUrl ? (
                  <Image source={{ uri: imgUrl }} style={styles.image} resizeMode="cover" />
                ) : (
                  <View style={styles.placeholder} />
                )}
              </View>
              <Text style={[styles.regionName, Typography.Pretendard_M_11]} numberOfLines={1}>
                {regionName}
              </Text>
              <Text style={[styles.spotName, Typography.Pretendard_B_16]} numberOfLines={1}>
                {spotTitle}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 28,
    backgroundColor: '#fff',
  },
  title: {
    color: '#000',
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  card: {
    width: 110,
  },
  imageBox: {
    width: 110,
    height: 110,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  regionName: {
    color: '#555',
    marginBottom: 2,
  },
  spotName: {
    color: '#111',
  },
});

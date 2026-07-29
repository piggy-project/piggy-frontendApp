import { Typography } from '@/constants/Typography';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

interface TravelSpotSectionProps {
  data: any[];
}

export default function TravelSpotSection({ data }: TravelSpotSectionProps) {
  const spots = data.slice(0, 6);

  if (spots.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, Typography.Pretendard_M_16]}>가볼만한 관광지</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {spots.map((item, index) => (
          <View key={`${item.id || item.name || index}-spot`} style={styles.card}>
            <View style={styles.imageBox}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={styles.placeholder} />
              )}
            </View>
            <Text style={[styles.regionName, Typography.Pretendard_M_11]} numberOfLines={1}>
              {item.location || item.category || '지역 이름'}
            </Text>
            <Text style={[styles.spotName, Typography.Pretendard_B_16]} numberOfLines={1}>
              {item.name || '관광지 이름'}
            </Text>
          </View>
        ))}
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

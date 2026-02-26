import { Typography } from '@/constants/Typography';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 라이브러리 가정

export default function MyWishlist() {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, Typography.Pretendard_B_16]}>내 관심 상품 목록</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.card}>
            <View style={styles.imageBox}>
              <Ionicons name="bookmark" size={24} color="#333" style={styles.bookmark} />
            </View>
            <Text style={[styles.pName, Typography.Pretendard_M_12]}>바나나 6송이</Text>
            <Text style={[styles.pPrice, Typography.Pretendard_B_16]}>74% 4,800₩</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', },
  title: { marginBottom: 16 },
  card: { width: 120, marginRight: 12 },
  imageBox: { width: 120, height: 120, backgroundColor: '#D9D9D9', borderRadius: 8, position: 'relative' },
  bookmark: { position: 'absolute', bottom: 8, right: 8 },
  pName: { marginTop: 8, color: '#333' },
  pPrice: { marginTop: 2, color: '#000' }
});
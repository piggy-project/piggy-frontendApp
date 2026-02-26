import { Typography } from '@/constants/Typography';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function SavedCountries() {
  const countries = [
    { id: 1, name: '베트남' },
    { id: 2, name: '일본' },
    { id: 3, name: '캐나다' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, Typography.Pretendard_B_16]}>내 저장 나라 목록</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {countries.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.circle} />
            <Text style={[styles.name, Typography.Pretendard_M_12]}>{item.name}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff',},
  title: { marginBottom: 16 },
  list: { flexDirection: 'row', alignItems: 'center' },
  item: { alignItems: 'center', marginRight: 16 },
  circle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#D9D9D9', marginBottom: 6 },
  name: { color: '#333' },
  addButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E5E5E5', justifyContent: 'center', alignItems: 'center' },
  plus: { fontSize: 24, color: '#666' }
});
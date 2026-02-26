import { Typography } from '@/constants/Typography';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function UserActivity() {
  const [activeTab, setActiveTab] = useState('게시물');

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {['게시물', '댓글', '좋아요'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[Typography.Pretendard_B_16, { color: activeTab === tab ? '#000' : '#888' }]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>
        <View style={styles.emptyBox}>
          <Text style={[styles.emptyText, Typography.Pretendard_M_14]}>
            작성한 {activeTab}이 없습니다
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', flex: 1 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#333' },
  content: { padding: 40, alignItems: 'center' },
  emptyBox: { backgroundColor: '#F9F9F9', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20 },
  emptyText: { color: '#999' }
});
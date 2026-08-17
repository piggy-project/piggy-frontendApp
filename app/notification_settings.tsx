import BaseHeader from '@/components/Header/BaseHeader';
import BackButton from '@/components/Header/component/BackButton';
import NotificationSettings from '@/components/MyPage/component/NotificationSettings';
import { Typography } from '@/constants/Typography';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function NotificationSettingsScreen() {
  return (
    <View style={styles.container}>
      <BaseHeader
        left={<BackButton />}
        center={
          <Text style={[Typography.Pretendard_B_16, { color: '#000' }]}>
            알림 설정
          </Text>
        }
        right={null}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <NotificationSettings />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
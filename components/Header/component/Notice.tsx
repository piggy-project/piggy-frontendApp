import NoticeIcon from '@/assets/icons/noticeIcon.svg';
import { getAccessToken } from '@/components/utils/authStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

export default function Notice() {
  const router = useRouter();

  const openNotification = async () => {
    const token = await getAccessToken();
    if (!token) {
      Alert.alert(
        '알림',
        '로그인이 필요한 서비스입니다.',
        [
          { text: '취소', style: 'cancel' },
          { text: '로그인하러 가기', onPress: () => router.push('/(tabs)/mypage') }
        ]
      );
      return;
    }
    router.push('/notification');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={openNotification}>
      <NoticeIcon width={28} height={28} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

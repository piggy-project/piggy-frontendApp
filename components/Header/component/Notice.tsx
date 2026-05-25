import NoticeIcon from '@/assets/icons/noticeIcon.svg';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function Notice() {
  const router = useRouter();

  const openNotification = () => {
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

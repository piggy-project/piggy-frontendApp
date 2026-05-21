import NoticeIcon from '@/assets/icons/noticeIcon.svg';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function Notice() {
  const router = useRouter();

  const openNotification = () => {
    router.push('/notification'); 
  };

  return (
    <TouchableOpacity onPress={openNotification}>
      <NoticeIcon width={28} height={28} />
    </TouchableOpacity>
  );
}
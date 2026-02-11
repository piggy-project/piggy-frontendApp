import { Ionicons } from '@expo/vector-icons';
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
      <Ionicons name="notifications-outline" size={28} color="gray" />
    </TouchableOpacity>
  );
}
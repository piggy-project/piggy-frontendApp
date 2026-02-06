import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function Notice() {

  const openNotification = () => {
    console.log("알림창 열기");
  };

  return (
    <TouchableOpacity onPress={openNotification}>
      <Ionicons name="notifications-outline" size={28} color="gray" />
    </TouchableOpacity>
  );
}

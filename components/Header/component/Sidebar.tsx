import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function Sidebar() {

  const openSidebar = () => {
    console.log("사이드바 열기");
  };

  return (
    <TouchableOpacity onPress={openSidebar}>
      <Ionicons name="menu-outline" size={30} color="gray" />
    </TouchableOpacity>
  );
}

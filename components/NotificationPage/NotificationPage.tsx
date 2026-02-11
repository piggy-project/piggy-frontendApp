import React from 'react';
import { View } from 'react-native';
import NotificationHeader from '../Header/NotificationHeader';
import { styles } from './Notification.styles';

import NotificationList from './component/NotificationList';

export default function NotificationPage() {


  return (
    <View style={styles.container}>
      <NotificationHeader/>
      <NotificationList />
    </View>
  );
}
import React from 'react';
import { View } from 'react-native';
import MyPageHeader from '../Header/MyPageHeader';
import { styles } from './MyPage.styles';
import MyWishlist from './component/MyWishlist';
import ProfileInfo from './component/ProfileInfo';
import SavedCountries from './component/SavedCountries';
import UserActivity from './component/UserActivity';

export default function MyPage() {
  return (
    <View style={styles.container}>
      <MyPageHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        <ProfileInfo />
        <SavedCountries />
        <MyWishlist />
        <UserActivity />
      </View>
    </View>
  );
}
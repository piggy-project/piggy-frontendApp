import React from 'react';
import { View } from 'react-native';
import MyPageHeader from '../Header/MyPageHeader';
import { styles } from './MyPage.styles';
import ProfileInfo from './component/ProfileInfo';

type Props = {
  onLogout: () => void;
};

export default function MyPage({ onLogout }: Props) {
  return (
    <View style={styles.container}>
      <MyPageHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        {/*<기능 컴포넌트 넣기/>*/}
        <ProfileInfo onLogout={onLogout} />
      </View>
    </View>
  );
}
import React from 'react';
import { ScrollView, View } from 'react-native';
import MainHeader from '../Header/MainHeader';
import ChoiceCountry from '../MainDashBoardPage/component/ChoiceCountry';
import ProductSection from './component/ProductSection';
import ShoppingUtility from './component/ShoppingUtility';
import { styles } from './Shopping.styles';

export default function ShoppingPage() {
  const dummyProducts = [
    { id: '1', name: '바나나 6송이', discount: '74%', priceKrw: '4,800₩', localPrice: '9,0000동', originalPrice: '18,000₩' },
    { id: '2', name: '바나나 6송이', discount: '74%', priceKrw: '4,800₩', localPrice: '9,0000동', originalPrice: '18,000₩' },
    { id: '3', name: '바나나 6송이', discount: '74%', priceKrw: '4,800₩', localPrice: '9,0000동', originalPrice: '18,000₩' },
  ];
  
  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        {/*<기능 컴포넌트 넣기/>*/}
        <ChoiceCountry/>
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>

        <ShoppingUtility />
      
        {/* 컴포넌트 재사용으로 코드 중복 제거 */}
        <ProductSection title="국가 현지 구매 필수템" data={dummyProducts} />
        <ProductSection title="국가 직구 추천템" data={dummyProducts} />
    </ScrollView>
      </View>
    </View>
  );
}
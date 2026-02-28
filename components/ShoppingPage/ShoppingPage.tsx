import { shoppingApi } from '@/components/utils/api';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import MainHeader from '../Header/MainHeader';
import ChoiceCountry from '../MainDashBoardPage/component/ChoiceCountry';
import ComparisonResultList from './component/ComparisonResultList';
import ProductSection from './component/ProductSection';
import SearchProduct from './component/SearchProduct';
import ShoppingUtility from './component/ShoppingUtility';
import { styles } from './Shopping.styles';

const dummyProducts = [
    { id: '1', name: '바나나 6송이', discount: '74%', priceKrw: '4,800₩', localPrice: '9,0000동', originalPrice: '18,000₩' },
    { id: '2', name: '바나나 6송이', discount: '74%', priceKrw: '4,800₩', localPrice: '9,0000동', originalPrice: '18,000₩' },
    { id: '3', name: '바나나 6송이', discount: '74%', priceKrw: '4,800₩', localPrice: '9,0000동', originalPrice: '18,000₩' },
  ];

export default function ShoppingPage() {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

    // 검색 결과 초기화 함수
  const handleReset = () => {
    setSearchResult(null);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      handleReset(); // 검색어가 없으면 초기화
      return;
    }
  
  try {
    setIsLoading(true);
    const data = await shoppingApi.comparePrices(query);
    
    setSearchResult(data);
  } catch (error) {
    console.error("검색 실패:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        <ChoiceCountry />
        {/* SearchProduct에 검색 함수 전달 */}
        <SearchProduct onSearch={handleSearch} />

        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
          <ShoppingUtility />

          {isLoading ? (
            <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 50 }} />
          ) : searchResult ? (
            <ComparisonResultList data={searchResult} />
          ) : (
            <>
              <ProductSection title="국가 현지 구매 필수템" data={dummyProducts} />
              <ProductSection title="국가 직구 추천템" data={dummyProducts} />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
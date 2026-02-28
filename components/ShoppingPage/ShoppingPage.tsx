import { shoppingApi } from '@/components/utils/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import MainHeader from '../Header/MainHeader';
import ChoiceCountry from '../MainDashBoardPage/component/ChoiceCountry';
import ComparisonResultList from './component/ComparisonResultList';
import ProductSection from './component/ProductSection';
import SearchProduct from './component/SearchProduct';
import ShoppingUtility from './component/ShoppingUtility';
import { styles } from './Shopping.styles';

export default function ShoppingPage() {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendItems, setRecommendItems] = useState([]);

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

  // 컴포넌트 마운트 시 인기 아이템 로드
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const rawData = await shoppingApi.getPopularItems();

        const formattedData = rawData.map((item: any) => {
          const price = item.price ?? 0;
          const rate = (item.exchangeRate ?? 925) / 100;

          return {
            ...item,
            image: item.imageUrl,
            localPrice: `${price.toLocaleString()} JPY`,
            priceKrw: `${Math.floor(price * rate).toLocaleString()}원`,
          };
        });

        setRecommendItems(formattedData);
      } catch (error) {
        console.error("추천템 로드 실패:", error);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        <ChoiceCountry />
        {/* SearchProduct에 검색 함수 전달 */}
        <SearchProduct onSearch={handleSearch} onClear={handleReset} />

        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
          <ShoppingUtility />

          {isLoading ? (
            <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 50 }} />
          ) : searchResult ? (
            <ComparisonResultList data={searchResult} />
          ) : (
            <>
              <ProductSection title="🔥 실시간 다른 여행자들이 찾는 템" data={recommendItems} />
              <ProductSection title="✈️ 일본 현지 인기 굿즈" data={recommendItems} />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
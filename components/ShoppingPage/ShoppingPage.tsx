import { shoppingApi } from '@/components/utils/api';
import React, { useCallback, useEffect, useState } from 'react'; // useCallback 추가
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native'; // RefreshControl 추가
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
  const [refreshing, setRefreshing] = useState(false);

  // 1. 추천 아이템 로드 로직 분리
  const fetchRecommendations = useCallback(async () => {
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
  }, []);

  // 2. 사용자가 화면을 당겼을 때 실행되는 함수
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  const handleReset = () => {
    setSearchResult(null);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      handleReset();
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

  // 초기 마운트 시 실행
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        <ChoiceCountry />
        <SearchProduct onSearch={handleSearch} onClear={handleReset} />

        <ScrollView 
          style={{ flex: 1, backgroundColor: '#fff' }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={['#FFD700']}
              tintColor="#FFD700"
            />
          }
        >
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
import { shoppingApi } from '@/components/utils/api';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
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
  
  // 현재 선택된 통화 코드 상태 추가 (기본값: JPY)
  const [selectedCurrency, setSelectedCurrency] = useState('JPY');
  // 현재 검색어 저장 (국가 변경 시 재검색을 위해)
  const [lastQuery, setLastQuery] = useState('');

  // 1. 추천 아이템 로드 로직 (통화별 환율 계산 로직 개선)
  const fetchRecommendations = useCallback(async () => {
    try {
      const rawData = await shoppingApi.getPopularItems();
      const formattedData = rawData.map((item: any) => {
        const price = item.price ?? 0;
        // 서버에서 온 아이템의 원천 통화 확인 (기본값 JPY)
        const itemCurrency = item.currencyCode || 'JPY'; 
        const rate = item.exchangeRate ?? 900;

        // JPY, VND 등 100단위 통화인지 확인하여 원화 계산
        const isHundredUnit = ['JPY', 'VND', 'IDR'].includes(itemCurrency);
        const krwValue = isHundredUnit 
          ? Math.floor((price * rate) / 100) 
          : Math.floor(price * rate);

        return {
          ...item,
          image: item.imageUrl,
          localPrice: `${price.toLocaleString()} ${itemCurrency}`,
          priceKrw: `${krwValue.toLocaleString()}원`,
        };
      });
      setRecommendItems(formattedData);
    } catch (error) {
      console.error("추천템 로드 실패:", error);
    }
  }, []);

  // 2. 국가 탭 변경 핸들러
  const handleCountrySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    
    // 이미 검색 결과가 있는 상태에서 나라를 바꾸면, 바뀐 나라 기준으로 재검색
    if (lastQuery) {
      handleSearch(lastQuery, currencyCode);
    }
  };

  // 3. 검색 핸들러 (query와 currencyCode를 함께 전달)
  const handleSearch = async (query: string, currency: string = selectedCurrency) => {
    if (!query.trim()) {
      handleReset();
      return;
    }

    setLastQuery(query); // 최근 검색어 저장

    try {
      setIsLoading(true);
      // API 호출 시 검색어와 선택된 통화 코드를 함께 보냄
      const data = await shoppingApi.comparePrices(query, currency);
      setSearchResult(data);
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchResult(null);
    setLastQuery('');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        
        {/* 국가 선택 시 handleCountrySelect 호출 */}
        <ChoiceCountry onSelect={handleCountrySelect} />
        
        <SearchProduct 
          onSearch={(q) => handleSearch(q)} 
          onClear={handleReset} 
        />

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
              <ProductSection 
                title={`🔥 실시간 ${selectedCurrency} 인기템`} 
                data={recommendItems} 
              />
              <ProductSection 
                title="✈️ 여행자들이 많이 찾는 굿즈" 
                data={recommendItems} 
              />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
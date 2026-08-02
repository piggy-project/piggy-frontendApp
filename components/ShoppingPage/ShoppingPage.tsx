import { shoppingApi } from '@/components/utils/api';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import BaseHeader from '../Header/BaseHeader';
import { styles as baseHeaderStyles } from '../Header/BaseHeader.styles';
import ChoiceCountry from '../MainDashBoardPage/component/ChoiceCountry';
import ComparisonResultList from './component/ComparisonResultList';
import ProductSection from './component/ProductSection';
import SearchProduct from './component/SearchProduct';
import TravelSpotSection from './component/TravelSpotSection';
import { styles } from './Shopping.styles';

const TRAVEL_TABS = ['전체', '미국', '일본', '+'];

const getCountryCode = (currencyCode: string): string => {
  switch (currencyCode.toUpperCase()) {
    case 'JPY': return 'JPN';
    case 'USD': return 'USA';
    case 'VND': return 'VNM';
    case 'PHP': return 'PHL';
    case 'THB': return 'THA';
    case 'CNY': return 'CHN';
    case 'AUD': return 'AUS';
    case 'GBP': return 'GBR';
    case 'DEU_EUR': return 'DEU';
    case 'FRA_EUR': return 'FRA';
    default: return 'JPN';
  }
};

const DEFAULT_POPULAR_ITEMS = [
  { id: 'p1', name: '사과', discount: '74%', priceKrw: '4,800원', localPrice: '520 JPY', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300' },
  { id: 'p2', name: '바나나', discount: '74%', priceKrw: '4,800원', localPrice: '520 JPY', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300' },
  { id: 'p3', name: '쌀국수', discount: '74%', priceKrw: '4,800원', localPrice: '520 JPY', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300' },
  { id: 'p4', name: '녹차 과자', discount: '74%', priceKrw: '4,800원', localPrice: '520 JPY', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300' },
];

const DEFAULT_FOOD_ITEMS = [
  { id: 'f1', name: '사과', discount: '74%', priceKrw: '4,800원', localPrice: '520 JPY', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
  { id: 'f2', name: '바나나', discount: '74%', priceKrw: '4,800원', localPrice: '520 JPY', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300' },
  { id: 'f3', name: '쌀국수', discount: '74%', priceKrw: '4,800원', localPrice: '520 JPY', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300' },
];

const DEFAULT_DIRECT_PURCHASE_ITEMS = [
  { id: 'd1', name: '파스', discount: '74%', priceKrw: '2,700원', originalPrice: '10,000원', localPrice: '300 JPY', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300' },
  { id: 'd2', name: '바나나', discount: '74%', priceKrw: '2,700원', originalPrice: '10,000원', localPrice: '300 JPY', image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=300' },
  { id: 'd3', name: '사과', discount: '74%', priceKrw: '2,700원', originalPrice: '10,000원', localPrice: '300 JPY', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300' },
  { id: 'd4', name: '망고', discount: '74%', priceKrw: '2,700원', originalPrice: '10,000원', localPrice: '300 JPY', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300' },
];

export default function ShoppingPage() {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendItems, setRecommendItems] = useState<any[]>(DEFAULT_POPULAR_ITEMS);
  const [foodItems, setFoodItems] = useState<any[]>(DEFAULT_FOOD_ITEMS);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('ALL');
  const [lastQuery, setLastQuery] = useState('');

  const directItems = DEFAULT_DIRECT_PURCHASE_ITEMS;

  const fetchRecommendations = useCallback(async (currency: string) => {
    const requestCurrency = currency === 'ALL' ? 'JPY' : currency;

    try {
      const rawData = await shoppingApi.getPopularItems(requestCurrency);

      if (!Array.isArray(rawData) || rawData.length === 0) {
        setRecommendItems(DEFAULT_POPULAR_ITEMS);
        return;
      }

      const formattedData = rawData.map((item: any) => {
        const price = item.price ?? 0;
        const rate = item.exchangeRate ?? 900;
        const isHundredUnit = ['JPY', 'VND', 'IDR'].includes(requestCurrency);
        const krwValue = isHundredUnit
          ? Math.floor((price * rate) / 100)
          : Math.floor(price * rate);

        return {
          ...item,
          id: item.productUrl || item.url || item.link || item.externalProductId || item.id,
          source: item.source || 'POPULAR',
          externalProductId: String(item.externalProductId || item.productId || item.id || item.title || item.name),
          image: item.imageUrl || item.image,
          price,
          discount: item.discount || '74%',
          localPrice: `${price.toLocaleString()} ${requestCurrency}`,
          priceKrw: `${krwValue.toLocaleString()}원`,
          shopName: item.shopName,
          currencyCode: requestCurrency,
          exchangeRate: rate,
        };
      });

      setRecommendItems(formattedData);
    } catch (error) {
      console.error(`${currency} 인기템 로드 실패:`, error);
      setRecommendItems(DEFAULT_POPULAR_ITEMS);
    }
  }, []);

  const fetchFoodItems = useCallback(async (currency: string) => {
    const requestCurrency = currency === 'ALL' ? 'JPY' : currency;

    try {
      const countryCode = getCountryCode(requestCurrency);
      const data = await shoppingApi.getRegionalFoods(countryCode);

      if (!Array.isArray(data) || data.length === 0) {
        setFoodItems(DEFAULT_FOOD_ITEMS);
        return;
      }

      const formattedFood = data.map((food: any) => ({
        ...food,
        id: food.id || food.name,
        image: food.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
        discount: food.discount || '74%',
        priceKrw: food.priceKrw || '4,800원',
        localPrice: food.rating ? `평점 ${food.rating}` : food.category || '',
      }));

      setFoodItems(formattedFood);
    } catch (error) {
      console.error(`${currency} 음식 로드 실패:`, error);
      setFoodItems(DEFAULT_FOOD_ITEMS);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations(selectedCurrency);
    fetchFoodItems(selectedCurrency);
  }, [selectedCurrency, fetchRecommendations, fetchFoodItems]);

  const handleCountrySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);

    if (lastQuery) {
      handleSearch(lastQuery, currencyCode);
    }
  };

  const handleSearch = async (query: string, currency: string = selectedCurrency) => {
    if (!query.trim()) {
      handleReset();
      return;
    }

    setLastQuery(query);
    setIsSearchMode(false);

    try {
      setIsLoading(true);
      const requestCurrency = currency === 'ALL' ? 'JPY' : currency;
      const data = await shoppingApi.comparePrices(query, requestCurrency);
      setSearchResult(data);
    } catch (error) {
      console.error('검색 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchResult(null);
    setLastQuery('');
  };

  const handleExitSearchMode = () => {
    setIsSearchMode(false);
    handleReset();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations(selectedCurrency);
    await fetchFoodItems(selectedCurrency);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {isSearchMode ? (
        <View style={styles.searchModeScreen}>
          <SearchProduct
            variant="search"
            autoFocus
            onBack={handleExitSearchMode}
            onSearch={(q) => handleSearch(q)}
            onClear={handleReset}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <BaseHeader
            left={null}
            center={
              <SearchProduct
                variant="header"
                onFocus={() => setIsSearchMode(true)}
                onSearch={(q) => handleSearch(q)}
                onClear={handleReset}
              />
            }
            right={null}
            leftStyle={baseHeaderStyles.shrinkSideArea}
            centerStyle={baseHeaderStyles.wideCenterArea}
            rightStyle={baseHeaderStyles.shrinkSideArea}
          />

          <ChoiceCountry
            initialLabels={TRAVEL_TABS}
            initialSelectedLabel="전체"
            onSelect={handleCountrySelect}
          />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#FFD700']}
                tintColor="#FFD700"
              />
            }
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 50 }} />
            ) : searchResult ? (
              <ComparisonResultList data={searchResult} />
            ) : (
              <>
                <ProductSection
                  title="실시간 인기 아이템"
                  data={recommendItems}
                  type="product"
                  layout="horizontal"
                />
                <ProductSection
                  title="추천 먹거리"
                  data={foodItems}
                  type="product"
                  layout="horizontal"
                />
                <TravelSpotSection />
                <ProductSection
                  title="직구 추천템"
                  data={directItems}
                  type="product"
                  layout="grid"
                />
              </>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

import { shoppingApi } from '@/components/utils/api';
import { getAccessToken } from '@/components/utils/authStore';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, DeviceEventEmitter, Image, Linking, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export default function ComparisonResultList({ data }: { data: any }) {
  const { width } = useWindowDimensions();
  const [favoriteMap, setFavoriteMap] = React.useState<Record<string, boolean>>({});
  const hasRakutenData = data?.rakutenResults?.Items?.length > 0;
  const hasSerpData = data?.serpResults?.length > 0;

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('shopping-favorites-updated', (payload?: {
      source?: string;
      externalProductId?: string;
      favorite?: boolean;
    }) => {
      if (!payload?.source || !payload?.externalProductId || typeof payload.favorite !== 'boolean') {
        return;
      }

      const nextFavorite = payload.favorite;
      setFavoriteMap((prev) => ({
        ...prev,
        [`${payload.source}-${payload.externalProductId}`]: nextFavorite,
      }));
    });

    return () => subscription.remove();
  }, []);

  if (!data || (!hasRakutenData && !hasSerpData)) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, Typography.Pretendard_B_16]}>검색 결과 비교</Text>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>검색 결과가 없습니다.</Text>
      </View>
    );
  }

  const { naverResults, rakutenResults, serpResults, exchangeRate, currencyCode } = data;
  const gridGap = 16;
  const horizontalPadding = 20;
  const cardWidth = Math.floor((width - horizontalPadding * 2 - gridGap) / 2);

  const parsePrice = (value: any) => {
    if (typeof value === 'number') {
      return value;
    }

    const parsed = Number(String(value ?? '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const naverBestPrice = parsePrice(naverResults?.items?.[0]?.lprice);

  const showLoginRequiredAlert = () => {
    Alert.alert(
      '알림',
      '로그인이 필요한 서비스입니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그인하러 가기',
          onPress: () => router.push('/(tabs)/mypage'),
        },
      ]
    );
  };

  const calculateKrw = (localPrice: any) => {
    const parsedLocalPrice = parsePrice(localPrice);
    const isHundredUnit = ['JPY', 'VND'].includes(currencyCode);
    return isHundredUnit 
      ? Math.floor((parsedLocalPrice * exchangeRate) / 100) 
      : Math.floor(parsedLocalPrice * exchangeRate);
  };

  // 클릭 시 브라우저를 여는 핸들러
  const openProductLink = async (url: string) => {
    if (!url || !url.startsWith('http')) {
      Alert.alert("알림", "연결 가능한 상품 페이지가 없습니다.");
      return;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const toggleFavorite = async (item: any, link: string, source: string) => {
    const token = await getAccessToken();
    if (!token) {
      showLoginRequiredAlert();
      return;
    }

    const externalProductId = String(item.externalProductId || item.itemCode || link || item.name);

    try {
      const result = await shoppingApi.toggleFavorite({
        source,
        externalProductId,
        name: item.name,
        price: Number(item.price) || 0,
        imageUrl: item.image,
        productUrl: link,
        shopName: item.shopName,
        currencyCode,
        exchangeRate,
      });
      const nextFavorite = Boolean(result?.favorite ?? result?.data?.favorite);
      setFavoriteMap((prev) => ({ ...prev, [`${source}-${externalProductId}`]: nextFavorite }));
      DeviceEventEmitter.emit('shopping-favorites-updated', {
        source,
        externalProductId,
        favorite: nextFavorite,
      });
    } catch (error: any) {
      console.error('검색 상품 즐겨찾기 실패:', error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showLoginRequiredAlert();
        return;
      }
      Alert.alert('오류', '관심 상품 처리 중 문제가 발생했습니다.');
    }
  };

  const renderPriceComparison = (priceInKrw: number) => {
    if (!naverBestPrice || !priceInKrw) {
      return (
        <Text style={[styles.convertedPrice, Typography.Pretendard_M_14]}>
          {priceInKrw.toLocaleString()}원
        </Text>
      );
    }

    const cheaperAmount = naverBestPrice - priceInKrw;

    if (cheaperAmount > 0) {
      const cheaperPercent = Math.max(1, Math.round((cheaperAmount / naverBestPrice) * 100));

      return (
        <>
          <Text style={styles.benefitLine} numberOfLines={1}>
            <Text style={[styles.benefitPercent, Typography.Pretendard_B_16]}>
              {cheaperPercent}%
            </Text>
            <Text style={[styles.convertedPrice, Typography.Pretendard_B_16]}>
              {' '}{priceInKrw.toLocaleString()}원
            </Text>
          </Text>
          <Text style={[styles.naverPrice, Typography.Pretendard_M_11]}>
            {naverBestPrice.toLocaleString()}원
          </Text>
        </>
      );
    }

    return (
      <>
        <Text style={[styles.convertedPrice, Typography.Pretendard_M_14]} numberOfLines={1}>
          {priceInKrw.toLocaleString()}원
        </Text>
        <Text style={[styles.naverCheaperText, Typography.Pretendard_M_11]} numberOfLines={2}>
          네이버 최저가가 더 저렴합니다!
        </Text>
        <Text style={[styles.naverPrice, Typography.Pretendard_M_11]}>
          {naverBestPrice.toLocaleString()}원
        </Text>
      </>
    );
  };

  // 공통 카드 렌더링 함수 (link 인자 추가)
  const renderItemCard = (item: any, key: string, link: string, source: string) => {
    const priceInKrw = calculateKrw(item.price);
    const externalProductId = String(item.externalProductId || item.itemCode || link || item.name);
    const favoriteKey = `${source}-${externalProductId}`;

    return (
      <TouchableOpacity 
        key={key} 
        style={[styles.card, { width: cardWidth }]} 
        onPress={() => openProductLink(link)}
        activeOpacity={0.8}
      >
        <View style={[styles.imageWrapper, { width: cardWidth, height: cardWidth }]}>
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/160' }}
            style={styles.image}
            resizeMode="cover"
          />
          <Pressable
            style={styles.favoriteButton}
            onPress={(event) => {
              event.stopPropagation();
              toggleFavorite(item, link, source);
            }}
          >
            <Ionicons
              name={favoriteMap[favoriteKey] ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={favoriteMap[favoriteKey] ? '#FF6B8A' : '#C9C9C9'}
            />
          </Pressable>
        </View>
        <Text numberOfLines={2} style={[styles.itemName, Typography.Pretendard_M_12]}>
          {item.name}
        </Text>
        {renderPriceComparison(priceInKrw)}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.resultHeader}>
        <Text style={[styles.title, Typography.Pretendard_B_16]}>검색 결과</Text>
        <Text style={[styles.sortText, Typography.Pretendard_M_11]}>추천순⌄</Text>
      </View>
      <View style={[styles.grid, { columnGap: gridGap }]}>
        {/* 4. 일본(라쿠텐) 리스트: item.itemUrl 사용 */}
        {currencyCode === 'JPY' && rakutenResults?.Items?.map((itemObj: any, index: number) => {
          const item = itemObj.Item;
          return renderItemCard({
            name: item.itemName,
            itemCode: item.itemCode,
            price: item.itemPrice,
            image: item.mediumImageUrls?.[0]?.imageUrl,
            shopName: item.shopName,
          }, `rakuten-${item.itemCode || index}`, item.itemUrl, 'RAKUTEN');
        })}

        {/* 5. 동남아/미국/유럽 (SERP/eBay 리스트): item.link 사용 */}
        {currencyCode !== 'JPY' && serpResults?.map((item: any, index: number) => {
          return renderItemCard({
            name: item.title,
            price: item.price,
            image: item.thumbnail,
            shopName: item.source,
          }, `serp-${item.link || index}`, item.link, 'SERP');
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24 },
  resultHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#222' },
  sortText: { color: '#777' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 26,
  },
  card: {
    backgroundColor: '#fff'
  },
  imageWrapper: {
    marginBottom: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
  },
  favoriteButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    minHeight: 34,
    color: '#222',
    lineHeight: 17,
    marginBottom: 2,
  },
  benefitLine: {
    lineHeight: 19,
  },
  benefitPercent: {
    color: '#FF3B57',
  },
  convertedPrice: {
    color: '#111',
  },
  naverCheaperText: {
    color: '#FF3B57',
    lineHeight: 15,
    marginTop: 2,
  },
  naverPrice: {
    color: '#9A9A9A',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
});

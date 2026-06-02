import { shoppingApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type WishlistItem = {
  id?: number;
  source: string;
  externalProductId: string;
  name: string;
  price: number;
  imageUrl?: string;
  productUrl?: string;
  shopName?: string;
  currencyCode?: string;
  exchangeRate?: number;
  discountRate?: number;
  naverBestPrice?: number;
};

const normalizeFavorite = (item: any): WishlistItem => ({
  id: item.id,
  source: item.source ?? item.productSource ?? 'UNKNOWN',
  externalProductId: String(item.externalProductId),
  name: item.name ?? '상품명 없음',
  price: item.price ?? 0,
  imageUrl: item.imageUrl,
  productUrl: item.productUrl,
  shopName: item.shopName,
  currencyCode: item.currencyCode,
  exchangeRate: item.exchangeRate,
  discountRate: item.discountRate,
  naverBestPrice: item.naverBestPrice,
});

const formatKrwPrice = (item: WishlistItem) => {
  const price = Number(item.price) || 0;
  const exchangeRate = Number(item.exchangeRate) || 0;

  if (!price) {
    return '';
  }

  if (!exchangeRate || !item.currencyCode) {
    return `${price.toLocaleString()}원`;
  }

  const isHundredUnit = ['JPY', 'VND', 'IDR'].includes(item.currencyCode);
  const krwPrice = isHundredUnit
    ? Math.floor((price * exchangeRate) / 100)
    : Math.floor(price * exchangeRate);

  return `${krwPrice.toLocaleString()}원`;
};

const formatOriginalPrice = (item: WishlistItem) => {
  if (item.naverBestPrice) {
    return `${Number(item.naverBestPrice).toLocaleString()}원`;
  }

  if (!item.price) return '';
  return `${Number(item.price).toLocaleString()}${item.currencyCode ? ` ${item.currencyCode}` : ''}`;
};

export default function ShoppingBookmarkPage() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const cardWidth = useMemo(() => {
    const horizontalPadding = 20;
    const gap = 14;
    return Math.floor((width - horizontalPadding * 2 - gap) / 2);
  }, [width]);

  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await shoppingApi.getFavorites();
      const rawItems = response?.data || response || [];
      setItems(Array.isArray(rawItems) ? rawItems.map(normalizeFavorite) : []);
    } catch (error: any) {
      console.error('북마크 상품 목록 로딩 실패:', error.response?.data || error.message);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
      const subscription = DeviceEventEmitter.addListener('shopping-favorites-updated', fetchFavorites);
      return () => subscription.remove();
    }, [fetchFavorites])
  );

  const handleOpenProduct = async (url?: string) => {
    if (!url || !url.startsWith('http')) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  const handleDelete = async (item: WishlistItem) => {
    try {
      if (item.id) {
        await shoppingApi.deleteFavorite(item.id);
      } else {
        await shoppingApi.deleteFavoriteByProduct(item.source, item.externalProductId);
      }

      setItems((prev) => prev.filter((favorite) => (
        item.id
          ? favorite.id !== item.id
          : !(favorite.source === item.source && favorite.externalProductId === item.externalProductId)
      )));
      DeviceEventEmitter.emit('shopping-favorites-updated', {
        source: item.source,
        externalProductId: item.externalProductId,
        favorite: false,
      });
    } catch (error: any) {
      console.error('북마크 상품 삭제 실패:', error.response?.data || error.message);
      Alert.alert('오류', '관심 상품 삭제 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#333" />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={[styles.emptyText, Typography.Pretendard_M_14]}>북마크한 상품이 없습니다.</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom, 12) + 18 }]}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={`${item.source}-${item.externalProductId}`}
              style={[styles.card, { width: cardWidth }]}
              activeOpacity={0.85}
              onPress={() => handleOpenProduct(item.productUrl)}
            >
              <View style={[styles.imageBox, { width: cardWidth, height: cardWidth }]}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
                <TouchableOpacity style={styles.bookmark} onPress={() => handleDelete(item)}>
                  <Ionicons name="bookmark" size={18} color="#C9C9C9" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.name, Typography.Pretendard_M_12]} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.priceLine} numberOfLines={1}>
                {!!item.discountRate && (
                  <Text style={[styles.discountText, Typography.Pretendard_B_16]}>
                    {Math.round(item.discountRate)}%
                  </Text>
                )}
                <Text style={[styles.krwPrice, Typography.Pretendard_B_16]}>
                  {item.discountRate ? ' ' : ''}{formatKrwPrice(item)}
                </Text>
              </Text>
              {!!formatOriginalPrice(item) && (
                <Text style={[styles.originalPrice, Typography.Pretendard_M_11]} numberOfLines={1}>
                  {formatOriginalPrice(item)}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 48,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 22,
  },
  card: {
    backgroundColor: '#fff',
  },
  imageBox: {
    marginBottom: 8,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  bookmark: {
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
  name: {
    minHeight: 34,
    color: '#222',
    lineHeight: 17,
    marginBottom: 2,
  },
  priceLine: {
    lineHeight: 19,
  },
  discountText: {
    color: '#FF3B57',
  },
  krwPrice: {
    color: '#111',
  },
  originalPrice: {
    color: '#9A9A9A',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8E8E93',
  },
});

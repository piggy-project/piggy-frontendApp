import { shoppingApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
  View,
} from 'react-native';

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
  priceText?: string;
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
  priceText: item.price ? `${Number(item.price).toLocaleString()} ${item.currencyCode || ''}`.trim() : undefined,
});

export default function MyWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await shoppingApi.getFavorites();
      const rawItems = response?.data || response || [];
      setItems(Array.isArray(rawItems) ? rawItems.map(normalizeFavorite) : []);
    } catch (error: any) {
      console.error('관심 상품 목록 로딩 실패:', error.response?.data || error.message);
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
      console.error('관심 상품 삭제 실패:', error.response?.data || error.message);
      Alert.alert('오류', '관심 상품 삭제 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, Typography.Pretendard_B_16]}>내 관심 상품 목록</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => router.push('/(tabs)/shopping-bookmarks' as any)}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={22} color="#777" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#333" />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={[styles.emptyText, Typography.Pretendard_M_12]}>관심 상품이 없습니다.</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item) => (
            <TouchableOpacity
              key={`${item.source}-${item.externalProductId}`}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => handleOpenProduct(item.productUrl)}
            >
              <View style={styles.imageBox}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
                <TouchableOpacity style={styles.bookmark} onPress={() => handleDelete(item)}>
                  <Ionicons name="bookmark" size={18} color="#FF6B8A" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.pName, Typography.Pretendard_M_12]} numberOfLines={2}>
                {item.name}
              </Text>
              {!!item.priceText && (
                <Text style={[styles.pPrice, Typography.Pretendard_B_16]} numberOfLines={1}>
                  {item.priceText}
                </Text>
              )}
              {!!item.shopName && (
                <Text style={[styles.shopName, Typography.Pretendard_M_11]} numberOfLines={1}>
                  {item.shopName}
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
  container: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff' },
  titleRow: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#111' },
  moreButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  card: { width: 120, marginRight: 12 },
  imageBox: {
    width: 120,
    height: 120,
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, backgroundColor: '#D9D9D9' },
  bookmark: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pName: { marginTop: 8, color: '#333' },
  pPrice: { marginTop: 2, color: '#000' },
  shopName: { marginTop: 2, color: '#8E8E93' },
  loadingBox: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    height: 80,
    justifyContent: 'center',
  },
  emptyText: {
    color: '#8E8E93',
  },
});

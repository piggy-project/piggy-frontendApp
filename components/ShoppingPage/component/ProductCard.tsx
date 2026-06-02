import { shoppingApi } from '@/components/utils/api';
import { getAccessToken } from '@/components/utils/authStore';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, DeviceEventEmitter, Image, Linking, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ProductCard.styles';

interface ProductCardProps {
  id: string;
  image: string;  
  name: string;
  discount?: string;
  priceKrw: string;
  localPrice: string;
  originalPrice?: string;
  price?: number;
  source?: string;
  externalProductId?: string;
  productUrl?: string;
  url?: string;
  link?: string;
  shopName?: string;
  currencyCode?: string;
  exchangeRate?: number;
  favorited?: boolean;
  favorite?: boolean;
  isFavorite?: boolean;
}

export default function ProductCard({ 
  id,
  image, 
  name, 
  discount, 
  priceKrw, 
  localPrice, 
  originalPrice,
  price,
  source,
  externalProductId,
  productUrl,
  url,
  link,
  shopName,
  currencyCode,
  exchangeRate,
  favorited,
  favorite,
  isFavorite,
}: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(Boolean(favorited ?? favorite ?? isFavorite));
  const productLink = productUrl || url || link || id;
  const favoriteSource = source || 'POPULAR';
  const favoriteExternalId = String(externalProductId || id || productLink || name);
  const favoritePrice = typeof price === 'number'
    ? price
    : Number(String(localPrice).replace(/[^0-9.-]/g, '')) || 0;

  useEffect(() => {
    setIsFavorited(Boolean(favorited ?? favorite ?? isFavorite));
  }, [favorite, favorited, isFavorite]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('shopping-favorites-updated', (payload?: {
      source?: string;
      externalProductId?: string;
      favorite?: boolean;
    }) => {
      if (!payload?.source || !payload?.externalProductId || typeof payload.favorite !== 'boolean') {
        return;
      }

      if (payload.source === favoriteSource && String(payload.externalProductId) === favoriteExternalId) {
        setIsFavorited(payload.favorite);
      }
    });

    return () => subscription.remove();
  }, [favoriteExternalId, favoriteSource]);

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

  // 클릭 시 링크로 이동하는 핸들러
  const handlePress = async () => {
    if (!productLink || !productLink.startsWith('http')) {
      Alert.alert("알림", "연결 가능한 상품 페이지가 없습니다.");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(productLink);
      if (supported) {
        await Linking.openURL(productLink);
      } else {
        Alert.alert("알림", "이 링크를 열 수 있는 앱이 없습니다.");
      }
    } catch (error) {
      console.error("링크 오픈 에러:", error);
      Alert.alert("에러", "페이지를 여는 중 문제가 발생했습니다.");
    }
  };

  const handleToggleFavorite = async () => {
    const token = await getAccessToken();
    if (!token) {
      showLoginRequiredAlert();
      return;
    }

    try {
      const result = await shoppingApi.toggleFavorite({
        source: favoriteSource,
        externalProductId: favoriteExternalId,
        name,
        price: favoritePrice,
        imageUrl: image,
        productUrl: productLink,
        shopName,
        currencyCode,
        exchangeRate,
      });
      const nextFavorite = Boolean(result?.favorite ?? result?.favorited ?? result?.isFavorite ?? result?.data?.favorite);
      setIsFavorited(nextFavorite);
      DeviceEventEmitter.emit('shopping-favorites-updated', {
        source: favoriteSource,
        externalProductId: favoriteExternalId,
        favorite: nextFavorite,
      });
    } catch (error: any) {
      console.error('상품 즐겨찾기 실패:', error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showLoginRequiredAlert();
        return;
      }
      Alert.alert('오류', '관심 상품 처리 중 문제가 발생했습니다.');
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress} 
      activeOpacity={0.8}
    >
      <View style={styles.imageWrapper}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        <Pressable
          style={styles.favoriteButton}
          onPress={(event) => {
            event.stopPropagation();
            handleToggleFavorite();
          }}
        >
          <Ionicons
            name={isFavorited ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isFavorited ? '#FF6B8A' : '#C9C9C9'}
          />
        </Pressable>
      </View>
      
      <Text style={[styles.name, Typography.Pretendard_M_12]} numberOfLines={2}>
        {name}
      </Text>
      
      <Text style={[styles.priceMain, Typography.Pretendard_B_16]}>
        {discount && <Text style={[styles.discountText, Typography.Pretendard_B_16]}>{discount} </Text>}
        {priceKrw}
      </Text>
      
      <Text style={[styles.subText, Typography.Pretendard_M_11]}>{localPrice}</Text>
      
      {originalPrice && (
        <Text style={[styles.subText, Typography.Pretendard_M_11, styles.strike]}>
          {originalPrice}
        </Text>
      )}
    </TouchableOpacity>
  );
}

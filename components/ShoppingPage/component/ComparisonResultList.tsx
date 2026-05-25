import { shoppingApi } from '@/components/utils/api';
import { getAccessToken } from '@/components/utils/authStore';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, DeviceEventEmitter, Image, Linking, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ComparisonResultList({ data }: { data: any }) {
  const [favoriteMap, setFavoriteMap] = React.useState<Record<string, boolean>>({});
  const hasRakutenData = data?.rakutenResults?.Items?.length > 0;
  const hasSerpData = data?.serpResults?.length > 0;

  if (!data || (!hasRakutenData && !hasSerpData)) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, Typography.Pretendard_B_16]}>검색 결과 비교</Text>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>검색 결과가 없습니다.</Text>
      </View>
    );
  }

  const { naverResults, rakutenResults, serpResults, exchangeRate, currencyCode } = data;
  const naverBestPrice = naverResults?.items?.[0]?.lprice || 0;

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

  const calculateKrw = (localPrice: number) => {
    const isHundredUnit = ['JPY', 'VND'].includes(currencyCode);
    return isHundredUnit 
      ? Math.floor((localPrice * exchangeRate) / 100) 
      : Math.floor(localPrice * exchangeRate);
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
      DeviceEventEmitter.emit('shopping-favorites-updated');
    } catch (error: any) {
      console.error('검색 상품 즐겨찾기 실패:', error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showLoginRequiredAlert();
        return;
      }
      Alert.alert('오류', '관심 상품 처리 중 문제가 발생했습니다.');
    }
  };

  // 공통 카드 렌더링 함수 (link 인자 추가)
  const renderItemCard = (item: any, key: string, link: string, source: string) => {
    const priceInKrw = calculateKrw(item.price);
    const diff = naverBestPrice - priceInKrw;
    const externalProductId = String(item.externalProductId || item.itemCode || link || item.name);
    const favoriteKey = `${source}-${externalProductId}`;

    return (
      <TouchableOpacity 
        key={key} 
        style={styles.card} 
        onPress={() => openProductLink(link)}
        activeOpacity={0.8}
      >
        <View style={styles.row}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/80' }}
              style={styles.image}
            />
            <Pressable
              style={styles.favoriteButton}
              onPress={(event) => {
                event.stopPropagation();
                toggleFavorite(item, link, source);
              }}
            >
              <Ionicons
                name={favoriteMap[favoriteKey] ? 'heart' : 'heart-outline'}
                size={18}
                color={favoriteMap[favoriteKey] ? '#FF6B8A' : '#555'}
              />
            </Pressable>
          </View>
          <View style={styles.info}>
            <Text numberOfLines={2} style={[styles.itemName, Typography.Pretendard_M_14]}>
              {item.name}
            </Text>
            
            <View style={styles.priceRow}>
              <Text style={[styles.localPrice, Typography.Pretendard_B_16]}>
                {item.price.toLocaleString()} {currencyCode}
              </Text>
              <Text style={[styles.krwPrice, Typography.Pretendard_M_12]}>
                (약 {priceInKrw.toLocaleString()}원)
              </Text>
            </View>

            <View style={styles.compareBox}>
              <Text style={Typography.Pretendard_M_12}>국내 최저가 대비 </Text>
              <Text style={[
                Typography.Pretendard_B_16, 
                { color: diff > 0 ? '#E74C3C' : '#2ECC71' }
              ]}>
                {diff > 0 ? `${diff.toLocaleString()}원 저렴` : `${Math.abs(diff).toLocaleString()}원 비쌈`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, Typography.Pretendard_B_16]}>검색 결과 비교</Text>
      
      {/* 4. 일본(라쿠텐) 리스트: item.itemUrl 사용 */}
      {currencyCode === 'JPY' && rakutenResults?.Items?.map((itemObj: any, index: number) => {
        const item = itemObj.Item;
        return renderItemCard({
          name: item.itemName,
          itemCode: item.itemCode,
          price: item.itemPrice,
          image: item.mediumImageUrls?.[0]?.imageUrl,
          shopName: item.shopName,
        }, `rakuten-${index}`, item.itemUrl, 'RAKUTEN');
      })}

      {/* 5. 동남아/미국/유럽 (SERP/eBay 리스트): item.link 사용 */}
      {currencyCode !== 'JPY' && serpResults?.map((item: any, index: number) => {
        return renderItemCard({
          name: item.title,
          price: item.price,
          image: item.thumbnail,
          shopName: item.source,
        }, `serp-${index}`, item.link, 'SERP');
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { marginBottom: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  row: { flexDirection: 'row' },
  imageWrapper: { width: 80, height: 80, marginRight: 12, position: 'relative' },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#f9f9f9' },
  favoriteButton: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1, justifyContent: 'space-between' },
  itemName: { color: '#333', marginBottom: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  localPrice: { color: '#000', marginRight: 5 },
  krwPrice: { color: '#888' },
  compareBox: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 5,
    borderRadius: 4,
    flexWrap: 'wrap'
  }
});

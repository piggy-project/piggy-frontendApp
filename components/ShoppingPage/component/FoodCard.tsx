import { Typography } from '@/constants/Typography';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

// 이미지가 없을 때나 로드 실패 시 보여줄 기본 폴백 이미지
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400';

interface FoodCardProps {
    rank?: number;
    name: string;
    category: string;
    rating?: number;
    desc: string;
    image?: string;
}

export default function FoodCard({ rank, name, category, rating = 0, desc, image }: FoodCardProps) {
    const [imgUri, setImgUri] = useState<string>(image || FALLBACK_IMAGE);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setImgUri(image || FALLBACK_IMAGE);
        setIsLoading(true);
    }, [image]);

    const handleError = () => {
        // 이미지 로드 실패 시 디폴트 푸드 이미지로 교체
        if (imgUri !== FALLBACK_IMAGE) {
            setImgUri(FALLBACK_IMAGE);
        }
        setIsLoading(false);
    };

    return (
        <View style={styles.container}>
            {/* 이미지 섹션 */}
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: imgUri }}
                    style={styles.image}
                    resizeMode="cover"
                    onLoadEnd={() => setIsLoading(false)}
                    onError={handleError}
                />
                
                {/* 이미지 로딩 바 */}
                {isLoading && (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator color="#FFD700" />
                    </View>
                )}
            </View>

            {/* 정보 섹션 */}
            <View style={styles.infoContainer}>
                <Text style={[Typography.Pretendard_B_16]} numberOfLines={1}>{name}</Text>
                <Text style={[styles.category, Typography.Pretendard_M_11]}>{category}</Text>

                <View style={styles.ratingRow}>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={[styles.ratingText, Typography.Pretendard_B_16]}>
                        {(rating ?? 0).toFixed(1)}
                    </Text>
                </View>

                <Text style={[styles.desc, Typography.Pretendard_M_11]} numberOfLines={2}>
                    {desc}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 140,
        marginRight: 12,
        backgroundColor: '#fff',
    },
    imageWrapper: {
        width: 140,
        height: 140,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#F5F5F5',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        marginTop: 8,
    },
    category: {
        color: '#888',
        marginTop: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    star: {
        fontSize: 10,
        marginRight: 2,
    },
    ratingText: {
        color: '#333',
    },
    desc: {
        color: '#666',
        marginTop: 4,
        lineHeight: 15,
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
});
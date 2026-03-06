import { Typography } from '@/constants/Typography';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

interface FoodCardProps {
    rank: number;
    name: string;
    category: string;
    rating: number;
    desc: string;
    image?: string; // S3나 기본 이미지 URL
}

export default function FoodCard({ rank, name, category, rating, desc, image }: FoodCardProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setHasError(false);
        setIsLoading(true);
    }, [image]);

    return (
        <View style={styles.container}>
            {/* 이미지 섹션 */}
            <View style={styles.imageWrapper}>
                {image && !hasError ? (
                    <>
                        <Image
                            source={{ uri: image }}
                            style={styles.image}
                            resizeMode="cover"
                            onLoadEnd={() => setIsLoading(false)} // 로딩 완료 시 indicator 숨김
                            onError={() => {
                                setHasError(true);
                                setIsLoading(false);
                            }}
                        />
                        {/* 로딩 중일 때 보여줄 로딩 바 */}
                        {isLoading && (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator color="#FFD700" />
                            </View>
                        )}
                    </>
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={[styles.placeholderText, Typography.Pretendard_M_11]}>
                            사진이{"\n"}준비중입니다
                        </Text>
                    </View>
                )}
            </View>

            {/* 정보 섹션 */}
            <View style={styles.infoContainer}>
                <Text style={[Typography.Pretendard_B_16]} numberOfLines={1}>{name}</Text>
                <Text style={[styles.category, Typography.Pretendard_M_11]}>{category}</Text>

                <View style={styles.ratingRow}>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={[styles.ratingText, Typography.Pretendard_B_16]}>{rating.toFixed(1)}</Text>
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
    placeholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#aaa',
        textAlign: 'center', // 여러 줄일 때 가운데 정렬
        lineHeight: 16,
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
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
});
import { communityApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from './CommunityWrite.styles';

// 백엔드 Enum 매핑
const categoryMap: Record<string, 'FREE' | 'EXCHANGE' | 'TRAVEL'> = {
    '자유게시판': 'FREE',
    '환율게시판': 'EXCHANGE',
    '여행게시판': 'TRAVEL',
};

// 통화 리스트 (ALL 제외)
const currencyList = [
    { code: 'USD', name: '미국 달러' },
    { code: 'JPY', name: '일본 엔' },
    { code: 'CNY', name: '중국 위안' },
    { code: 'EUR', name: '유럽연합 유로' },
    { code: 'VND', name: '베트남 동' },
    { code: 'PHP', name: '필리핀 페소' },
    { code: 'THB', name: '태국 바트' },
    { code: 'AUD', name: '호주 달러' },
    { code: 'GBP', name: '영국 파운드' },
];

export default function CommunityWrite() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { initialCategory, initialCode } = useLocalSearchParams<{
        initialCategory: string;
        initialCode: string;
    }>();

    // 상태 관리
    const [category, setCategory] = useState<string>(initialCategory || '자유게시판');
    const [selectedCode, setSelectedCode] = useState<string | null>(
        initialCode && initialCode !== 'ALL' ? initialCode : null
    );
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const tabs = ['자유게시판', '환율게시판', '여행게시판'];

    // 이미지 선택 핸들러
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8, // 용량 최적화
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
            return;
        }

        // 환율 게시판인데 국가를 선택하지 않은 경우
        if (category === '환율게시판' && !selectedCode) {
            Alert.alert('알림', '관련된 통화 국가를 선택해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);
            const mappedCategory = categoryMap[category];

            await communityApi.createPost({
                title,
                content,
                category: mappedCategory,
                code: mappedCategory === 'EXCHANGE' ? selectedCode : null,
                image: image
            });

            await queryClient.invalidateQueries({ queryKey: ['posts'] });

            Alert.alert('성공', '게시글이 등록되었습니다.', [
                { text: '확인', onPress: () => router.replace('/community') }
            ]);
        } catch (error: any) {
            console.error('글 등록 에러:', error);
            Alert.alert('오류', error.message || '글 등록 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* 상단 헤더 커스텀 (사진처럼 뒤로가기 + 완료) */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <Text style={[Typography.Pretendard_B_16, styles.completeText]}>완료</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* 1. 게시판 선택 칩 (사진 스타일) */}
                <View style={styles.tabContainer}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.chip, category === tab && styles.activeChip]}
                            onPress={() => {
                                setCategory(tab);
                                if (tab !== '환율게시판') setSelectedCode(null);
                            }}
                        >
                            <Text style={[
                                Typography.Pretendard_M_14,
                                styles.chipText,
                                category === tab && styles.activeChipText
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 2. 환율 게시판 선택 시에만 나타나는 통화 선택 (수평 스크롤) */}
                {category === '환율게시판' && (
                    <View style={styles.currencySection}>
                        <Text style={[Typography.Pretendard_M_12, styles.subLabel]}>국가 선택</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
                            {currencyList.map((item) => (
                                <TouchableOpacity
                                    key={item.code}
                                    style={[styles.currencyBadge, selectedCode === item.code && styles.activeCurrencyBadge]}
                                    onPress={() => setSelectedCode(item.code)}
                                >
                                    <Text style={[
                                        Typography.Pretendard_M_12,
                                        selectedCode === item.code ? { color: '#fff' } : { color: '#666' }
                                    ]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* 3. 제목 입력 */}
                <TextInput
                    style={[styles.titleInput, Typography.Pretendard_B_24]}
                    placeholder="제목을 입력하세요"
                    placeholderTextColor="#BBB"
                    value={title}
                    onChangeText={setTitle}
                />

                <View style={styles.divider} />
                {image && (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                        <TouchableOpacity
                            style={styles.imageDeleteBtn}
                            onPress={() => setImage(null)}
                        >
                            <Ionicons name="close-circle" size={24} color="rgba(0,0,0,0.6)" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* 4. 내용 입력 */}
                <TextInput
                    style={[styles.contentInput, Typography.Pretendard_M_16]}
                    placeholder="내용을 입력하세요"
                    placeholderTextColor="#BBB"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                />
            </ScrollView>

            {/* 하단 아이콘 바 (사진의 이미지 아이콘) */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
                    <Ionicons
                        name={image ? "image" : "image-outline"}
                        size={24}
                        color={image ? "#FFB7C5" : "#666"}
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
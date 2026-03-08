import NoneHeader from '@/components/Header/NoneHeader';
import { communityApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from './CommunityWrite.styles';

export default function CommunityWrite() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { initialCategory } = useLocalSearchParams<{ initialCategory: string }>();

    const [category, setCategory] = useState<string>(initialCategory || '환율 수다방');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
            return;
        }
        try {
            setIsSubmitting(true);
            await communityApi.createPost({
                title,
                content,
                category
            });
            await queryClient.invalidateQueries({ queryKey: ['posts'] });
            Alert.alert('성공', '게시글이 등록되었습니다.', [
                {
                    text: '확인',
                    onPress: () => {
                        router.replace('/community');
                    }
                }
            ]);
        } catch (error: any) {
            console.error('글 등록 에러:', error);
            // 백엔드에서 보낸 에러 메시지(ErrorCode) 처리
            const errorMsg = error.message || '로그인이 필요하거나 서버 오류가 발생했습니다.';
            Alert.alert('오류', errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* 상단 헤더 */}
            <NoneHeader />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* 카테고리 표시 (읽기 전용 또는 선택 가능) */}
                <View style={styles.categoryContainer}>
                    <Text style={[Typography.Pretendard_M_12, styles.categoryLabel]}>게시판</Text>
                    <View style={styles.categoryBadge}>
                        <Text style={[Typography.Pretendard_B_16, styles.categoryText]}>{category}</Text>
                    </View>
                </View>

                {/* 제목 입력 */}
                <TextInput
                    style={[styles.titleInput, Typography.Pretendard_B_16]}
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChangeText={setTitle}
                    returnKeyType="next"
                />

                <View style={styles.divider} />

                {/* 내용 입력 */}
                <TextInput
                    style={[styles.contentInput, Typography.Pretendard_M_16]}
                    placeholder="내용을 입력하세요. (여행 팁, 환율 질문 등)"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                />
            </ScrollView>
            <View style={styles.bottomButtonWrapper}>
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && { backgroundColor: '#ccc' }]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={[Typography.Pretendard_B_16, styles.submitButtonText]}>등록하기</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
import { communityApi } from '@/components/utils/api';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CommunityEditPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    // 1. 상태 관리
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null); // 서버에 있는 기존 이미지
    const [newImage, setNewImage] = useState<ImagePicker.ImagePickerAsset | null>(null); // 새로 선택한 이미지
    const [isImageRemoved, setIsImageRemoved] = useState(false); // 기존 이미지 삭제 여부 플래그

    // 2. 기존 데이터 불러오기
    const { data: post, isLoading } = useQuery({
        queryKey: ['post', Number(id)],
        queryFn: () => communityApi.getPostDetail(Number(id)),
        enabled: !!id,
    });

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setExistingImageUrl(post.imageUrl);
        }
    }, [post]);

    // 3. 이미지 선택 핸들러 (Write 페이지와 동일)
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
            quality: 0.8,
        });

        if (!result.canceled) {
            setNewImage(result.assets[0]);
            setExistingImageUrl(null);
            setIsImageRemoved(false);
        }
    };

    // 4. 이미지 삭제 핸들러
    const handleRemoveImage = () => {
        setExistingImageUrl(null);
        setNewImage(null);
        setIsImageRemoved(true); // 기존 이미지가 있었다면 서버에서 삭제하도록 설정
    };

    // 5. 수정 요청 (Mutation)
    const updateMutation = useMutation({
        mutationFn: (updateData: any) => communityApi.updatePost(Number(id), updateData),
        onSuccess: () => {
            Alert.alert('성공', '게시글이 수정되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', Number(id)] });
            router.back();
        },
        onError: (error: any) => {
            Alert.alert('오류', error.message || '수정 중 오류가 발생했습니다.');
        },
    });

    const handleUpdate = () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
            return;
        }

        const updateData = {
            title,
            content,
            code: post?.code,
            removeImage: isImageRemoved,
            image: newImage, // 새로 선택한 이미지가 있으면 전달
        };

        updateMutation.mutate(updateData);
    };

    if (isLoading) return <View style={styles.loadingContainer}><ActivityIndicator color="#FFB7C5" size="large" /></View>;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={Typography.Pretendard_B_16}>글 수정하기</Text>
                <TouchableOpacity onPress={handleUpdate} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <Text style={[Typography.Pretendard_B_16, styles.completeText]}>완료</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* 제목 */}
                <TextInput
                    style={[styles.titleInput, Typography.Pretendard_B_24]}
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChangeText={setTitle}
                />

                <View style={styles.divider} />

                {/* 이미지 미리보기 영역 (새 이미지 우선, 없으면 기존 이미지) */}
                {(newImage || existingImageUrl) && (
                    <View style={styles.imagePreviewContainer}>
                        <Image
                            source={{ uri: newImage ? newImage.uri : existingImageUrl! }}
                            style={styles.imagePreview}
                        />
                        <TouchableOpacity
                            style={styles.imageDeleteBtn}
                            onPress={handleRemoveImage}
                        >
                            <Ionicons name="close-circle" size={24} color="rgba(0,0,0,0.6)" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* 내용 */}
                <TextInput
                    style={[styles.contentInput, Typography.Pretendard_M_16]}
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                />
            </ScrollView>

            {/* 하단 아이콘 바 (사진 추가 버튼) */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
                    <Ionicons
                        name={(newImage || existingImageUrl) ? "image" : "image-outline"}
                        size={24}
                        color={(newImage || existingImageUrl) ? "#FFB7C5" : "#666"}
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    // 전체 배경
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // 상단 헤더 (취소 | 글 수정하기 | 완료)
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 20, // 상세 페이지 헤더 높이와 통일
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
    },

    // 입력 영역 스크롤 뷰
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    // 제목 입력창
    titleInput: {
        color: '#000',
        paddingVertical: 15,
        // Typography.Pretendard_B_24가 적용되므로 여백만 조절
    },

    // 제목과 본문 사이 구분선
    divider: {
        height: 1,
        backgroundColor: '#F2F2F2',
        marginVertical: 5,
    },

    // 본문 입력창
    contentInput: {
        color: '#444',
        paddingVertical: 15,
        minHeight: 300, // 입력하기 편하도록 최소 높이 확보
        textAlignVertical: 'top', // 안드로이드에서 텍스트가 상단부터 시작하게 설정
        lineHeight: 24,
    },

    // 이미지 컨테이너 (이미지 + 삭제 버튼)
    imageWrapper: {
        position: 'relative',
        marginTop: 20,
        marginBottom: 40, // 하단 여백
    },

    // 수정 중인 이미지
    postImage: {
        width: '100%',
        height: 300, // 상세 페이지 이미지 높이와 통일
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
    },

    // 이미지 우측 상단 삭제 버튼 (X)
    imageDeleteBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // 버튼 배경을 살짝 투명한 흰색으로
        borderRadius: 20,
        padding: 1,
        // 버튼이 잘 보이도록 그림자 추가
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    // 로딩 뷰
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        backgroundColor: '#FFF',
        paddingBottom: Platform.OS === 'ios' ? 34 : 15,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    imagePreviewContainer: {
        marginVertical: 10,
        position: 'relative',
        width: 200,
        height: 150,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    completeText: {
        color: '#000', // 사진처럼 검은색 혹은 포인트 컬러
    },
});
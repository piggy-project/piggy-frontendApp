import MyPageDetailHeader from '@/components/Header/MyPageDetailHeader';
import { authApi } from '@/components/utils/api';
import { useAuth } from '@/components/utils/AuthContext';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ProfileDetail.styles';

export default function ProfileDetail() {
  const { user, setUser, logout } = useAuth();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const DEFAULT_IMAGE = require('@/assets/images/basicprofileicon.png');

  const handleProfilePress = () => {
    Alert.alert("프로필 설정", "수행할 동작을 선택해주세요.", [
      { text: "앨범에서 선택", onPress: pickImage },
      { text: "기본 이미지로 변경", onPress: removeImage },
      { text: "취소", style: "cancel" },
    ]);
  };

  // 갤러리에서 사진 변경하기 (PATCH)
  const pickImage = async () => {
    try {
      // 권한 요청
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('알림', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images', // 최신 방식 (경고 해결)
        allowsEditing: true,  // 기본 크롭 도구 활성화
        aspect: [1, 1],       // 1:1 비율 고정 (프로필용)
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setIsUploading(true);
        const selectedImage = result.assets[0];

        const formData = new FormData();
        formData.append('image', {
          uri: selectedImage.uri,
          type: selectedImage.mimeType || 'image/jpeg', // mimeType이 없을 경우 대비
          name: `profile_${user?.id || 'temp'}.jpg`,
        } as any);

        const res = await authApi.updateProfileImage(formData);

        // 백엔드에서 준 새 이미지 URL로 로컬 상태 동기화
        if (user) setUser({ ...user, profileImageUrl: res.data });
        Alert.alert("알림", "프로필 사진이 변경되었습니다.");
      }
    } catch (error: any) {
      Alert.alert("오류", "사진 업로드에 실패했습니다.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    try {
      setIsUploading(true);

      const res = await authApi.deleteProfileImage();
      const updatedUrl = res.data;

      if (user) {
        setUser({ ...user, profileImageUrl: updatedUrl });
      }

      Alert.alert("알림", "기본 프로필로 변경되었습니다.");
    } catch (error) {
      Alert.alert("오류", "프로필 삭제에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: async () => {
          await logout();
          router.replace('/signup');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <MyPageDetailHeader />
      <View style={styles.profileSection}>
        <TouchableOpacity
          style={styles.largeProfileImage}
          onPress={handleProfilePress}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#FFB7C5" />
          ) : (
            <Image
              source={user?.profileImageUrl ? { uri: user.profileImageUrl } : DEFAULT_IMAGE}
              style={{ width: '100%', height: '100%', borderRadius: 50 }}
            />
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={12} color="white" />
          </View>
        </TouchableOpacity>
        <View style={styles.nicknameRow}>
          <Text style={[styles.nickname, Typography.Pretendard_B_16]}>
            {user?.nickname || "사용자"}
          </Text>
          <TouchableOpacity>
            <Ionicons name="pencil" size={16} color="black" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, Typography.Pretendard_B_16]}>회원 정보</Text>
          <TouchableOpacity>
            <Text style={styles.editLink}>수정</Text>
          </TouchableOpacity>
        </View>
        {/* value에 명시적으로 문자열 변환 처리 */}
        <InfoRow label="이름" value={String(user?.name || "알 수 없음")} />
        <InfoRow label="전화번호" value="010-****-****" />
        <InfoRow label="생년월일" value="20** . ** . **" />
      </View>

      <View style={styles.infoSection}>
        <Text style={[styles.sectionTitle, Typography.Pretendard_B_16, { marginBottom: 15 }]}>
          계정 정보
        </Text>
        <InfoRow label="로그인 계정" value={String(user?.email || "")} />
      </View>

      <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, Typography.Pretendard_M_14]}>{label}</Text>
      <Text style={[styles.infoValue, Typography.Pretendard_M_14]}>
        {value && value.trim() !== "" ? value : "정보 없음"}
      </Text>
    </View>
  );
}
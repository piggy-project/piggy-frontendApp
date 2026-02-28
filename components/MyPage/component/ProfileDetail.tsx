import MyPageDetailHeader from '@/components/Header/MyPageDetailHeader';
import { useAuth } from '@/components/utils/AuthContext';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ProfileDetail.styles';

export default function ProfileDetail() {
  const { user, logout } = useAuth();
  const router = useRouter();

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
      <MyPageDetailHeader/>
      <View style={styles.profileSection}>
        <View style={styles.largeProfileImage}>
          <Text style={Typography.Pretendard_M_12}>프로필</Text>
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={12} color="white" />
          </View>
        </View>
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
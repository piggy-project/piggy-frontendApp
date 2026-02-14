import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SocialLoginButtons from '../../components/LoginPage/component/SocialLoginButtons';
import MyPage from '../../components/MyPage/MyPage';
import { getToken, removeToken } from '../../components/utils/authStore';

export default function My() {
  const navigation = useNavigation();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 화면에 포커스가 올 때마다 토큰 체크 (로그인/회원가입 후 돌아왔을 때 반영)
  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await getToken();
        setIsLoggedIn(!!token); // 토큰이 있으면 true
        setLoading(false);
      };
      checkLoginStatus();
    }, [])
  );

  // 탭바 숨기기/보이기 처리
  useLayoutEffect(() => {
    navigation.setOptions({
      // 로그인이 안 되어 있으면 탭바 숨김 (Welcome 화면을 넓게 쓰기 위해)
      tabBarStyle: { display: isLoggedIn ? 'flex' : 'none' },
    });
  }, [navigation, isLoggedIn]);

  // 로그아웃 함수
  const handleLogout = async () => {
    await removeToken();
    setIsLoggedIn(false);
  };

  // 로딩 중일 때
  if (loading) return null; 

  // 1. 로그인이 되어있다면 -> 마이페이지 표시
  if (isLoggedIn) {
    return <MyPage onLogout={handleLogout} />;
  }

  // 2. 로그인이 안 되어있다면 -> 웰컴 화면 표시
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => router.replace('/')} // 홈으로 이동
      >
        <Ionicons name="close" size={30} color="#333" />
      </TouchableOpacity>
      {/* 상단 타이틀 & 캐릭터 */}
      <View style={styles.topContent}>
        <Text style={styles.title}>환율로 떠나는{'\n'}똑똑한 여행</Text>
        <Text style={styles.subTitle}>PIGGY에 오신것을 환영해요!</Text>
        
        <View style={styles.circlePlaceholder}>
          <Text style={styles.placeholderText}>캐릭터</Text>
        </View>
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.footer}>
        <SocialLoginButtons />
        
        <View style={styles.emailActionContainer}>
          {/* 이메일 로그인 페이지로 이동 */}
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.emailActionText}>이메일 로그인</Text>
          </TouchableOpacity>
          
          <Text style={styles.divider}>|</Text>

          {/* 회원가입 첫 단계(약관)로 이동 */}
          <TouchableOpacity onPress={() => router.push('/signup/terms')}>
            <Text style={styles.emailActionText}>이메일 회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 60,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  topContent: {
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 38,
    color: '#333',
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
  },
  circlePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    gap: 30,
  },
  emailActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  emailActionText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  divider: {
    color: '#ccc',
    fontSize: 14,
  },
});
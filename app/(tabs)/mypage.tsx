import React, { useEffect, useState } from 'react';
import LoginPage from '../../components/LoginPage/LoginPage';
import MyPage from '../../components/MyPage/MyPage';
import UserRegisterPage from '../../components/UserRegisterPage/UserRegisterPage';
import { getToken, removeToken } from '../../components/utils/authStore';

export default function My() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 앱 켜지면 토큰 검사
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken();
      if (token) {
        // 토큰이 있으면 로그인 된 것으로 간주
        setIsLoggedIn(true);
      }
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  // 로그아웃 함수 정의
  const handleLogout = async () => {
    await removeToken(); // 저장소에서 토큰 삭제
    setIsLoggedIn(false);
    setShowLogin(false);
  };

  if (loading) return null; // 혹은 로딩 스피너

  if (isLoggedIn) {
    return <MyPage onLogout={handleLogout} />;
  }

  // 1. 로그인이 되어있다면 -> 마이페이지
  if (isLoggedIn) {
    return <MyPage onLogout={handleLogout} />;
  }

  // 2. 로그인 화면 보기 상태라면 -> 로그인 페이지
  if (showLogin) {
    return (
      <LoginPage 
        onBack={() => setShowLogin(false)} 
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    );
  }

  // 3. 기본값 -> 회원가입 페이지
  return (
    <UserRegisterPage 
      onLoginPress={() => setShowLogin(true)} 
    />
  );
}
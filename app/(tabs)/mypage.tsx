import React, { useState } from 'react';
// 경로에 맞춰 import 해주세요
import MyPage from '../../components/MyPage/MyPage';
import UserRegisterPage from '../../components/UserRegisterPage/UserRegisterPage';
import LoginPage from '../../components/LoginPage/LoginPage';

export default function My() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [showLogin, setShowLogin] = useState(false);   // 로그인 화면 보여줄지 여부

  // 1. 로그인이 되어있다면 -> 마이페이지
  if (isLoggedIn) {
    return <MyPage />;
  }

  // 2. 로그인 화면 보기 상태라면 -> 로그인 페이지
  if (showLogin) {
    return (
      <LoginPage 
        // 뒤로가기 누르면 다시 회원가입(웰컴) 화면으로 돌아감
        onBack={() => setShowLogin(false)} 
        // 로그인 성공 시 처리
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    );
  }

  // 3. 기본값 -> 회원가입 페이지
  return (
    <UserRegisterPage 
      // 여기서 로그인 버튼을 누르면 showLogin을 true로 변경!
      onLoginPress={() => setShowLogin(true)} 
      // onFinish={() => setIsLoggedIn(true)} 
    />
  );
}
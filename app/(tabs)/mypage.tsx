// app/(tabs)/mypage.tsx
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import MyPage from '../../components/MyPage/MyPage';
import SignupWelcome from '../signup/index';
import { getToken, removeToken } from '../../components/utils/authStore';

export default function My() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await getToken();
        setIsLoggedIn(!!token);
      };
      checkLoginStatus();
    }, [])
  );

  const handleLogout = async () => {
    await removeToken();
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) return null;

  if (isLoggedIn === false) {
    return <SignupWelcome />;
  }

  return <MyPage />;
}
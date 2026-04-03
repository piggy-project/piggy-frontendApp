// app/(tabs)/mypage.tsx
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import MyPage from '../../components/MyPage/MyPage';
import { getAccessToken, removeToken } from '../../components/utils/authStore';
import SignupWelcome from '../signup/index';

export default function My() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await getAccessToken();
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